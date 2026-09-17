import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const client = resolve(root, "dist/client");
const server = resolve(root, "dist/server");
const pages = resolve(root, "dist/pages");

async function browserScripts(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const scripts = {};
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) Object.assign(scripts, await browserScripts(path));
    if (entry.isFile() && entry.name.endsWith(".js")) {
      const publicPath = `/${relative(client, path).split(sep).join("/")}`;
      scripts[publicPath] = await readFile(path, "utf8");
    }
  }
  return scripts;
}

await rm(pages, { recursive: true, force: true });
await mkdir(pages, { recursive: true });

// Pages Advanced Mode expects static assets at the output root.
await cp(client, pages, { recursive: true });

// vinext emits an unbundled Worker module tree. Pages requires its `_worker.js`
// entry to be self-contained, so bundle the Pages wrapper and every vinext
// dependency; Worker-native `node:*` imports remain runtime externals.
const scripts = await browserScripts(resolve(client, "_next"));
const pagesWorkerEntry = `
  import app from "./dist/server/index.js";

  const browserScripts = ${JSON.stringify(scripts)};

  export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const script = browserScripts[url.pathname];
      if (script !== undefined) {
        return new Response(script, {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        });
      }

      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      return app.fetch(request, env, ctx);
    }
  };
`;
await build({
  stdin: {
    contents: pagesWorkerEntry,
    resolveDir: root,
    sourcefile: "pages-worker-entry.mjs"
  },
  outfile: resolve(pages, "_worker.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  external: ["node:*"]
});

// `_worker.js` is the Pages Function entry, not a static public asset.
await writeFile(resolve(pages, ".assetsignore"), "_worker.js\n");

console.log("Created Pages Advanced Mode output in dist/pages.");
