import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const temporaryOutput = await mkdtemp(resolve(tmpdir(), "sihan-pages-"));
await cp(resolve(root, "dist/pages"), temporaryOutput, { recursive: true });

const command = process.platform === "win32" ? "wrangler.cmd" : "wrangler";
const child = spawn(resolve(root, "node_modules/.bin", command), [
  "pages", "dev", ".",
  "--compatibility-date", "2026-05-15",
  "--compatibility-flags", "nodejs_compat",
], { cwd: temporaryOutput, stdio: "inherit" });

let cleaningUp = false;
async function cleanup(exitCode = 0) {
  if (cleaningUp) return;
  cleaningUp = true;
  await rm(temporaryOutput, { recursive: true, force: true });
  process.exit(exitCode);
}

process.once("SIGINT", () => {
  child.kill("SIGINT");
});
process.once("SIGTERM", () => {
  child.kill("SIGTERM");
});
child.once("exit", (code) => cleanup(code ?? 0));
