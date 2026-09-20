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

const projects: Project[] = [
  { slug: "dw", index: "01", group: "internship", title: { en: "Xiaohongshu Multi-account Operations", zh: "小红书多账号运营与数据分析" }, subtitle: { en: "Daniel Wellington · Content & data review", zh: "Daniel Wellington" } },
  { slug: "refrear", index: "02", group: "internship", title: { en: "KOL Selection, Briefs & Post-campaign Review", zh: "美瞳品牌 KOL 筛选、Brief 与投后复盘" }, subtitle: { en: "Refrear", zh: "Refrear" } },
  { slug: "caa", index: "03", group: "internship", title: { en: "WeChat Content, Copy & Typesetting", zh: "公众号内容策划、文案与排版" }, subtitle: { en: "CAA China", zh: "CAA China" } },
  { slug: "tencent", index: "04", group: "internship", title: { en: "Automotive Media Matrix Research", zh: "汽车新媒体矩阵调研" }, subtitle: { en: "Tencent CSIG", zh: "Tencent CSIG" } },
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
  return <header className="site-header"><a className="brand" href={toPath(locale)} aria-label="Sihan Wang home">Sihan <span>Wang</span></a><nav aria-label="Primary navigation"><a className={(current.startsWith("work") || section === "work") ? "active" : ""} href={current === "home" ? "#work" : toPath(locale, "work")}>{t.nav.work}</a><a className={section === "about" ? "active" : ""} href={`${current === "home" ? "" : toPath(locale)}#about`}>{locale === "zh" ? "关于" : "About"}</a><a className={(current === "experience" || section === "experience") ? "active" : ""} href={`${current === "home" ? "" : toPath(locale)}#experience`}>{t.nav.experience}</a></nav><div className="header-actions"><a className="locale-toggle" href={toPath(toggle, suffix.replace(/^\//, ""))}>{toggle.toUpperCase()}</a><a className="contact-dot" href="mailto:sihan006@e.ntu.edu.sg">{t.nav.contact}</a></div></header>;
}

const projectMedia: Record<string, { src: string; format: string; label: string }> = {
  dw: { src: "dw-ice-blue-post.jpg", format: "phone", label: "Content · Social · Data" },
  refrear: { src: "refrear-style-brief.png", format: "document", label: "Creators · Brief · Review" },
  caa: { src: "caa-sarah-brightman.png", format: "document", label: "Editorial · WeChat" },
  tencent: { src: "tencent-media-research.jpg", format: "document", label: "Research · Strategy" },
  workbook: { src: "workbook-overview.png", format: "browser", label: "Information · Workflow" },
  "can-buy-lah": { src: "canbuy-product.png", format: "phone", label: "AI · Product · MVP" },
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
  return <section className={`star-section star-${kind}`}><div className="star-label"><span>{letter}</span><p>{copy[locale].star[kind]}</p></div><div className="star-body">{children}{facts.length > 0 && <ul className="star-facts">{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>}</div></section>;
}

function CaseIntro({ locale, index, title, description, group }: { locale: Locale; index: string; title: string; description: string; group: "internship" | "independent" }) {
  const zh = locale === "zh";
  return <section className="case-intro"><a className="back-link" href={toPath(locale, "work")}>← {copy[locale].back}</a><p className="case-label">{index} / {group === "internship" ? (zh ? "实习项目" : "Internship work") : (zh ? "独立项目" : "Independent project")}</p><h1>{title}</h1><p>{description}</p></section>;
}

function DWCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="01" group="internship" title="Daniel Wellington" description={zh ? "小红书多账号运营、内容趋势研究与月度数据分析。" : "Xiaohongshu multi-account operations, content trend research and monthly data analysis."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["3 个小红书账号", "新品、520、618", "同步公众号"] : ["3 Xiaohongshu accounts", "New product, 520, 618", "WeChat alignment"]}><p>{zh ? "为三个小红书账号和公众号 Campaign 建立不重复、但一致的北欧年轻化内容表达。" : "Create a Nordic, youthful content system that stays consistent without repeating across three Xiaohongshu accounts and WeChat campaigns."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["趋势与选题", "月度内容规划", "发布与复盘"] : ["Trends & topics", "Monthly planning", "Publishing & review"]}><p>{zh ? "负责从趋势研究、选品选题到 Brief、文案、发布和月度数据复盘的完整小红书流程。" : "Own the Xiaohongshu workflow from trend research and topics to briefs, copy, publishing and monthly review."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["账号定位", "场景化表达", "Excel 横向比较"] : ["Account positioning", "Situational storytelling", "Excel comparisons"]}><p>{zh ? "结合产品、热点与趋势定选题，再按账号定位改写角度；用场景和搭配讲产品，并以月度数据调整形式与标题。" : "Build topics from products, trends and platform moments; adapt the angle per account, tell product stories through scenes, then refine formats and titles with monthly data."}</p></StarSection>
    <section className="evidence-section"><div className="evidence-heading"><p className="eyebrow">DW Xiaohongshu content</p><h2>{zh ? "两条小红书笔记：配图、文案与互动表现" : "Two Xiaohongshu posts: visuals, copy and engagement"}</h2></div><div className="post-grid"><article className="post-card"><Visual src="dw-ice-blue-post.jpg" alt="DW ice-blue Xiaohongshu post" variant="portrait" caption={zh ? "冰河蓝表盘笔记：从春日叠戴场景切入，完成图片组合与文案撰写。" : "Ice-blue dial post: image pairing and copy built around a spring layering scene."} /><p className="post-copy">“💧春天锁死这抹冰河蓝！美到原地封神🦋<br />这是什么神仙叠戴公式啊！！<br />DW 椭圆表冰河蓝表盘像把银河切了一角🌌”</p><div className="post-metrics"><span>931 {zh ? "赞" : "likes"}</span><span>110 {zh ? "收藏" : "saves"}</span><span>10 {zh ? "评论" : "comments"}</span></div></article><article className="post-card"><Visual src="dw-charms-post.jpg" alt="DW Charms Xiaohongshu post" variant="portrait" caption={zh ? "Charms 系列笔记：围绕淡彩系北欧配饰完成选题、产品呈现和文案。" : "Charms post: topic, product styling and copy for a pale-colour Nordic accessories story."} /><p className="post-copy">“春天要叮叮当当🌿🔔淡彩系北欧小众配饰✨<br />DW Charms 密语系列<br />叮叮当当的天然彩宝，收集了一整片春天花园的灵气。”</p><div className="post-metrics"><span>651 {zh ? "赞" : "likes"}</span><span>93 {zh ? "收藏" : "saves"}</span></div></article></div></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["新增粉丝 125", "单篇 1,000+ 赞", "增加视频与互动"] : ["125 new followers", "1,000+ likes on a post", "More video & interaction"]}><p>{zh ? "三账号累计新增 125 位粉丝，最高单篇获赞 1,000+；复盘后增加视频与互动内容。" : "The three accounts added 125 followers and the best post exceeded 1,000 likes; the review led to more video and interactive content."}</p></StarSection>
    <section className="evidence-section data-evidence"><div className="evidence-heading"><p className="eyebrow">Data analysis & content optimisation</p><h2>{zh ? "小红书数据分析与内容优化" : "Xiaohongshu data analysis & content optimisation"}</h2><p>{zh ? "月度复盘覆盖阅读、互动、点击率、涨粉和内容形式表现。图文平均点击率为 5.4%，视频平均点击率为 24.7%；结论用于下一轮选题和内容形式调整。" : "Monthly review covered reach, interaction, click-through, follower growth and format performance. Average click-through was 5.4% for image posts and 24.7% for video; the findings guided the next content cycle."}</p></div><div className="visual-grid two"><Visual src="dw-new-product-data.png" alt="DW Xiaohongshu content data analysis" caption={zh ? "图文与视频内容的阅读、互动和点击率对比，用于判断内容形式和选题方向。" : "Image-post and video performance comparison used to refine format and topic decisions."} /><Visual src="dw-followers.png" alt="DW Xiaohongshu follower analysis" caption={zh ? "三账号粉丝走势与画像分析，为账号定位和内容安排提供参考。" : "Follower trends and audience profiles across the three accounts informed account positioning and planning."} /></div></section>
  </main>;
}

function RefrearCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="02" group="internship" title="Refrear" description={zh ? "美瞳品牌小红书 KOL 筛选、达人 Brief 与投后复盘。" : "Xiaohongshu KOL selection, creator briefing and post-campaign review for a colour-contact-lens brand."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["自然妆感", "生活化内容", "品牌与受众匹配"] : ["Natural makeup", "Everyday content", "Brand–audience fit"]}><p>{zh ? "为美瞳品牌寻找自然、生活化的达人；粉丝量之外，还要看调性、受众、互动与成本。" : "Find natural, everyday creators for a colour-contact-lens brand, balancing tone, audience, engagement and cost beyond follower count."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["筛选与推荐", "达人跟进", "Brief 与复盘"] : ["Selection & recommendations", "Creator follow-up", "Briefs & review"]}><p>{zh ? "在 mentor 与品牌评审流程中，完成达人筛选、推荐、沟通、内容 Brief 和投后数据回收。" : "Within mentor and client review, deliver creator selection, recommendations, outreach, briefs and post-campaign data collection."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["粉丝画像", "内容调性", "互动与 CPE"] : ["Audience profile", "Content tone", "Engagement & CPE"]}><p>{zh ? "先排除风格不符的账号，再将受众、互动、报价和商业笔记表现整理进达人库，按“画像 → 调性 → 表现与成本”筛选。" : "Remove off-tone accounts first, then structure audience, engagement, price and commercial-post data in a creator database, screening by audience → tone → performance and cost."}</p></StarSection>
    <section className="visual-grid three"><Visual src="refrear-style-brief.png" alt="Refrear creator style brief" variant="document" caption={zh ? "达人内容 Brief：自然妆感、品牌调性与交付方向。" : "Creator brief covering natural makeup, brand tone and delivery direction."} /><Visual src="refrear-eye-guideline.png" alt="Refrear product guideline" variant="document" caption={zh ? "产品表现要求：明确内容中需要看到的眼部产品重点。" : "Product-visibility guidance for eye-content delivery."} /><Visual src="refrear-shoot-guideline.png" alt="Refrear shooting guideline" variant="document" caption={zh ? "拍摄规范：统一景别、光线和画面重点。" : "Shooting guidance for consistent framing, light and focus."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["筛选 200+ 位达人", "每案推荐 30–40 人", "名单采纳率 50–60%"] : ["200+ creators screened", "30–40 recommended per project", "50–60% list adoption"]}><p>{zh ? "累计筛选 200+ 位达人；每案推荐约 30–40 人，品牌采纳约 50–60%。发布后回收数据，用于比较达人画像与内容表现。" : "Screened 200+ creators and recommended 30–40 per project, with 50–60% adoption. Post-campaign data informed comparisons of creator profiles and content performance."}</p></StarSection>
  </main>;
}

function CAACase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="03" group="internship" title="CAA China" description={zh ? "CAA Campaign 公众号文章结构、文案撰写与排版。" : "WeChat article structure, copywriting and typesetting for CAA Campaign content."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["Campaign 主题", "艺人素材", "公众号阅读场景"] : ["Campaign theme", "Talent materials", "WeChat reading context"]}><p>{zh ? "把 Campaign 主题、艺人素材和传播重点整理成一条清晰的公众号阅读路径。" : "Shape campaign themes, talent materials and key messages into a clear WeChat reading journey."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["文章结构", "文案撰写", "页面排版"] : ["Article structure", "Copywriting", "Page typesetting"]}><p>{zh ? "参与内容策划，负责文章结构、文字表达与页面排版。" : "Contribute to content planning through structure, copy and page typesetting."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["标题 → 导语", "信息层级", "图文节奏"] : ["Headline → lead", "Information hierarchy", "Text-image rhythm"]}><p>{zh ? "先确定标题与导语，再安排信息优先级和图文节奏，让艺人、活动与品牌表达连续展开。" : "Set the headline and lead first, then shape hierarchy and text-image rhythm so talent, activity and brand messages unfold naturally."}</p></StarSection>
    <section className="visual-grid two narrow"><Visual src="caa-lighthouse.png" alt="CAA lighthouse WeChat article" variant="phone" caption={zh ? "CAA 年度书单第二季：完成文章结构、文案与公众号排版。" : "CAA annual book-list article: structure, copy and WeChat typesetting."} /><Visual src="caa-sarah-brightman.png" alt="CAA Sarah Brightman WeChat article" variant="phone" caption={zh ? "Sarah Brightman 相关内容：根据艺人素材和传播重点完成图文叙事。" : "Sarah Brightman content: a text-image narrative built from artist materials and communication priorities."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["已发布内容", "可复用内容框架"] : ["Published content", "Reusable content framework"]}><p>{zh ? "完成上线文章的文字与排版，并沉淀出可复用的方法：先排优先级，再让素材服务阅读节奏。" : "Delivered published articles and a reusable method: set priorities first, then let the materials serve the reading rhythm."}</p></StarSection>
  </main>;
}

function TencentCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="04" group="internship" title={zh ? "腾讯汽车新媒体矩阵调研" : "Tencent Automotive Media Matrix Research"} description={zh ? "为一汽丰田中国市场的新媒体运营讨论提供行业比较和内容方向参考。" : "A comparative study to support new-media discussions for FAW Toyota China."} />
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
  return <main><CaseIntro locale={locale} index="05" group="independent" title={zh ? "秋招信息工作台" : "Graduate Recruitment Workbook"} description={zh ? "把岗位、申请、简历版本与复盘整理成可持续使用的个人系统。" : "A personal system for opportunities, applications, resume versions and retrospective learning."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["岗位来源", "申请进度", "简历与复盘"] : ["Opportunity sources", "Application states", "Resumes & review"]}><p>{zh ? "求职信息分散在不同文件和页面，申请状态、准备进度与简历版本难以持续追踪。" : "Job-search information spreads across files and pages, making applications, preparation and resume versions difficult to track."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["记录", "检索", "比较与复用"] : ["Record", "Search", "Compare & reuse"]}><p>{zh ? "独立设计一个能记录、检索、比较并复用求职信息的个人工作台。" : "Design an independent workspace that records, searches, compares and reuses job-search information."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["岗位池", "申请追踪", "简历版本与复盘"] : ["Opportunity pool", "Application tracking", "Resume versions & review"]}><p>{zh ? "以统一字段连接岗位、申请、简历和复盘模块，并用明确状态与下一步动作串起整个准备过程。" : "Connect opportunities, applications, resumes and review through shared fields, clear states and explicit next actions."}</p></StarSection>
    <section className="visual-grid workbook"><Visual src="workbook-overview.png" alt="Workbook overview" variant="document" caption={zh ? "系统总览：岗位、申请与复盘入口集中在同一工作台。" : "Overview: opportunities, applications and retrospective entry points in one workspace."} /><Visual src="workbook-opportunities.png" alt="Workbook opportunities" variant="document" caption={zh ? "岗位池：记录来源、方向、优先级与后续动作。" : "Opportunity pool: source, direction, priority and next action."} /><Visual src="workbook-tracking.png" alt="Workbook tracking" variant="document" caption={zh ? "申请追踪：可见的投递、面试与跟进状态。" : "Application tracking: visible application, interview and follow-up states."} /><Visual src="workbook-resume-versions.png" alt="Workbook resume versions" variant="document" caption={zh ? "简历版本：让岗位方向与对应版本可回溯、可复用。" : "Resume versions: traceable, reusable role-to-version matching."} /><Visual src="workbook-review.png" alt="Workbook retrospective" variant="document" caption={zh ? "过程复盘：沉淀结果、反馈和下次调整。" : "Retrospective: save outcomes, feedback and next adjustments."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["信息集中", "状态可见", "经验可复用"] : ["Centralised information", "Visible states", "Reusable learning"]}><p>{zh ? "把零散信息变成可检索、可比较的个人资产，让每次申请的经验直接进入下一轮准备。" : "Turn scattered information into a searchable, comparable asset so each application directly improves the next one."}</p></StarSection>
  </main>;
}

function CanBuyCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="06" group="independent" title="Can Buy Lah" description={zh ? "面向新加坡线下购物场景的 AI 辅助商品理解与比价 MVP。" : "An AI-assisted product-understanding and price-comparison MVP for in-store shopping in Singapore."} />
    <StarSection locale={locale} kind="situation" facts={zh ? ["英文包装", "陌生品牌", "价格与口碑分散"] : ["English packaging", "Unfamiliar brands", "Fragmented price & reviews"]}><p>{zh ? "中文用户在新加坡线下购物时，常需在翻译、搜索、电商与社媒之间来回切换，才能判断商品。" : "Chinese-speaking shoppers in Singapore switch among translation, search, marketplaces and social platforms before they can judge a product."}</p></StarSection>
    <StarSection locale={locale} kind="task" facts={zh ? ["问题拆解", "AI 输出规则", "可访问 MVP"] : ["Problem mapping", "AI output rules", "Accessible MVP"]}><p>{zh ? "独立完成从用户问题、产品流程和 AI 输出规则，到异常 Case 回查与 MVP 设计。" : "Independently take the product from user-problem mapping and AI output rules to error-case review and an accessible MVP."}</p></StarSection>
    <StarSection locale={locale} kind="action" facts={zh ? ["拍照 → 购买判断", "三级匹配规则", "价格优先级"] : ["Capture → purchase decision", "Three-tier matching", "Price priority"]}><p>{zh ? "把流程重构为“拍照—识别—检索—解读—比价—判断”，并为规格、口味与优惠价建立三级匹配规则。" : "Rebuild the journey as capture → identify → search → understand → compare → decide, with three-tier matching for size, flavour and promotional-price edge cases."}</p></StarSection>
    <section className="visual-grid three product"><Visual src="canbuy-discovery.png" alt="Can Buy Lah discovery screen" variant="phone" caption={zh ? "01 现场拍摄商品与价签，保留真实购物语境。" : "01 Capture product and shelf price in context."} /><Visual src="canbuy-product.png" alt="Can Buy Lah product screen" variant="phone" caption={zh ? "02 组织商品信息、口碑与使用建议。" : "02 Organise product information, feedback and guidance."} /><Visual src="canbuy-price.png" alt="Can Buy Lah price screen" variant="phone" caption={zh ? "03 并列现场价与线上参考价，明确购买判断。" : "03 Compare in-store and online references for a clear decision."} /></section>
    <StarSection locale={locale} kind="result" facts={zh ? ["识别准确率 90%+", "有效比价 85%+", "30 位测试用户"] : ["90%+ recognition accuracy", "85%+ effective price matches", "30 invited test users"]}><p>{zh ? "当前识别准确率为 90%+，有效比价成功率为 85%+；已邀请 30 位用户测试，并持续用错误 Case 优化规则。" : "The MVP currently reaches 90%+ recognition accuracy and 85%+ effective price matches, with 30 invited test users and ongoing error-case iteration."}</p></StarSection>
    <Metrics items={zh ? [{ value: "90%+", label: "商品图片识别准确率" }, { value: "85%+", label: "有效比价成功率" }, { value: "30", label: "已邀请测试用户" }] : [{ value: "90%+", label: "image-recognition accuracy" }, { value: "85%+", label: "effective price-match success" }, { value: "30", label: "invited test users" }]} />
  </main>;
}

function WorkIndex({ locale }: { locale: Locale }) { return <main><WorkShowcase locale={locale} /></main>; }

function Home({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const skills = zh ? [{ label: "内容策略", kind: "strategy" }, { label: "达人与平台运营", kind: "operations" }, { label: "数据复盘", kind: "data" }, { label: "信息架构", kind: "architecture" }, { label: "AI 工具与工作流", kind: "ai" }, { label: "市场与竞品研究", kind: "research" }] : [{ label: "Content strategy", kind: "strategy" }, { label: "Creator & platform operations", kind: "operations" }, { label: "Data review", kind: "data" }, { label: "Information architecture", kind: "architecture" }, { label: "AI tools & workflows", kind: "ai" }, { label: "Market & competitor research", kind: "research" }];
  return <main><section className="cover-screen" aria-label="Sihan Wang portfolio cover"><img src={img("portfolio-cover-v2.png")} alt="Sihan Wang portfolio cover" /><p>个人作品集</p><a className="cover-explore" href="#work">{zh ? "浏览作品" : "Explore selected work"}<span aria-hidden="true">↓</span></a></section><WorkShowcase locale={locale} /><section id="about" className="home-about"><div className="home-about-layout"><div className="home-about-copy about-card" data-reveal><MediterraneanBoat /><p className="eyebrow">Sihan Wang 王思涵 · Singapore</p><h1>About Sihan</h1><div className="about-prose"><p className="home-lead">{zh ? "Hi，我是思涵，MBTI 是 INFJ。目前就读于南洋理工大学黄金辉信息与传播学院知识管理硕士，本科毕业于武汉理工大学网络与新媒体专业。" : "Hi, I’m Sihan, an INFJ. I am currently pursuing an MSc in Knowledge Management at NTU’s Wee Kim Wee School of Communication and Information, after completing a degree in Network and New Media at Wuhan University of Technology."}</p><p>{zh ? "我的实习经历主要聚焦内容运营、达人与用户运营、数据复盘和行业研究：从多账号内容规划与 KOL 筛选，到新媒体矩阵调研、跨部门项目推进，我习惯把复杂信息整理成清晰的下一步。学习和实习让我不断积累新的能力；我始终相信，认真走的每一步都会让人更接近想成为的自己。" : "My internship experience centres on content operations, creator and user operations, data review and industry research. From multi-account content planning and KOL selection to media-matrix research and cross-functional project delivery, I enjoy turning complex information into a clearer next step. Learning and practice keep adding to my toolkit, and I believe steady effort gets me closer to the person I want to become."}</p></div></div><div className="home-photo" data-reveal><img src={img("sihan-portrait-lucerne.jpg")} alt="Sihan Wang in Lucerne" /><span>Lucerne, Switzerland</span></div></div><section className="home-skills"><p className="eyebrow">{zh ? "能力方向" : "Capabilities"}</p><div>{skills.map((skill) => <span key={skill.label}><SkillIcon kind={skill.kind} /><b>{skill.label}</b></span>)}</div></section></section><section id="experience" className="page-shell experience-page home-experience"><ExperienceContent locale={locale} /></section></main>;
}

function ExperienceContent({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <><section className="page-heading"><p className="eyebrow">Profile</p><h1>{zh ? "教育与实习经历" : "Education & internship experience"}</h1></section><section className="experience-group"><div className="experience-group-heading"><p className="eyebrow">01 / {zh ? "教育经历" : "Education"}</p></div><div className="experience-list"><article><span>2025.08—2027.01</span><div><h2>{zh ? "南洋理工大学" : "Nanyang Technological University"}</h2><h3>{zh ? "知识管理硕士" : "MSc Knowledge Management"}</h3><p>{zh ? "聚焦信息系统、研究与数字化实践。" : "Focused on information systems, research and digital practice."}</p></div></article><article><span>2021.09—2025.07</span><div><h2>{zh ? "武汉理工大学" : "Wuhan University of Technology"}</h2><h3>{zh ? "网络与新媒体学士" : "BA Network and New Media"}</h3><p>{zh ? "内容生产、平台传播与用户沟通的本科训练。" : "Undergraduate training in content production, platform communication and audience understanding."}</p></div></article></div></section><section className="experience-group"><div className="experience-group-heading"><p className="eyebrow">02 / {zh ? "实习经历" : "Internships"}</p></div><div className="experience-list"><article><span>2026.04—07</span><div><h2>{zh ? "中航材利顿航空科技" : "Aviation Technology Operations"}</h2><h3>{zh ? "运营管理办公室实习" : "Operations Management Office Intern"}</h3><p>{zh ? "跨部门材料推进、项目台账与会议行动项跟进。" : "Cross-functional materials coordination, project tracking and action follow-up."}</p></div></article><article><span>2025.04—06</span><div><h2>Allison+Partners</h2><h3>{zh ? "企业传播部公关实习生" : "Corporate Communications Intern"}</h3><p>{zh ? "DW、Refrear、CAA 与 BBC Earth 项目的内容、KOL 与数据复盘工作。" : "Content, creator and review work across DW, Refrear, CAA and BBC Earth projects."}</p></div></article><article><span>2024.01—03</span><div><h2>{zh ? "腾讯 CSIG 智慧出行" : "Tencent CSIG Smart Mobility"}</h2><h3>{zh ? "行业运营实习生" : "Industry Operations Intern"}</h3><p>{zh ? "汽车品牌新媒体矩阵研究、需求拆解与体验方案支持。" : "Automotive media research, requirement decomposition and experience-solution support."}</p></div></article><article><span>2023.06—08</span><div><h2>{zh ? "同方知网" : "CNKI"}</h2><h3>{zh ? "市场专员实习生" : "Marketing Intern"}</h3><p>{zh ? "市场研究、客户会议支持和从 0 到 1 的公众号内容生产。" : "Market research, customer-meeting support and end-to-end WeChat content production."}</p></div></article></div></section></>;
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
  return <div ref={root} className={`portfolio locale-${locale}`} lang={locale === "zh" ? "zh-CN" : "en"}><Header locale={locale} current={current} />{body}<footer><span>© 2026 Sihan Wang</span><a href="mailto:sihan006@e.ntu.edu.sg">sihan006@e.ntu.edu.sg</a></footer></div>;
}
