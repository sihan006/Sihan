import { notFound, redirect } from "next/navigation";
import Portfolio from "../../components/Portfolio";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "zh") notFound();
  const path = slug?.join("/") ?? "";
  if (path === "about") redirect(`/${locale}`);
  if (path === "work/lishang") redirect(`/${locale}/work`);
  return <Portfolio locale={locale as "en" | "zh"} page={path || "home"} />;
}
