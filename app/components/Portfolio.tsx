"use client";

import { useEffect, useRef, useState } from "react";

type Locale = "en" | "zh";
type Project = {
  slug: string;
  index: string;
  group: "internship" | "independent";
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
};

const img = (name: string) => `/assets/${name}`;

const copy = {
  en: {
    nav: { work: "Work", experience: "Experience", contact: "Contact" },
    work: "Selected work",
    internship: "Internship work",
    independent: "Independent projects",
    allWork: "All work",
    back: "All work",
    star: { situation: "Project background", task: "Goal & role", action: "What I did", result: "Result & review" },
  },
  zh: {
    nav: { work: "作品", experience: "经历", contact: "联系" },
    work: "精选作品",
    internship: "实习项目",
    independent: "独立项目",
    allWork: "全部作品",
    back: "全部作品",
    star: { situation: "项目背景", task: "目标与职责", action: "具体行动", result: "结果与复盘" },
  },
} as const;

const caseKinds = ["situation", "task", "action", "result"] as const;

const projects: Project[] = [
  { slug: "dw", index: "01", group: "internship", title: { en: "Xiaohongshu Multi-account Operations", zh: "小红书多账号运营与数据分析" }, subtitle: { en: "Daniel Wellington · Content & data review", zh: "Daniel Wellington" } },
  { slug: "refrear", index: "02", group: "internship", title: { en: "Creator Briefing, KOL Selection & Post-campaign Review", zh: "美瞳品牌 Brief 撰写、KOL 筛选与投后复盘" }, subtitle: { en: "Refrear", zh: "Refrear" } },
  { slug: "caa", index: "03", group: "internship", title: { en: "WeChat Content, Copy & Typesetting", zh: "公众号内容策划、文案与排版" }, subtitle: { en: "CAA China", zh: "CAA China" } },
  { slug: "tencent", index: "04", group: "internship", title: { en: "Tencent China Automotive Media Matrix Research", zh: "腾讯中国汽车新媒体矩阵调研" }, subtitle: { en: "Tencent CSIG", zh: "Tencent CSIG" } },
  { slug: "workbook", index: "05", group: "independent", title: { en: "Graduate Recruitment Workbook", zh: "秋招信息工作台" }, subtitle: { en: "Independent project", zh: "独立项目" } },
  { slug: "can-buy-lah", index: "06", group: "independent", title: { en: "AI Shopping-decision MVP", zh: "AI 购物决策 MVP" }, subtitle: { en: "Can Buy Lah", zh: "Can Buy Lah" } },
];

function toPath(locale: Locale, path = "") { return `/${locale}${path ? `/${path}` : ""}`; }

function ImageButton({ src, alt }: { src: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [closing, setClosing] = useState(false);
  const close = () => {
    if (timer.current) return;
    setClosing(true);
    timer.current = setTimeout(() => { dialog.current?.close(); setClosing(false); timer.current = null; }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); document.body.style.overflow = ""; }, []);
  return <><button ref={trigger} className="media-button" onClick={() => { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }} aria-label={`Open ${alt}`}><img src={img(src)} alt={alt} loading="lazy" /></button><dialog ref={dialog} className={`image-dialog ${closing ? "is-closing" : ""}`} aria-label={alt} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => { document.body.style.overflow = ""; trigger.current?.focus(); }}><button className="lightbox-close" onClick={close} aria-label="Close image / 关闭图片">×</button><img src={img(src)} alt={alt} loading="lazy" /><p>{alt}</p></dialog></>;
}

function Visual({ src, alt, caption, variant = "landscape" }: { src: string; alt: string; caption: string; variant?: "portrait" | "landscape" | "phone" | "document" }) {
  return <figure className={`case-visual ${variant}`}><ImageButton src={src} alt={alt} /><figcaption>{caption}</figcaption></figure>;
}

function Header({ locale, current }: { locale: Locale; current: string }) {
  const t = copy[locale];
  const toggle = locale === "en" ? "zh" : "en";
  const [section, setSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  useEffect(() => {
    if (current !== "home") return;
    const update = () => {
      const ids = ["work", "about", "experience"];
      const active = ids.filter((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 160).pop();
      setSection(active || "");
    };
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => window.removeEventListener("scroll", update);
  }, [current]);
  const suffix = current === "home" ? "" : `/${current}`;
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}><a className="brand" href={toPath(locale)} aria-label="Sihan Wang home">Sihan <span>Wang</span></a><nav aria-label="Primary navigation"><a className={(current.startsWith("work") || section === "work") ? "active" : ""} href={current === "home" ? "#work" : toPath(locale, "work")}>{t.nav.work}</a><a className={section === "about" ? "active" : ""} href={`${current === "home" ? "" : toPath(locale)}#about`}>{locale === "zh" ? "关于" : "About"}</a><a className={(current === "experience" || section === "experience") ? "active" : ""} href={`${current === "home" ? "" : toPath(locale)}#experience`}>{t.nav.experience}</a></nav><div className="header-actions"><a className="locale-toggle" href={toPath(toggle, suffix.replace(/^\//, ""))}>{toggle.toUpperCase()}</a><a className="contact-dot" href="mailto:sihan006@e.ntu.edu.sg">{t.nav.contact}</a></div></header>;
}

const projectMedia: Record<string, { src: string; format: string; label: string }> = {
  dw: { src: "dw-ice-blue-post.jpg", format: "phone", label: "Content · Social · Data" },
  refrear: { src: "refrear-shoot-guideline.png", format: "document", label: "Creators · Brief · Review" },
  caa: { src: "caa-sarah-brightman.png", format: "document", label: "Editorial · WeChat" },
  tencent: { src: "tencent-media-research.jpg", format: "document", label: "Research · Strategy" },
  workbook: { src: "workbook-overview.png", format: "browser", label: "Information · Workflow" },
  "can-buy-lah": { src: "canbuy-product.png", format: "phone", label: "AI · Product · MVP" },
};

type CaseTheme = {
  slug: Project["slug"];
  texture: string;
  textureCredit: string;
  mark: string;
};

// The atmospheric layers are deliberately separate from the project evidence.
// They are free web textures, while every card, interface and data point stays project-authentic.
const caseThemes: Record<Project["slug"], CaseTheme> = {
  dw: { slug: "dw", texture: "https://images.unsplash.com/photo-1770479314185-3bfe403e722c?auto=format&fit=crop&fm=jpg&q=72&w=2400", textureCredit: "Alexey O / Unsplash", mark: "TIDE / CONTENT" },
  refrear: { slug: "refrear", texture: "https://images.unsplash.com/photo-1710988443691-eadf212ea183?auto=format&fit=crop&fm=jpg&q=72&w=2400", textureCredit: "Michael Dziedzic / Unsplash", mark: "FILTER / CREATOR" },
  caa: { slug: "caa", texture: "https://images.unsplash.com/photo-1609039504401-47ac3940f378?auto=format&fit=crop&fm=jpg&q=72&w=2400", textureCredit: "Camille Roux / Unsplash", mark: "STAGE / EDITORIAL" },
  tencent: { slug: "tencent", texture: "https://everytexture.com/wp-content/uploads/2020/11/everytexture.com-stock-digital-texture-00094.jpg", textureCredit: "EveryTexture", mark: "SIGNAL / MATRIX" },
  workbook: { slug: "workbook", texture: "https://images.unsplash.com/photo-1689443111287-5c2e129ec756?auto=format&fit=crop&fm=jpg&q=72&w=2400", textureCredit: "Martin Martz / Unsplash", mark: "SYSTEM / INDEX" },
  "can-buy-lah": { slug: "can-buy-lah", texture: "https://images.unsplash.com/photo-1776696003029-f5c155c594be?auto=format&fit=crop&fm=jpg&q=72&w=2400", textureCredit: "Hilly van Eerten / Unsplash", mark: "SCAN / DECIDE" },
};

function WorkShowcase({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(projects[0].slug);
  const selected = projects.find((p) => p.slug === active)!;
  return <section id="work" className="work-showcase"><div className="work-heading" data-reveal><div><p className="eyebrow">Selected work / 2026</p><h2>{copy[locale].work}<span className="work-count">(06)</span></h2></div><p>{locale === "zh" ? "内容、研究与数字化实践" : "Content, research & digital practice"}</p></div><div className="work-editorial"><div className="work-directory">{projects.map((project, i) => <div key={project.slug}>{(i === 0 || i === 4) && <p className="directory-label">{i === 0 ? copy[locale].internship : copy[locale].independent}</p>}<a className={`editorial-project ${active === project.slug ? "is-active" : ""}`} href={toPath(locale, `work/${project.slug}`)} onMouseEnter={() => setActive(project.slug)} onFocus={() => setActive(project.slug)}><span className="project-number">{project.index}</span><div><p>{project.subtitle[locale]}</p><h3>{project.title[locale]}</h3></div><span className="project-arrow" aria-hidden="true">↗</span><div className={`mobile-project-media media-${projectMedia[project.slug].format}`}><img src={img(projectMedia[project.slug].src)} alt="" loading="lazy" /></div></a></div>)}</div><div className="work-preview"><a href={toPath(locale, `work/${selected.slug}`)} aria-label={`${copy[locale].work}: ${selected.title[locale]}`}><div className="preview-stage">{projects.map((p) => <div key={p.slug} className={`preview-layer media-${projectMedia[p.slug].format} ${active === p.slug ? "is-active" : ""}`} aria-hidden={active !== p.slug}><img src={img(projectMedia[p.slug].src)} alt={p.title[locale]} loading="lazy" /></div>)}<span className="preview-corner" aria-hidden="true">↗</span></div><div className="preview-caption"><span>{selected.index} / {selected.subtitle[locale]}</span><span>{projectMedia[selected.slug].label}</span></div></a></div></div></section>;
}

function MediterraneanBoat() {
  return <svg className="mediterranean-boat" viewBox="0 0 180 150" aria-hidden="true"><path d="M22 116h136M48 112c23 12 60 12 86 0M87 112V38l46 74M87 38 55 82h32M87 25v13M34 123h112" /><path d="M118 53c8-9 16-9 24 0" /></svg>;
}

function SkillIcon({ kind }: { kind: string }) {
  const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "strategy") return <svg className="skill-icon" viewBox="0 0 48 48" aria-hidden="true"><path {...base} d="M13 8h17l6 6v26H13zM19 22h11M19 28h11M19 34h7" /><path {...base} d="M30 8v7h6" /></svg>;
  if (kind === "operations") return <svg className="skill-icon" viewBox="0 0 48 48" aria-hidden="true"><circle {...base} cx="17" cy="17" r="5" /><circle {...base} cx="32" cy="19" r="4" /><path {...base} d="M8 36c1-6 5-9 9-9s8 3 9 9M27 35c1-4 3-6 6-6 3 0 5 2 6 6" /></svg>;
  if (kind === "data") return <svg className="skill-icon" viewBox="0 0 48 48" aria-hidden="true"><path {...base} d="M10 39V25h8v14M20 39V13h8v26M30 39V20h8v19M7 39h34" /></svg>;
  if (kind === "architecture") return <svg className="skill-icon" viewBox="0 0 48 48" aria-hidden="true"><path {...base} d="m24 8 15 8-15 8-15-8zM9 25l15 8 15-8M9 33l15 8 15-8" /></svg>;
  if (kind === "ai") return <svg className="skill-icon" viewBox="0 0 48 48" aria-hidden="true"><rect {...base} x="10" y="13" width="25" height="20" rx="2" /><path {...base} d="M18 39h10M23 33v6M39 10v10M34 15h10M39 6v3M39 21v3M30 15h3M45 15h-3" /></svg>;
  return <svg className="skill-icon" viewBox="0 0 48 48" aria-hidden="true"><circle {...base} cx="21" cy="21" r="10" /><path {...base} d="m29 29 10 10M17 21h8M21 17v8" /></svg>;
}

function Metrics({ items }: { items: { value: string; label: string }[] }) { return <div className="metrics">{items.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>; }

function StarSection({ locale, kind, facts = [], children }: { locale: Locale; kind: keyof (typeof copy)["en"]["star"]; facts?: string[]; children: React.ReactNode }) {
  const letter = { situation: "S", task: "T", action: "A", result: "R" }[kind];
  const order = { situation: "01", task: "02", action: "03", result: "04" }[kind];
  return <section id={`case-${kind}`} className={`star-section star-${kind}`}><div className="star-label"><span>{letter}</span><p>{copy[locale].star[kind]}</p></div><div className="star-body"><span className="chapter-kicker">{order} / {letter} / {copy[locale].star[kind]}</span><div className="star-copy">{children}</div>{facts.length > 0 && <ul className="star-facts">{facts.map((fact, index) => <li key={fact}><em>{String(index + 1).padStart(2, "0")}</em>{fact}</li>)}</ul>}<span className="chapter-orbit" aria-hidden="true" /></div></section>;
}

function CaseProgress({ locale }: { locale: Locale }) {
  const items = caseKinds.map((kind) => ({ kind, letter: { situation: "S", task: "T", action: "A", result: "R" }[kind], label: copy[locale].star[kind] }));
  const [active, setActive] = useState(items[0].kind);
  useEffect(() => {
    const sections = caseKinds.map((kind) => document.getElementById(`case-${kind}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id.replace("case-", "") as typeof active); }), { rootMargin: "-24% 0px -62% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [locale]);
  return <nav className="case-progress" aria-label={locale === "zh" ? "项目阅读导航" : "Case-study navigation"}><a className="case-progress-top" href="#case-top" aria-label={locale === "zh" ? "返回项目顶部" : "Back to top"}>↑</a><ol>{items.map((item) => <li key={item.kind}><a className={active === item.kind ? "active" : ""} href={`#case-${item.kind}`} aria-label={item.label}><span>{item.letter}</span><b>{item.label}</b></a></li>)}</ol></nav>;
}

function CaseIntro({ locale, index, title, description, group, theme }: { locale: Locale; index: string; title: string; description: string; group: "internship" | "independent"; theme: CaseTheme }) {
  const zh = locale === "zh";
  const hero = projectMedia[theme.slug];
  return <><CaseProgress locale={locale} /><section id="case-top" className="case-intro" style={{ "--case-texture": `url("${theme.texture}")` } as React.CSSProperties}><div className="case-intro-copy"><a className="back-link" href={toPath(locale, "work")}>← {copy[locale].back}</a><p className="case-label">{index} / {group === "internship" ? (zh ? "实习项目" : "Internship work") : (zh ? "独立项目" : "Independent project")}</p><span className="case-mark">{theme.mark}</span><h1>{title}</h1><p>{description}</p><div className="case-intro-footer"><span>{zh ? "案例阅读" : "Case study"}</span><a href="#case-situation">{zh ? "开始阅读" : "Start reading"}<i aria-hidden="true">↓</i></a><span>{theme.textureCredit}</span></div></div><div className={`case-hero-art media-${hero.format}`} aria-hidden="true"><span>{hero.label}</span><div className="case-hero-frame"><img src={img(hero.src)} alt="" /></div><i>{index}</i></div></section></>;
}

function DWCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main className="case-page case-dw"><CaseIntro locale={locale} index="01" group="internship" theme={caseThemes.dw} title="Daniel Wellington" description={zh ? "小红书多账号运营、内容趋势研究与月度数据分析。" : "Xiaohongshu multi-account operations, content trend research and monthly data analysis."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["3 个小红书账号", "新品、520、618", "同步公众号"] : ["3 Xiaohongshu accounts", "New product, 520, 618", "WeChat alignment"]}><p>{zh ? "为三个小红书账号和公众号 Campaign 建立不重复、但一致的北欧年轻化内容表达。" : "Create a Nordic, youthful content system that stays consistent without repeating across three Xiaohongshu accounts and WeChat campaigns."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["趋势与选题", "月度内容规划", "发布与复盘"] : ["Trends & topics", "Monthly planning", "Publishing & review"]}><p>{zh ? "负责从趋势研究、选品选题到 Brief、文案、发布和月度数据复盘的完整小红书流程。" : "Own the Xiaohongshu workflow from trend research and topics to briefs, copy, publishing and monthly review."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["账号定位", "场景化表达", "Excel 横向比较"] : ["Account positioning", "Situational storytelling", "Excel comparisons"]}><p>{zh ? "结合产品、热点与趋势定选题，再按账号定位改写角度；用场景和搭配讲产品，并以月度数据调整形式与标题。" : "Build topics from products, trends and platform moments; adapt the angle per account, tell product stories through scenes, then refine formats and titles with monthly data."}</p></StarSection>
    <section className="evidence-section"><div className="evidence-heading"><p className="eyebrow">Content pool & account adaptation</p><h2>{zh ? "多账号内容运营：内容转译、选题示例与互动表现" : "Multi-account content: adaptation, selected executions & engagement"}</h2><p>{zh ? "以统一内容池为起点，根据官方主账号、新品体验官和配饰种草官的定位转译选题、素材和表达；下方展示其中两项已发布内容作为执行样例。" : "A shared content pool was translated into topics, visuals and tone for the official account, product-experience account and accessories account. The two items below are selected published executions, not the full scope of the work."}</p></div><div className="post-grid"><article className="post-card"><Visual src="dw-ice-blue-post.jpg" alt="DW ice-blue Xiaohongshu post" variant="portrait" caption={zh ? "冰河蓝表盘笔记：从春日叠戴场景切入，完成图片组合与文案撰写。" : "Ice-blue dial post: image pairing and copy built around a spring layering scene."} /><p className="post-copy">“💧春天锁死这抹冰河蓝！美到原地封神🦋<br />这是什么神仙叠戴公式啊！！<br />DW 椭圆表冰河蓝表盘像把银河切了一角🌌”</p><div className="post-metrics"><span>931 {zh ? "赞" : "likes"}</span><span>110 {zh ? "收藏" : "saves"}</span><span>10 {zh ? "评论" : "comments"}</span></div></article><article className="post-card"><Visual src="dw-charms-post.jpg" alt="DW Charms Xiaohongshu post" variant="portrait" caption={zh ? "Charms 系列笔记：围绕淡彩系北欧配饰完成选题、产品呈现和文案。" : "Charms post: topic, product styling and copy for a pale-colour Nordic accessories story."} /><p className="post-copy">“春天要叮叮当当🌿🔔淡彩系北欧小众配饰✨<br />DW Charms 密语系列<br />叮叮当当的天然彩宝，收集了一整片春天花园的灵气。”</p><div className="post-metrics"><span>651 {zh ? "赞" : "likes"}</span><span>93 {zh ? "收藏" : "saves"}</span></div></article></div></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["新增粉丝 125", "单篇 1,000+ 赞", "增加视频与互动"] : ["125 new followers", "1,000+ likes on a post", "More video & interaction"]}><p>{zh ? "三账号累计新增 125 位粉丝，最高单篇获赞 1,000+；复盘后增加视频与互动内容。" : "The three accounts added 125 followers and the best post exceeded 1,000 likes; the review led to more video and interactive content."}</p></StarSection>
    <section className="evidence-section data-evidence"><div className="evidence-heading"><p className="eyebrow">Data analysis & content optimisation</p><h2>{zh ? "小红书数据分析与内容优化" : "Xiaohongshu data analysis & content optimisation"}</h2><p>{zh ? "月度复盘覆盖阅读、互动、点击率、涨粉和内容形式表现。图文平均点击率为 5.4%，视频平均点击率为 24.7%；结论用于下一轮选题和内容形式调整。" : "Monthly review covered reach, interaction, click-through, follower growth and format performance. Average click-through was 5.4% for image posts and 24.7% for video; the findings guided the next content cycle."}</p></div><div className="visual-grid two"><Visual src="dw-new-product-data.png" alt="DW Xiaohongshu content data analysis" caption={zh ? "图文与视频内容的阅读、互动和点击率对比，用于判断内容形式和选题方向。" : "Image-post and video performance comparison used to refine format and topic decisions."} /><Visual src="dw-followers.png" alt="DW Xiaohongshu follower analysis" caption={zh ? "三账号粉丝走势与画像分析，为账号定位和内容安排提供参考。" : "Follower trends and audience profiles across the three accounts informed account positioning and planning."} /></div></section>
  </main>;
}

function RefrearCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main className="case-page case-refrear"><CaseIntro locale={locale} index="02" group="internship" theme={caseThemes.refrear} title="Refrear" description={zh ? "美瞳品牌小红书 KOL 筛选、达人 Brief 与投后复盘。" : "Xiaohongshu KOL selection, creator briefing and post-campaign review for a colour-contact-lens brand."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["自然妆感", "生活化内容", "品牌与受众匹配"] : ["Natural makeup", "Everyday content", "Brand–audience fit"]}><p>{zh ? "为美瞳品牌寻找自然、生活化的达人；粉丝量之外，还要看调性、受众、互动与成本。" : "Find natural, everyday creators for a colour-contact-lens brand, balancing tone, audience, engagement and cost beyond follower count."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["筛选与推荐", "达人跟进", "Brief 与复盘"] : ["Selection & recommendations", "Creator follow-up", "Briefs & review"]}><p>{zh ? "在 mentor 与品牌评审流程中，完成达人筛选、推荐、沟通、内容 Brief 和投后数据回收。" : "Within mentor and client review, deliver creator selection, recommendations, outreach, briefs and post-campaign data collection."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["粉丝画像", "内容调性", "互动与 CPE"] : ["Audience profile", "Content tone", "Engagement & CPE"]}><p>{zh ? "先排除风格不符的账号，再将受众、互动、报价和商业笔记表现整理进达人库，按“画像 → 调性 → 表现与成本”筛选。" : "Remove off-tone accounts first, then structure audience, engagement, price and commercial-post data in a creator database, screening by audience → tone → performance and cost."}</p></StarSection>
    <section className="visual-grid three"><Visual src="refrear-style-brief.png" alt="Refrear creator style brief" variant="document" caption={zh ? "达人内容 Brief：自然妆感、品牌调性与交付方向。" : "Creator brief covering natural makeup, brand tone and delivery direction."} /><Visual src="refrear-eye-guideline.png" alt="Refrear product guideline" variant="document" caption={zh ? "产品表现要求：明确内容中需要看到的眼部产品重点。" : "Product-visibility guidance for eye-content delivery."} /><Visual src="refrear-shoot-guideline.png" alt="Refrear shooting guideline" variant="document" caption={zh ? "拍摄规范：统一景别、光线和画面重点。" : "Shooting guidance for consistent framing, light and focus."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["筛选 200+ 位达人", "每案推荐 30–40 人", "名单采纳率 50–60%"] : ["200+ creators screened", "30–40 recommended per project", "50–60% list adoption"]}><p>{zh ? "累计筛选 200+ 位达人；每案推荐约 30–40 人，品牌采纳约 50–60%。发布后回收数据，用于比较达人画像与内容表现。" : "Screened 200+ creators and recommended 30–40 per project, with 50–60% adoption. Post-campaign data informed comparisons of creator profiles and content performance."}</p></StarSection>
  </main>;
}

function CAACase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main className="case-page case-caa"><CaseIntro locale={locale} index="03" group="internship" theme={caseThemes.caa} title="CAA China" description={zh ? "CAA Campaign 公众号文章结构、文案撰写与排版。" : "WeChat article structure, copywriting and typesetting for CAA Campaign content."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["Campaign 主题", "艺人素材", "公众号阅读场景"] : ["Campaign theme", "Talent materials", "WeChat reading context"]}><p>{zh ? "把 Campaign 主题、艺人素材和传播重点整理成一条清晰的公众号阅读路径。" : "Shape campaign themes, talent materials and key messages into a clear WeChat reading journey."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["文章结构", "文案撰写", "页面排版"] : ["Article structure", "Copywriting", "Page typesetting"]}><p>{zh ? "参与内容策划，负责文章结构、文字表达与页面排版。" : "Contribute to content planning through structure, copy and page typesetting."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["标题 → 导语", "信息层级", "图文节奏"] : ["Headline → lead", "Information hierarchy", "Text-image rhythm"]}><p>{zh ? "先确定标题与导语，再安排信息优先级和图文节奏，让艺人、活动与品牌表达连续展开。" : "Set the headline and lead first, then shape hierarchy and text-image rhythm so talent, activity and brand messages unfold naturally."}</p></StarSection>
    <section className="visual-grid two narrow"><Visual src="caa-lighthouse.png" alt="CAA lighthouse WeChat article" variant="phone" caption={zh ? "CAA 年度书单第二季：完成文章结构、文案与公众号排版。" : "CAA annual book-list article: structure, copy and WeChat typesetting."} /><Visual src="caa-sarah-brightman.png" alt="CAA Sarah Brightman WeChat article" variant="phone" caption={zh ? "Sarah Brightman 相关内容：根据艺人素材和传播重点完成图文叙事。" : "Sarah Brightman content: a text-image narrative built from artist materials and communication priorities."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["已发布内容", "可复用内容框架"] : ["Published content", "Reusable content framework"]}><p>{zh ? "完成上线文章的文字与排版，并沉淀出可复用的方法：先排优先级，再让素材服务阅读节奏。" : "Delivered published articles and a reusable method: set priorities first, then let the materials serve the reading rhythm."}</p></StarSection>
  </main>;
}

function TencentCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main className="case-page case-tencent"><CaseIntro locale={locale} index="04" group="internship" theme={caseThemes.tencent} title={zh ? "腾讯汽车新媒体矩阵调研" : "Tencent Automotive Media Matrix Research"} description={zh ? "为一汽丰田中国市场的新媒体运营讨论提供行业比较和内容方向参考。" : "A comparative study to support new-media discussions for FAW Toyota China."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["一汽丰田中国市场", "公域与私域", "渠道与内容比较"] : ["FAW Toyota China", "Public & private channels", "Channel-content comparison"]}><p>{zh ? "为一汽丰田的新媒体讨论梳理国内外汽车品牌的渠道布局、内容表现与用户触点。" : "Map channel architecture, content performance and audience touchpoints across automotive brands for FAW Toyota’s new-media discussion."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["行业研究", "信息结构化", "建议输入"] : ["Industry research", "Information structure", "Recommendation inputs"]}><p>{zh ? "完成研究与信息结构化，为项目汇报提供统一的行业比较框架。" : "Deliver research and structured inputs for a unified comparison framework in the project deck."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["10+ 家车企", "8 个重点公域平台", "官网、App、小程序"] : ["10+ automotive brands", "8 key public platforms", "Website, app, mini-program"]}><p>{zh ? "从账号矩阵、平台分工、内容、活跃度和受众等维度研究 10+ 家车企，并比较公域与私域的触达方式。" : "Study 10+ automotive brands across account architecture, platform roles, content, activity and audiences, comparing public and private touchpoints."}</p></StarSection>
    <section className="visual-grid one"><Visual src="tencent-media-research.jpg" alt="Tencent automotive social-media research slide" caption={zh ? "研究框架示例：比较汽车品牌如何从强商业化表达转向更有沟通感和用户参与度的内容。" : "Framework example: comparing a shift from sales-led messaging toward communication and audience participation."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["矩阵分析", "优化建议", "进入项目汇报"] : ["Matrix analysis", "Optimisation recommendations", "Included in project deck"]}><p>{zh ? "形成新媒体矩阵分析与优化建议，结论进入项目汇报并支持后续渠道与内容讨论。" : "Produce a media-matrix analysis and optimisation recommendations that entered the project deck and informed later channel and content discussions."}</p></StarSection>
    <Metrics items={zh ? [{ value: "10+", label: "调研品牌" }, { value: "8", label: "重点公域平台" }, { value: "2", label: "公域与私域视角" }] : [{ value: "10+", label: "brands researched" }, { value: "8", label: "key public platforms" }, { value: "2", label: "public and private lenses" }]} />
  </main>;
}

function WorkbookCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main className="case-page case-workbook"><CaseIntro locale={locale} index="05" group="independent" theme={caseThemes.workbook} title={zh ? "秋招信息工作台" : "Graduate Recruitment Workbook"} description={zh ? "把岗位、申请、简历版本与复盘整理成可持续使用的个人系统。" : "A personal system for opportunities, applications, resume versions and retrospective learning."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["岗位来源", "申请进度", "简历与复盘"] : ["Opportunity sources", "Application states", "Resumes & review"]}><p>{zh ? "求职信息分散在不同文件和页面，申请状态、准备进度与简历版本难以持续追踪。" : "Job-search information spreads across files and pages, making applications, preparation and resume versions difficult to track."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["记录", "检索", "比较与复用"] : ["Record", "Search", "Compare & reuse"]}><p>{zh ? "独立设计一个能记录、检索、比较并复用求职信息的个人工作台。" : "Design an independent workspace that records, searches, compares and reuses job-search information."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["岗位池", "申请追踪", "简历版本与复盘"] : ["Opportunity pool", "Application tracking", "Resume versions & review"]}><p>{zh ? "以统一字段连接岗位、申请、简历和复盘模块，并用明确状态与下一步动作串起整个准备过程。" : "Connect opportunities, applications, resumes and review through shared fields, clear states and explicit next actions."}</p></StarSection>
    <section className="visual-grid workbook"><Visual src="workbook-overview.png" alt="Workbook overview" variant="document" caption={zh ? "系统总览：岗位、申请与复盘入口集中在同一工作台。" : "Overview: opportunities, applications and retrospective entry points in one workspace."} /><Visual src="workbook-opportunities.png" alt="Workbook opportunities" variant="document" caption={zh ? "岗位池：记录来源、方向、优先级与后续动作。" : "Opportunity pool: source, direction, priority and next action."} /><Visual src="workbook-tracking.png" alt="Workbook tracking" variant="document" caption={zh ? "申请追踪：可见的投递、面试与跟进状态。" : "Application tracking: visible application, interview and follow-up states."} /><Visual src="workbook-resume-versions.png" alt="Workbook resume versions" variant="document" caption={zh ? "简历版本：让岗位方向与对应版本可回溯、可复用。" : "Resume versions: traceable, reusable role-to-version matching."} /><Visual src="workbook-review.png" alt="Workbook retrospective" variant="document" caption={zh ? "过程复盘：沉淀结果、反馈和下次调整。" : "Retrospective: save outcomes, feedback and next adjustments."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["信息集中", "状态可见", "经验可复用"] : ["Centralised information", "Visible states", "Reusable learning"]}><p>{zh ? "把零散信息变成可检索、可比较的个人资产，让每次申请的经验直接进入下一轮准备。" : "Turn scattered information into a searchable, comparable asset so each application directly improves the next one."}</p></StarSection>
  </main>;
}

function CanBuyCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main className="case-page case-canbuy"><CaseIntro locale={locale} index="06" group="independent" theme={caseThemes["can-buy-lah"]} title="Can Buy Lah" description={zh ? "面向新加坡线下购物场景的 AI 辅助商品理解与比价 MVP。" : "An AI-assisted product-understanding and price-comparison MVP for in-store shopping in Singapore."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["英文包装", "陌生品牌", "价格与口碑分散"] : ["English packaging", "Unfamiliar brands", "Fragmented price & reviews"]}><p>{zh ? "中文用户在新加坡线下购物时，常需在翻译、搜索、电商与社媒之间来回切换，才能判断商品。" : "Chinese-speaking shoppers in Singapore switch among translation, search, marketplaces and social platforms before they can judge a product."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["问题拆解", "AI 输出规则", "可访问 MVP"] : ["Problem mapping", "AI output rules", "Accessible MVP"]}><p>{zh ? "独立完成从用户问题、产品流程和 AI 输出规则，到异常 Case 回查与 MVP 设计。" : "Independently take the product from user-problem mapping and AI output rules to error-case review and an accessible MVP."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["拍照 → 购买判断", "三级匹配规则", "价格优先级"] : ["Capture → purchase decision", "Three-tier matching", "Price priority"]}><p>{zh ? "把流程重构为“拍照—识别—检索—解读—比价—判断”，并为规格、口味与优惠价建立三级匹配规则。" : "Rebuild the journey as capture → identify → search → understand → compare → decide, with three-tier matching for size, flavour and promotional-price edge cases."}</p></StarSection>
    <section className="visual-grid three product"><Visual src="canbuy-discovery.png" alt="Can Buy Lah discovery screen" variant="phone" caption={zh ? "01 现场拍摄商品与价签，保留真实购物语境。" : "01 Capture product and shelf price in context."} /><Visual src="canbuy-product.png" alt="Can Buy Lah product screen" variant="phone" caption={zh ? "02 组织商品信息、口碑与使用建议。" : "02 Organise product information, feedback and guidance."} /><Visual src="canbuy-price.png" alt="Can Buy Lah price screen" variant="phone" caption={zh ? "03 并列现场价与线上参考价，明确购买判断。" : "03 Compare in-store and online references for a clear decision."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["识别准确率 90%+", "有效比价 85%+", "30 位测试用户"] : ["90%+ recognition accuracy", "85%+ effective price matches", "30 invited test users"]}><p>{zh ? "当前识别准确率为 90%+，有效比价成功率为 85%+；已邀请 30 位用户测试，并持续用错误 Case 优化规则。" : "The MVP currently reaches 90%+ recognition accuracy and 85%+ effective price matches, with 30 invited test users and ongoing error-case iteration."}</p></StarSection>
    <Metrics items={zh ? [{ value: "90%+", label: "商品图片识别准确率" }, { value: "85%+", label: "有效比价成功率" }, { value: "30", label: "已邀请测试用户" }] : [{ value: "90%+", label: "image-recognition accuracy" }, { value: "85%+", label: "effective price-match success" }, { value: "30", label: "invited test users" }]} />
  </main>;
}

function WorkIndex({ locale }: { locale: Locale }) { return <main><WorkShowcase locale={locale} /></main>; }

// Retained only while the prior layout is kept in source history for comparison.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyHome({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const skills = zh ? [{ label: "内容策略", detail: "来自 DW 与 CAA：梳理 Brief、标题与阅读节奏。", kind: "strategy" }, { label: "达人与平台运营", detail: "来自 Refrear：筛选达人、对齐 Brief 并完成投后回收。", kind: "operations" }, { label: "数据复盘", detail: "来自 DW 月度复盘：比较点击、互动与粉丝趋势。", kind: "data" }, { label: "信息架构", detail: "来自求职工作台：连接岗位、进度、简历与复盘。", kind: "architecture" }, { label: "AI 工具与工作流", detail: "来自 Can Buy Lah：把识别、检索与判断串成流程。", kind: "ai" }, { label: "市场与竞品研究", detail: "来自腾讯调研：比较品牌矩阵与内容方向。", kind: "research" }] : [{ label: "Content strategy", detail: "DW & CAA: shaped briefs, headlines and reading rhythm.", kind: "strategy" }, { label: "Creator & platform operations", detail: "Refrear: selected creators, aligned briefs and collected reviews.", kind: "operations" }, { label: "Data review", detail: "DW monthly review: compared click-through, engagement and growth.", kind: "data" }, { label: "Information architecture", detail: "Graduate workbook: connected roles, applications, resumes and review.", kind: "architecture" }, { label: "AI tools & workflows", detail: "Can Buy Lah: linked recognition, retrieval and purchase judgement.", kind: "ai" }, { label: "Market & competitor research", detail: "Tencent research: compared media matrices and content direction.", kind: "research" }];
  const movePhoto = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 12;
    event.currentTarget.style.setProperty("--photo-x", `${x}px`);
    event.currentTarget.style.setProperty("--photo-y", `${y}px`);
  };
  const resetPhoto = (event: React.MouseEvent<HTMLDivElement>) => { event.currentTarget.style.removeProperty("--photo-x"); event.currentTarget.style.removeProperty("--photo-y"); };
  return <main><section className="cover-screen" aria-label="Sihan Wang portfolio cover"><img src={img("portfolio-cover-v2.png")} alt="Sihan Wang portfolio cover" /><p>个人作品集</p><a className="cover-explore" href="#work">{zh ? "浏览作品" : "Explore selected work"}<span aria-hidden="true">↓</span></a></section><WorkShowcase locale={locale} /><section id="about" className="home-about"><span className="about-stamp" aria-hidden="true">SIN · LUCERNE<br />01°17′N / 8°18′E</span><span className="about-route" aria-hidden="true" /><div className="home-about-layout"><div className="home-about-copy about-card" data-reveal><MediterraneanBoat /><p className="eyebrow" data-about-part>Sihan Wang 王思涵 · Singapore</p><h1 data-about-part>About Sihan</h1><div className="about-prose" data-about-part><p className="home-lead">{zh ? "Hi，我是思涵，MBTI 是 INFJ。目前就读于南洋理工大学黄金辉信息与传播学院知识管理硕士，本科毕业于武汉理工大学网络与新媒体专业。" : "Hi, I’m Sihan, an INFJ. I am currently pursuing an MSc in Knowledge Management at NTU’s Wee Kim Wee School of Communication and Information, after completing a degree in Network and New Media at Wuhan University of Technology."}</p><p>{zh ? "我的实习经历主要聚焦内容运营、达人与用户运营、数据复盘和行业研究：从多账号内容规划与 KOL 筛选，到新媒体矩阵调研、跨部门项目推进，我习惯把复杂信息整理成清晰的下一步。学习和实习让我不断积累新的能力；我始终相信，认真走的每一步都会让人更接近想成为的自己。" : "My internship experience centres on content operations, creator and user operations, data review and industry research. From multi-account content planning and KOL selection to media-matrix research and cross-functional project delivery, I enjoy turning complex information into a clearer next step. Learning and practice keep adding to my toolkit, and I believe steady effort gets me closer to the person I want to become."}</p></div></div><div className="home-photo" data-reveal onMouseMove={movePhoto} onMouseLeave={resetPhoto}><span className="photo-paper photo-paper-back" aria-hidden="true" /><span className="photo-paper photo-paper-front" aria-hidden="true" /><img src={img("sihan-portrait-lucerne.jpg")} alt="Sihan Wang in Lucerne" /><span className="photo-index" aria-hidden="true">01 / PERSONAL ARCHIVE</span><span>Lucerne, Switzerland</span></div></div><section className="home-skills"><p className="eyebrow">{zh ? "能力方向" : "Capabilities"}</p><div>{skills.map((skill, index) => <button type="button" className="skill-card" key={skill.label}><span className="skill-order">0{index + 1}</span><SkillIcon kind={skill.kind} /><b>{skill.label}</b><p>{skill.detail}</p></button>)}</div></section></section><section id="experience" className="page-shell experience-page home-experience"><ExperienceContent locale={locale} /></section></main>;
}

function Home({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const skills = zh ? [
    { label: "内容策略", detail: "DW 与 CAA：参与 Brief、标题与阅读节奏梳理。", kind: "strategy" },
    { label: "达人与平台运营", detail: "Refrear：筛选达人、对齐 Brief、回收投后数据。", kind: "operations" },
    { label: "数据复盘", detail: "DW 月度复盘：比较点击、互动与粉丝趋势。", kind: "data" },
    { label: "信息架构", detail: "求职工作台：连接岗位、进度、简历与复盘。", kind: "architecture" },
    { label: "AI 工具与工作流", detail: "Can Buy Lah：串联识别、检索与购买判断。", kind: "ai" },
    { label: "市场与竞品研究", detail: "腾讯调研：比较品牌矩阵与内容方向。", kind: "research" },
  ] : [
    { label: "Content strategy", detail: "DW & CAA: supported briefs, headlines and reading rhythm.", kind: "strategy" },
    { label: "Creator & platform operations", detail: "Refrear: creator selection, briefs and post-campaign data.", kind: "operations" },
    { label: "Data review", detail: "DW monthly review: clicks, engagement and growth trends.", kind: "data" },
    { label: "Information architecture", detail: "Graduate workbook: roles, applications, resumes and review.", kind: "architecture" },
    { label: "AI tools & workflows", detail: "Can Buy Lah: recognition, retrieval and purchase judgement.", kind: "ai" },
    { label: "Market & competitor research", detail: "Tencent research: media matrices and content direction.", kind: "research" },
  ];
  const movePhoto = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--photo-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`);
    event.currentTarget.style.setProperty("--photo-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 12}px`);
  };
  const resetPhoto = (event: React.MouseEvent<HTMLDivElement>) => { event.currentTarget.style.removeProperty("--photo-x"); event.currentTarget.style.removeProperty("--photo-y"); };
  return <main>
    <section className="cover-screen" aria-label="Sihan Wang portfolio cover"><img src={img("portfolio-cover-v2.png")} alt="Sihan Wang portfolio cover" /><p>个人作品集</p><a className="cover-explore" href="#work">{zh ? "浏览作品" : "Explore selected work"}<span aria-hidden="true">↓</span></a></section>
    <WorkShowcase locale={locale} />
    <section id="about" className="home-about"><span className="about-stamp" aria-hidden="true">SIN · LUCERNE<br />01°17′N / 8°18′E</span><span className="about-route" aria-hidden="true" /><div className="home-about-layout"><div className="home-about-copy about-card" data-reveal><MediterraneanBoat /><p className="eyebrow" data-about-part>Sihan Wang 王思涵 · Singapore</p><h1 data-about-part>About Sihan</h1><div className="about-prose" data-about-part><p className="home-lead">{zh ? "Hi，我是思涵。目前就读于南洋理工大学黄金辉信息与传播学院知识管理硕士，本科毕业于武汉理工大学网络与新媒体专业。" : "Hi, I’m Sihan. I am currently pursuing an MSc in Knowledge Management at NTU’s Wee Kim Wee School of Communication and Information, after completing a degree in Network and New Media at Wuhan University of Technology."}</p><p>{zh ? "我的实习经历主要聚焦内容运营、达人与用户运营、数据复盘和行业研究：从多账号内容规划与 KOL 筛选，到新媒体矩阵调研、跨部门项目推进，我习惯把复杂信息整理成清晰的下一步。学习和实习让我不断积累新的能力；我始终相信，认真走的每一步都会让人更接近想成为的自己。" : "My internship experience centres on content operations, creator and user operations, data review and industry research. From multi-account content planning and KOL selection to media-matrix research and cross-functional project delivery, I enjoy turning complex information into a clearer next step. Learning and practice keep adding to my toolkit, and I believe steady effort gets me closer to the person I want to become."}</p></div></div><div className="home-photo" data-reveal onMouseMove={movePhoto} onMouseLeave={resetPhoto}><span className="photo-paper photo-paper-back" aria-hidden="true" /><span className="photo-paper photo-paper-front" aria-hidden="true" /><img src={img("sihan-portrait-lucerne.jpg")} alt="Sihan Wang in Lucerne" /><span className="photo-index" aria-hidden="true">01 / PERSONAL ARCHIVE</span><span>Lucerne, Switzerland</span></div></div><section className="home-skills"><p className="eyebrow">{zh ? "能力方向" : "Capabilities"}</p><div>{skills.map((skill, index) => <button type="button" className="skill-card" key={skill.label}><span className="skill-order">0{index + 1}</span><SkillIcon kind={skill.kind} /><b>{skill.label}</b><p>{skill.detail}</p></button>)}</div></section></section>
    <section id="experience" className="page-shell experience-page home-experience"><ExperienceContent locale={locale} /></section>
  </main>;
}

// Kept temporarily as the concise record used during content review; the archive below is the rendered version.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyExperienceContent({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <><section className="page-heading"><p className="eyebrow">Profile</p><h1>{zh ? "教育与实习经历" : "Education & internship experience"}</h1></section><section className="experience-group"><div className="experience-group-heading"><p className="eyebrow">01 / {zh ? "教育经历" : "Education"}</p></div><div className="experience-list"><article><span>2025.08—2027.01</span><div><h2>{zh ? "南洋理工大学" : "Nanyang Technological University"}</h2><h3>{zh ? "知识管理硕士" : "MSc Knowledge Management"}</h3><p>{zh ? "聚焦信息系统、研究与数字化实践。" : "Focused on information systems, research and digital practice."}</p></div></article><article><span>2021.09—2025.07</span><div><h2>{zh ? "武汉理工大学" : "Wuhan University of Technology"}</h2><h3>{zh ? "网络与新媒体学士" : "BA Network and New Media"}</h3><p>{zh ? "内容生产、平台传播与用户沟通的本科训练。" : "Undergraduate training in content production, platform communication and audience understanding."}</p></div></article></div></section><section className="experience-group"><div className="experience-group-heading"><p className="eyebrow">02 / {zh ? "实习经历" : "Internships"}</p></div><div className="experience-list"><article><span>2026.04—07</span><div><h2>{zh ? "中航材利顿航空科技" : "Aviation Technology Operations"}</h2><h3>{zh ? "运营管理办公室实习" : "Operations Management Office Intern"}</h3><p>{zh ? "跨部门材料推进、项目台账与会议行动项跟进。" : "Cross-functional materials coordination, project tracking and action follow-up."}</p></div></article><article><span>2025.04—06</span><div><h2>Allison+Partners</h2><h3>{zh ? "企业传播部公关实习生" : "Corporate Communications Intern"}</h3><p>{zh ? "DW、Refrear、CAA 与 BBC Earth 项目的内容、KOL 与数据复盘工作。" : "Content, creator and review work across DW, Refrear, CAA and BBC Earth projects."}</p></div></article><article><span>2024.01—03</span><div><h2>{zh ? "腾讯 CSIG 智慧出行" : "Tencent CSIG Smart Mobility"}</h2><h3>{zh ? "行业运营实习生" : "Industry Operations Intern"}</h3><p>{zh ? "汽车品牌新媒体矩阵研究、需求拆解与体验方案支持。" : "Automotive media research, requirement decomposition and experience-solution support."}</p></div></article><article><span>2023.06—08</span><div><h2>{zh ? "同方知网" : "CNKI"}</h2><h3>{zh ? "市场专员实习生" : "Marketing Intern"}</h3><p>{zh ? "市场研究、客户会议支持和从 0 到 1 的公众号内容生产。" : "Market research, customer-meeting support and end-to-end WeChat content production."}</p></div></article></div></section></>;
}

type EducationRecord = {
  period: string;
  school: Record<Locale, string>;
  degree: Record<Locale, string>;
  lead: Record<Locale, string>;
  note: Record<Locale, string>;
  courses: string[];
  capabilities: Record<Locale, string[]>;
  details: { title: Record<Locale, string>; text: Record<Locale, string>; items: Record<Locale, string[]>; media?: { src: string; label: Record<Locale, string> }[] }[];
};

const educationRecords: EducationRecord[] = [
  {
    period: "2025.08—2027.01",
    school: { zh: "南洋理工大学", en: "Nanyang Technological University" },
    degree: { zh: "知识管理硕士 · GPA 4.1 / 5.0", en: "MSc Knowledge Management · GPA 4.1 / 5.0" },
    lead: { zh: "课程涉及知识管理、信息组织、商业情报和数字化实践。", en: "Coursework spans knowledge management, information organisation, business intelligence and digital practice." },
    note: { zh: "已修 8 门核心与选修课程，以课程方法反哺研究、内容与数字化实践。", en: "Eight completed core and elective courses that inform research, content and digital practice." },
    courses: ["知识管理基础", "实践与实施", "信息与知识资产", "策略与政策", "知识管理技术", "知识组织", "商业情报", "信息创业"],
    capabilities: { zh: ["用知识流程、组织资产与用户场景拆解复杂问题", "把信息架构、分类法与检索逻辑落到内容和工作台", "通过商业情报、竞品和市场信号支持判断", "从策略、技术与实施三条线组织数字化项目"], en: ["Frame complex problems through knowledge flows, organisational assets and user contexts", "Apply information architecture, taxonomy and retrieval logic to content and workspaces", "Use business intelligence, competitor and market signals to support decisions", "Connect strategy, technology and implementation in digital projects"] },
    details: [
      { title: { zh: "课程主题", en: "Course themes" }, text: { zh: "已修课程围绕知识如何被整理、共享、检索与用于组织决策展开。", en: "Completed coursework examines how knowledge is organised, shared, retrieved and used in organisations." }, items: { zh: ["知识管理", "实践实施", "信息资产", "策略", "技术", "知识组织", "商业情报", "信息创业"], en: ["Knowledge management", "Implementation", "Information assets", "Strategy", "Technology", "Knowledge organisation", "Business intelligence", "Information entrepreneurship"] } },
      { title: { zh: "国际学习", en: "International learning" }, text: { zh: "通过 Communication and Knowledge Management 课程赴 USI Università della Svizzera italiana（Lugano）访学，学习跨文化交流与传播，并在教师带领下了解当地社会与文化。", en: "Visited USI Università della Svizzera italiana in Lugano through Communication and Knowledge Management, studying intercultural communication while learning about local society and culture." }, items: { zh: ["优秀学生 2,000 新币津贴", "跨文化交流与传播"], en: ["SGD 2,000 outstanding-student allowance", "Intercultural communication"] } },
      { title: { zh: "Critical Inquiry", en: "Critical Inquiry" }, text: { zh: "以 A 完成团队研究并担任组长，比较 9 家全球时尚与运动服饰企业的数字化转型。", en: "Led an A-grade team study comparing the digital transformation of nine global fashion and sportswear companies." }, items: { zh: ["组长", "5 维数字化转型能力矩阵", "公开资料比较研究"], en: ["Group leader", "Five-dimension digital-transformation matrix", "Public-source comparative research"] } },
    ],
  },
  {
    period: "2021.09—2025.07",
    school: { zh: "武汉理工大学", en: "Wuhan University of Technology" },
    degree: { zh: "网络与新媒体学士", en: "BA Network and New Media" },
    lead: { zh: "课程训练覆盖新闻、数字出版、平台内容与基础数据处理。", en: "Coursework covered journalism, digital publishing, platform content and foundational data handling." },
    note: { zh: "课程训练覆盖新闻、出版、平台传播与基础技术，把内容判断与可执行表达放在一起。", en: "Coursework combined journalism, publishing, platform communication and foundational technology." },
    courses: ["网络与新媒体", "新闻学", "数字出版", "新媒体内容生产", "用户与平台传播", "Python 基础与数据处理"],
    capabilities: { zh: ["围绕受众与平台语境组织选题、文案和内容结构", "将业务信息转译为清晰、适合阅读的图文表达", "理解内容生产、数字出版与分发之间的协作链路", "用基础 Python 与数据处理支持资料整理和研究"], en: ["Shape topics, copy and structure for audiences and platform contexts", "Translate business information into clear, readable editorial content", "Understand the workflow across content production, digital publishing and distribution", "Use foundational Python and data handling for research and information organisation"] },
    details: [
      { title: { zh: "课程与方法", en: "Coursework & methods" }, text: { zh: "把新闻、出版与平台内容放在同一套传播训练里，也接触 Python 与基础数据处理。", en: "Combined journalism, publishing and platform content with foundational Python and data-handling practice." }, items: { zh: ["网络与新媒体", "新闻学", "数字出版", "内容生产", "平台传播", "Python 与数据处理"], en: ["Network & new media", "Journalism", "Digital publishing", "Content production", "Platform communication", "Python & data handling"] } },
      { title: { zh: "校园经历", en: "Campus experience" }, text: { zh: "担任学习委员，并在武汉理工大学新媒体运营中心参与校园内容策划与制作。", en: "Served as class study representative and contributed to campus-content planning and production at WUT's New Media Operations Centre." }, items: { zh: ["校区地铁出行 B 站视频 · 1.1 万播放", "8 条抖音内容 · 平均约 1,000 点赞"], en: ["Campus metro-guide Bilibili video · 11,000 views", "8 Douyin videos · about 1,000 likes on average"] }, media: [{ src: "wut-douyin-subway.png", label: { zh: "出镜与制作", en: "On camera & production" } }, { src: "wut-douyin-classroom.png", label: { zh: "出镜与制作", en: "On camera & production" } }, { src: "wut-douyin-holiday.png", label: { zh: "创意策划", en: "Creative planning" } }, { src: "wut-douyin-crest.png", label: { zh: "创意策划", en: "Creative planning" } }] },
    ],
  },
];

type InternshipRecord = {
  period: string;
  company: Record<Locale, string>;
  role: Record<Locale, string>;
  lead: Record<Locale, string>;
  sections: { label: Record<Locale, string>; text: Record<Locale, string> }[];
  evidence: Record<Locale, string[]>;
};

const internshipRecords: InternshipRecord[] = [
  {
    period: "2026.04—07",
    company: { zh: "中航材利顿航空科技", en: "Aviation Technology Operations" },
    role: { zh: "运营管理办公室实习", en: "Operations Management Office Intern" },
    lead: { zh: "把分散材料、责任人与截止时间整理成可持续推进的项目台账。", en: "Turning dispersed materials, owners and deadlines into a trackable project ledger." },
    sections: [
      { label: { zh: "材料推进", en: "Material tracking" }, text: { zh: "根据上市筹备清单判断资料归属，向财务、人力与仓储等部门持续收集、核对并更新材料版本。", en: "Mapped listing-preparation requests to finance, HR and warehouse owners, then collected, checked and updated material versions." } },
      { label: { zh: "会议闭环", en: "Meeting follow-through" }, text: { zh: "记录问题、责任人和截止时间，把会议需求回传到对应部门并跟进状态。", en: "Captured issues, owners and deadlines, returned requests to the right teams and tracked status." } },
      { label: { zh: "对外内容", en: "External materials" }, text: { zh: "协助珠海航展宣传册前期资料、文案和图片梳理；最终视觉排版由外部团队完成。", en: "Prepared source material, copy and image organisation for a Zhuhai Airshow brochure; final visual design was completed externally." } },
    ],
    evidence: { zh: ["材料跟踪表", "会议纪要与行动项", "宣传册内容资料"], en: ["Material tracker", "Minutes & action log", "Brochure source materials"] },
  },
  {
    period: "2025.04—06",
    company: { zh: "Allison+Partners", en: "Allison+Partners" },
    role: { zh: "企业传播部公关实习生", en: "Corporate Communications Intern" },
    lead: { zh: "负责达人筛选、Brief 撰写、内容支持与投后数据回收。", en: "Supported creator selection, brief writing, editorial work and post-campaign data collection." },
    sections: [
      { label: { zh: "达人与复盘", en: "Creators & review" }, text: { zh: "为美瞳品牌按“画像—调性—互动/成本”筛选 200 余名 KOL，整理候选、沟通与投后数据回收。", en: "Screened 200+ KOLs for a contact-lens brand by audience, tone, engagement and cost; organised recommendations, outreach and post-campaign data." } },
      { label: { zh: "内容运营", en: "Content operations" }, text: { zh: "参与 DW 三个小红书账号的趋势研究、选题、Brief、文案、发布与月度复盘，并与公众号 Campaign 对齐。", en: "Contributed trend research, topics, briefs, copy, publishing and monthly review for three DW Xiaohongshu accounts, aligned with WeChat campaigns." } },
      { label: { zh: "编辑表达", en: "Editorial work" }, text: { zh: "参与 CAA Campaign 公众号内容策划与撰写，将既定主题、艺人素材和传播重点组织为连续阅读的图文。", en: "Planned and wrote CAA WeChat editorial content, turning supplied themes, talent material and communication points into a readable narrative." } },
    ],
    evidence: { zh: ["200+ KOL 候选池", "3 个小红书账号", "月度数据复盘"], en: ["200+ KOL candidate pool", "3 Xiaohongshu accounts", "Monthly data review"] },
  },
  {
    period: "2024.01—03",
    company: { zh: "腾讯 CSIG 智慧出行", en: "Tencent CSIG Smart Mobility" },
    role: { zh: "行业运营实习生", en: "Industry Operations Intern" },
    lead: { zh: "参与车展互动方案梳理和汽车新媒体矩阵调研。", en: "Contributed to auto-show interaction planning and automotive media-matrix research." },
    sections: [
      { label: { zh: "体验方案", en: "Experience design" }, text: { zh: "围绕车展 AI Partner，迭代约 30 道互动题、标签文案与场景匹配逻辑；方案获项目团队采纳并继续推进。", en: "Iterated roughly 30 interactive questions, tag copy and scenario-matching logic for an AI Partner auto-show experience; the approach was adopted for continued work." } },
      { label: { zh: "矩阵研究", en: "Media-matrix research" }, text: { zh: "调研 10 余家国内外汽车品牌，覆盖公域、私域、内容类型、近 30 天表现及用户触达方式，形成统一比较框架。", en: "Researched 10+ Chinese and global automotive brands across public/private channels, content types, recent performance and audience reach in one comparison framework." } },
      { label: { zh: "传播支持", en: "Communication support" }, text: { zh: "整理合作信息并撰写约 200 字新闻稿，稿件后续由团队转交相关部门。", en: "Organised partnership information and wrote an approximately 200-word news release that the team passed to the relevant department." } },
    ],
    evidence: { zh: ["30 题互动问卷", "10+ 品牌调研", "矩阵分析与优化建议"], en: ["30-question interaction flow", "10+ brands researched", "Matrix analysis & recommendations"] },
  },
  {
    period: "2023.06—08",
    company: { zh: "同方知网", en: "CNKI" },
    role: { zh: "市场专员实习生", en: "Marketing Intern" },
    lead: { zh: "通过市场研究、会议记录与公众号内容，配合团队内外部沟通。", en: "Supported internal and external team communication through market research, meeting records and WeChat content." },
    sections: [
      { label: { zh: "市场研究", en: "Market research" }, text: { zh: "每周检索教育数字化、高校及政教相关政策和行业案例，实习期累计收集约 100—200 条信息并完成 3 期市场简报。", en: "Tracked education-digitalisation policy, higher-education developments and cases weekly; collected about 100–200 items and completed three market briefs." } },
      { label: { zh: "客户支持", en: "Client support" }, text: { zh: "参与 6 次高校客户会议，整理客户需求、产品反馈、责任人和后续待办，沉淀为会议纪要。", en: "Supported six university client meetings, recording needs, product feedback, owners and next steps as reusable meeting notes." } },
      { label: { zh: "公众号生产", en: "WeChat production" }, text: { zh: "独立完成 6 篇公众号文章，从资料检索、撰稿、找图和排版到后台发布。", en: "Independently produced six WeChat articles from source research and drafting to image sourcing, typesetting and publication." } },
    ],
    evidence: { zh: ["3 期市场简报", "6 次客户会议", "6 篇已上线文章"], en: ["3 market briefs", "6 client meetings", "6 published articles"] },
  },
];

function EducationJournal({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(-1);
  return <div className="education-journal">{educationRecords.map((record, index) => {
    const expanded = open === index;
    return <article className={`education-note ${expanded ? "is-open" : ""}`} key={record.school.en}>
      <button className="education-toggle" type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}>
        <span className="education-period">{record.period}</span>
        <span className="education-school">{record.school[locale]}</span>
        <span className="education-degree">{record.degree[locale]}</span>
        <span className="education-lead">{record.lead[locale]}</span>
        <span className="education-more">{expanded ? (locale === "zh" ? "收起详情" : "Close details") : (locale === "zh" ? "展开详情" : "Open details")} <i aria-hidden="true">↓</i></span>
      </button>
      <div className="education-panel" aria-hidden={!expanded}>
        <div className="education-panel-inner education-detail-grid">{record.details.map((detail) => <section className="education-detail" key={detail.title.en}><p>{detail.title[locale]}</p><span>{detail.text[locale]}</span><ul>{detail.items[locale].map((item) => <li key={item}>{item}</li>)}</ul>{detail.media && <div className="education-media-strip">{detail.media.map((media) => <figure key={media.src}><img src={img(media.src)} alt={media.label[locale]} loading="lazy" /><figcaption>{media.label[locale]}</figcaption></figure>)}</div>}</section>)}</div>
      </div>
    </article>;
  })}</div>;
}

function InternshipArchive({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState<InternshipRecord | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (record: InternshipRecord) => { setSelected(record); window.requestAnimationFrame(() => { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }); };
  const close = () => { dialog.current?.close(); document.body.style.overflow = ""; };
  return <><div className="internship-archive">{internshipRecords.map((record, index) => <article key={record.company.en}><button type="button" onClick={() => open(record)}><span>0{index + 1} / {record.period}</span><div><h2>{record.company[locale]}</h2><h3>{record.role[locale]}</h3><p>{record.lead[locale]}</p></div><i aria-hidden="true">↗</i></button></article>)}</div><dialog ref={dialog} className="internship-dialog" onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => { document.body.style.overflow = ""; }} aria-label={selected?.company[locale]}>{selected && <><button className="internship-close" type="button" onClick={close} aria-label={locale === "zh" ? "关闭经历档案" : "Close experience archive"}>×</button><header><span>{selected.period}</span><p>{locale === "zh" ? "INTERNSHIP / FIELD NOTE" : "INTERNSHIP / FIELD NOTE"}</p><h2>{selected.company[locale]}</h2><h3>{selected.role[locale]}</h3><strong>{selected.lead[locale]}</strong></header><div className="internship-dialog-body"><div>{selected.sections.map((section) => <section key={section.label.en}><p>{section.label[locale]}</p><span>{section.text[locale]}</span></section>)}</div><aside><p>{locale === "zh" ? "工作证据" : "Evidence"}</p>{selected.evidence[locale].map((item, index) => <span key={item}>0{index + 1} · {item}</span>)}</aside></div></>}</dialog></>;
}

function ExperienceContent({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <><section className="page-heading"><p className="eyebrow">Profile / Notebook</p><h1>{zh ? "教育与实习经历" : "Education & internship experience"}</h1></section><section className="experience-group education-group"><div className="experience-group-heading"><p className="eyebrow">01 / {zh ? "教育经历" : "Education"}</p></div><EducationJournal locale={locale} /></section><section className="experience-group internship-group"><div className="experience-group-heading"><p className="eyebrow">02 / {zh ? "实习经历" : "Internships"}</p><span>{zh ? "点击进入工作档案" : "Open a field archive"}</span></div><InternshipArchive locale={locale} /></section></>;
}

function Experience({ locale }: { locale: Locale }) {
  return <main className="page-shell experience-page"><ExperienceContent locale={locale} /></main>;
}

export default function Portfolio({ locale, page }: { locale: Locale; page: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const nodes = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-reveal], .experience-list article, .star-section, .evidence-heading, .case-visual") ?? []);
    const setup = () => {
      observer?.disconnect();
      nodes.forEach((node) => node.classList.remove("reveal-pending"));
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.remove("reveal-pending"); entry.target.classList.add("reveal-visible"); observer?.unobserve(entry.target); }
      }), { threshold: 0.08 });
      nodes.forEach((node) => { node.classList.add("reveal-item"); if (node.getBoundingClientRect().top > window.innerHeight) node.classList.add("reveal-pending"); observer?.observe(node); });
    };
    setup(); preference.addEventListener("change", setup);
    return () => { observer?.disconnect(); preference.removeEventListener("change", setup); };
  }, [page, locale]);
  const current = page === "about" ? "home" : page;
  const caseSlug = page.startsWith("work/") ? page.replace("work/", "").replace("can-buy-lah", "canbuy") : "";
  let body: React.ReactNode;
  if (page === "home" || page === "about") body = <Home locale={locale} />;
  else if (page === "work") body = <WorkIndex locale={locale} />;
  else if (page === "work/dw") body = <DWCase locale={locale} />;
  else if (page === "work/refrear") body = <RefrearCase locale={locale} />;
  else if (page === "work/caa") body = <CAACase locale={locale} />;
  else if (page === "work/tencent") body = <TencentCase locale={locale} />;
  else if (page === "work/workbook") body = <WorkbookCase locale={locale} />;
  else if (page === "work/can-buy-lah") body = <CanBuyCase locale={locale} />;
  else if (page === "experience") body = <Experience locale={locale} />;
  else body = <Home locale={locale} />;
  return <div ref={root} className={`portfolio locale-${locale} ${caseSlug ? `case-shell case-${caseSlug}` : ""}`} lang={locale === "zh" ? "zh-CN" : "en"}><Header locale={locale} current={current} />{body}<footer><span>© 2026 Sihan Wang</span><a href="mailto:sihan006@e.ntu.edu.sg">sihan006@e.ntu.edu.sg</a></footer></div>;
}
