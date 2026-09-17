"use client";

import { useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <><button className="media-button" onClick={() => setOpen(true)} aria-label={`Open ${alt}`}><img src={img(src)} alt={alt} /></button>{open && <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}><button className="lightbox-close" onClick={() => setOpen(false)} aria-label="Close image">×</button><img src={img(src)} alt={alt} onClick={(event) => event.stopPropagation()} /></div>}</>;
}

function Visual({ src, alt, caption, variant = "landscape" }: { src: string; alt: string; caption: string; variant?: "portrait" | "landscape" | "phone" | "document" }) {
  return <figure className={`case-visual ${variant}`}><ImageButton src={src} alt={alt} /><figcaption>{caption}</figcaption></figure>;
}

function Header({ locale, current }: { locale: Locale; current: string }) {
  const t = copy[locale];
  const toggle = locale === "en" ? "zh" : "en";
  const suffix = current === "home" ? "" : `/${current}`;
  const experienceHref = current === "home" ? "#experience" : `${toPath(locale)}#experience`;
  return <header className="site-header"><a className="brand" href={toPath(locale)} aria-label="Sihan Wang home">Sihan <span>Wang</span></a><nav aria-label="Primary navigation"><a className={current.startsWith("work") ? "active" : ""} href={toPath(locale, "work")}>{t.nav.work}</a><a className={current === "experience" ? "active" : ""} href={experienceHref}>{t.nav.experience}</a></nav><div className="header-actions"><a className="locale-toggle" href={toPath(toggle, suffix.replace(/^\//, ""))}>{toggle.toUpperCase()}</a><a className="contact-dot" href="mailto:sihan006@e.ntu.edu.sg">{t.nav.contact}</a></div></header>;
}

function ProjectLink({ project, locale }: { project: Project; locale: Locale }) {
  return <a className="project-link" href={toPath(locale, `work/${project.slug}`)}><span className="project-number">{project.index}</span><div><h3>{project.title[locale]}</h3><p>{project.subtitle[locale]}</p></div><span className="project-arrow">↗</span></a>;
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

function StarSection({ locale, kind, children }: { locale: Locale; kind: keyof (typeof copy)["en"]["star"]; children: React.ReactNode }) {
  const letter = { situation: "S", task: "T", action: "A", result: "R" }[kind];
  return <section className={`star-section star-${kind}`}><div className="star-label"><span>{letter}</span><p>{copy[locale].star[kind]}</p></div><div className="star-body">{children}</div></section>;
}

function CaseIntro({ locale, index, title, description, group }: { locale: Locale; index: string; title: string; description: string; group: "internship" | "independent" }) {
  const zh = locale === "zh";
  return <section className="case-intro"><a className="back-link" href={toPath(locale, "work")}>← {copy[locale].back}</a><p className="case-label">{index} / {group === "internship" ? (zh ? "实习项目" : "Internship work") : (zh ? "独立项目" : "Independent project")}</p><h1>{title}</h1><p>{description}</p></section>;
}

function DWCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="01" group="internship" title="Daniel Wellington" description={zh ? "小红书多账号运营、内容趋势研究与月度数据分析。" : "Xiaohongshu multi-account operations, content trend research and monthly data analysis."} />
    <StarSection locale={locale} kind="situation"><p>{zh ? "DW 同时运营官方主账号、新品体验官和配饰种草官三个小红书账号，并与微信公众号协同推进新品、520、618 等 Campaign。团队需要保持北欧简约、年轻化的品牌调性，同时避免不同账号的内容重复。" : "DW operated three Xiaohongshu accounts alongside WeChat for new-product, 520 and 618 campaigns. The content needed to stay Nordic, young and recognisably DW without becoming repetitive across accounts."}</p></StarSection>
    <StarSection locale={locale} kind="task"><p>{zh ? "我主要负责小红书趋势研究、选品与选题、月度内容规划、Brief、配图组合、标题钩子和文案撰写、发布、数据回收与月度复盘；微信公众号部分参与月度 Campaign 对齐。" : "My main scope was Xiaohongshu: trend research, product and topic selection, monthly planning, briefs, image pairing, hooks, copywriting, publishing, data collection and review. I also aligned monthly campaigns with the WeChat team."}</p></StarSection>
    <StarSection locale={locale} kind="action"><p>{zh ? "围绕主推产品、Campaign、图片素材、平台热点、竞品案例和时尚趋势组织选题，再根据三个账号的定位调整表达。执行时，我会把产品卖点落到具体场景和搭配中，而不是直接堆叠品牌名称；每月再把后台数据整理进 Excel，对不同账号、内容形式和标题表达进行横向比较。" : "I combined hero products, campaign material, platform trends, competitor examples and fashion references into topics, then adjusted the angle for each account. Product points were expressed through styling and situations rather than direct brand repetition; each month I consolidated backend data in Excel to compare accounts, formats and title styles."}</p></StarSection>
    <section className="evidence-section"><div className="evidence-heading"><p className="eyebrow">DW Xiaohongshu content</p><h2>{zh ? "两条小红书笔记：配图、文案与互动表现" : "Two Xiaohongshu posts: visuals, copy and engagement"}</h2></div><div className="post-grid"><article className="post-card"><Visual src="dw-ice-blue-post.jpg" alt="DW ice-blue Xiaohongshu post" variant="portrait" caption={zh ? "冰河蓝表盘笔记：从春日叠戴场景切入，完成图片组合与文案撰写。" : "Ice-blue dial post: image pairing and copy built around a spring layering scene."} /><p className="post-copy">“💧春天锁死这抹冰河蓝！美到原地封神🦋<br />这是什么神仙叠戴公式啊！！<br />DW 椭圆表冰河蓝表盘像把银河切了一角🌌”</p><div className="post-metrics"><span>931 {zh ? "赞" : "likes"}</span><span>110 {zh ? "收藏" : "saves"}</span><span>10 {zh ? "评论" : "comments"}</span></div></article><article className="post-card"><Visual src="dw-charms-post.jpg" alt="DW Charms Xiaohongshu post" variant="portrait" caption={zh ? "Charms 系列笔记：围绕淡彩系北欧配饰完成选题、产品呈现和文案。" : "Charms post: topic, product styling and copy for a pale-colour Nordic accessories story."} /><p className="post-copy">“春天要叮叮当当🌿🔔淡彩系北欧小众配饰✨<br />DW Charms 密语系列<br />叮叮当当的天然彩宝，收集了一整片春天花园的灵气。”</p><div className="post-metrics"><span>651 {zh ? "赞" : "likes"}</span><span>93 {zh ? "收藏" : "saves"}</span></div></article></div></section>
    <StarSection locale={locale} kind="result"><p>{zh ? "三账号累计新增粉丝 125 人，单篇最高获赞 1000+。5 月复盘后，团队在 6 月增加视频与互动内容，并强化情绪化、场景化标题与用户代入感。" : "The three accounts gained 125 followers in total, and the best-performing post exceeded 1,000 likes. After the May review, June included more video and interactive formats, with more situational and audience-led title writing."}</p></StarSection>
    <section className="evidence-section data-evidence"><div className="evidence-heading"><p className="eyebrow">Data analysis & content optimisation</p><h2>{zh ? "小红书数据分析与内容优化" : "Xiaohongshu data analysis & content optimisation"}</h2><p>{zh ? "月度复盘覆盖阅读、互动、点击率、涨粉和内容形式表现。图文平均点击率为 5.4%，视频平均点击率为 24.7%；结论用于下一轮选题和内容形式调整。" : "Monthly review covered reach, interaction, click-through, follower growth and format performance. Average click-through was 5.4% for image posts and 24.7% for video; the findings guided the next content cycle."}</p></div><div className="visual-grid two"><Visual src="dw-new-product-data.png" alt="DW Xiaohongshu content data analysis" caption={zh ? "图文与视频内容的阅读、互动和点击率对比，用于判断内容形式和选题方向。" : "Image-post and video performance comparison used to refine format and topic decisions."} /><Visual src="dw-followers.png" alt="DW Xiaohongshu follower analysis" caption={zh ? "三账号粉丝走势与画像分析，为账号定位和内容安排提供参考。" : "Follower trends and audience profiles across the three accounts informed account positioning and planning."} /></div></section>
  </main>;
}

function RefrearCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="02" group="internship" title="Refrear" description={zh ? "美瞳品牌小红书 KOL 筛选、达人 Brief 与投后复盘。" : "Xiaohongshu KOL selection, creator briefing and post-campaign review for a colour-contact-lens brand."} />
    <StarSection locale={locale} kind="situation"><p>{zh ? "品牌希望通过小红书达人触达目标用户，且明确偏好自然妆感与生活化内容。仅按粉丝量筛选，会忽略品牌契合度、粉丝画像、内容风格、互动表现与成本之间的关系。" : "The brand wanted Xiaohongshu creators who could convey a natural, everyday makeup look. Follower count alone could not capture brand fit, audience profile, content style, engagement or cost."}</p></StarSection>
    <StarSection locale={locale} kind="task"><p>{zh ? "在 mentor 审核和品牌评审流程中，完成候选达人筛选、推荐名单整理、沟通跟进、内容 Brief 撰写和投后表现回收。" : "Within mentor and client review, I screened creators, prepared recommendation lists, followed up on outreach, wrote content briefs and collected post-campaign performance."}</p></StarSection>
    <StarSection locale={locale} kind="action"><p>{zh ? "先从主页与历史内容排除妆感过度、调性不符的账号；再通过蒲公英统一整理性别、年龄、地域、互动率、赞藏比、报价、CPE 和商业笔记表现至 Excel 达人库。筛选遵循“粉丝画像 → 内容调性 → 互动表现与成本”的顺序，并将自然妆感、产品表现与拍摄要求写入 Brief。" : "I first removed accounts whose historical content or makeup style did not fit, then structured gender, age, location, engagement, like-save ratio, price, CPE and commercial-post performance in an Excel database. Decisions followed audience profile → content tone → engagement and cost, with natural-makeup, product-visibility and shooting requirements written into the brief."}</p></StarSection>
    <section className="visual-grid three"><Visual src="refrear-style-brief.png" alt="Refrear creator style brief" variant="document" caption={zh ? "达人内容 Brief：自然妆感、品牌调性与交付方向。" : "Creator brief covering natural makeup, brand tone and delivery direction."} /><Visual src="refrear-eye-guideline.png" alt="Refrear product guideline" variant="document" caption={zh ? "产品表现要求：明确内容中需要看到的眼部产品重点。" : "Product-visibility guidance for eye-content delivery."} /><Visual src="refrear-shoot-guideline.png" alt="Refrear shooting guideline" variant="document" caption={zh ? "拍摄规范：统一景别、光线和画面重点。" : "Shooting guidance for consistent framing, light and focus."} /></section>
    <StarSection locale={locale} kind="result"><p>{zh ? "累计筛选 200+ 位达人；单个项目推荐约 30–40 人，品牌侧采纳推荐名单约 50%–60%。本人确认看到约 15 位达人完成发布；投放结束后回收曝光、点赞、收藏、评论与 CPE 等数据，用于比较不同达人画像和内容风格的表现。" : "I screened 200+ creators. Each project typically recommended 30–40 people, with about 50–60% of the proposed list adopted by the brand. I confirmed about 15 creators completed posting, then collected reach, likes, saves, comments and CPE to compare creator profiles and content styles."}</p></StarSection>
  </main>;
}

function CAACase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="03" group="internship" title="CAA China" description={zh ? "CAA Campaign 公众号文章结构、文案撰写与排版。" : "WeChat article structure, copywriting and typesetting for CAA Campaign content."} />
    <StarSection locale={locale} kind="situation"><p>{zh ? "CAA Campaign 需要将既定主题、艺人素材和传播重点整理为适合微信公众号阅读的图文内容。" : "CAA Campaign work required agreed themes, talent materials and communication priorities to be shaped into readable WeChat articles."}</p></StarSection>
    <StarSection locale={locale} kind="task"><p>{zh ? "参与内容策划，主要负责公众号文章的结构梳理、文案撰写与页面排版。" : "I contributed to content planning and was primarily responsible for article structure, copywriting and WeChat page typesetting."}</p></StarSection>
    <StarSection locale={locale} kind="action"><p>{zh ? "根据 Campaign 主题和现有素材安排标题、导语、信息层级与图文节奏，再将艺人信息、活动节点和品牌表达组织成可连续阅读的公众号内容。" : "I arranged the headline, lead, information hierarchy and text-image rhythm around the campaign theme and available materials, then structured talent information, activity timing and brand messages into a continuous WeChat reading flow."}</p></StarSection>
    <section className="visual-grid two narrow"><Visual src="caa-lighthouse.png" alt="CAA lighthouse WeChat article" variant="phone" caption={zh ? "CAA 年度书单第二季：完成文章结构、文案与公众号排版。" : "CAA annual book-list article: structure, copy and WeChat typesetting."} /><Visual src="caa-sarah-brightman.png" alt="CAA Sarah Brightman WeChat article" variant="phone" caption={zh ? "Sarah Brightman 相关内容：根据艺人素材和传播重点完成图文叙事。" : "Sarah Brightman content: a text-image narrative built from artist materials and communication priorities."} /></section>
    <StarSection locale={locale} kind="result"><p>{zh ? "完成已发布公众号内容的文字与排版交付，并形成可用于后续 Campaign 的文章组织经验：先厘清信息优先级，再让素材服务于阅读节奏。" : "Delivered copy and typesetting for published WeChat content, with a repeatable working method for later campaigns: establish information priority first, then let the materials support the reading rhythm."}</p></StarSection>
  </main>;
}

function TencentCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="04" group="internship" title={zh ? "腾讯汽车新媒体矩阵调研" : "Tencent Automotive Media Matrix Research"} description={zh ? "为一汽丰田中国市场的新媒体运营讨论提供行业比较和内容方向参考。" : "A comparative study to support new-media discussions for FAW Toyota China."} />
    <StarSection locale={locale} kind="situation"><p>{zh ? "为支持一汽丰田中国市场的新媒体运营策略，需要了解国内外汽车品牌在公域与私域的账号布局、内容表现和用户触达方式。" : "To support FAW Toyota China’s new-media planning, the team needed a view of how domestic and international automotive brands structured channels, content and audience touchpoints."}</p></StarSection>
    <StarSection locale={locale} kind="task"><p>{zh ? "完成行业研究、信息结构化和建议输入，为项目汇报材料提供比较框架；本人不是最终汇报人。" : "I completed industry research, information structuring and recommendation inputs for project reporting; I was not the final presenter."}</p></StarSection>
    <StarSection locale={locale} kind="action"><p>{zh ? "调研 10+ 家新能源与传统车企，从账号矩阵、平台分工、内容类型、近 30 天活跃度、粉丝与作品表现、粉丝画像、直播、商业化以及公私域渠道等维度建立统一比较框架。公域覆盖抖音、视频号、公众号、小红书、快手、B 站和微博；私域覆盖官网、App 与小程序等。" : "I studied 10+ EV and traditional automotive brands through account architecture, platform roles, content formats, recent activity, follower and post performance, audience profile, livestreaming, commercialisation and public-private channels. Public channels included Douyin, Video Accounts, WeChat, Xiaohongshu, Kuaishou, Bilibili and Weibo; private channels included websites, apps and mini-programs."}</p></StarSection>
    <section className="visual-grid one"><Visual src="tencent-media-research.jpg" alt="Tencent automotive social-media research slide" caption={zh ? "研究框架示例：比较汽车品牌如何从强商业化表达转向更有沟通感和用户参与度的内容。" : "Framework example: comparing a shift from sales-led messaging toward communication and audience participation."} /></section>
    <StarSection locale={locale} kind="result"><p>{zh ? "形成新媒体矩阵分析与优化建议，结论进入项目汇报 PPT 并同步至丰田项目工作群，为后续渠道与内容讨论提供参考。" : "The resulting media-matrix analysis and recommendations entered the project deck and Toyota project group, informing later channel and content discussions."}</p></StarSection>
    <Metrics items={zh ? [{ value: "10+", label: "调研品牌" }, { value: "8", label: "重点公域平台" }, { value: "2", label: "公域与私域视角" }] : [{ value: "10+", label: "brands researched" }, { value: "8", label: "key public platforms" }, { value: "2", label: "public and private lenses" }]} />
  </main>;
}

function WorkbookCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="05" group="independent" title={zh ? "秋招信息工作台" : "Graduate Recruitment Workbook"} description={zh ? "把岗位、申请、简历版本与复盘整理成可持续使用的个人系统。" : "A personal system for opportunities, applications, resume versions and retrospective learning."} />
    <StarSection locale={locale} kind="situation"><p>{zh ? "真实求职过程中，岗位来源、申请状态、面试准备和简历版本分散在不同文件与页面中，难以持续追踪与复盘。" : "In a real job search, opportunity sources, application states, interview preparation and resume versions become fragmented across files and pages."}</p></StarSection>
    <StarSection locale={locale} kind="task"><p>{zh ? "独立设计一个能够记录、检索、比较并复用求职信息的工作台。" : "I designed an independent workspace that makes job-search information recordable, searchable, comparable and reusable."}</p></StarSection>
    <StarSection locale={locale} kind="action"><p>{zh ? "用统一字段建立岗位池、申请追踪、简历版本与复盘模块；通过明确状态和下一步动作，连接投递、面试准备、反馈记录与后续调整。" : "I built connected modules for opportunities, application tracking, resume versions and reflection through shared fields, clear states and explicit next actions."}</p></StarSection>
    <section className="visual-grid workbook"><Visual src="workbook-overview.png" alt="Workbook overview" variant="document" caption={zh ? "系统总览：岗位、申请与复盘入口集中在同一工作台。" : "Overview: opportunities, applications and retrospective entry points in one workspace."} /><Visual src="workbook-opportunities.png" alt="Workbook opportunities" variant="document" caption={zh ? "岗位池：记录来源、方向、优先级与后续动作。" : "Opportunity pool: source, direction, priority and next action."} /><Visual src="workbook-tracking.png" alt="Workbook tracking" variant="document" caption={zh ? "申请追踪：可见的投递、面试与跟进状态。" : "Application tracking: visible application, interview and follow-up states."} /><Visual src="workbook-resume-versions.png" alt="Workbook resume versions" variant="document" caption={zh ? "简历版本：让岗位方向与对应版本可回溯、可复用。" : "Resume versions: traceable, reusable role-to-version matching."} /><Visual src="workbook-review.png" alt="Workbook retrospective" variant="document" caption={zh ? "过程复盘：沉淀结果、反馈和下次调整。" : "Retrospective: save outcomes, feedback and next adjustments."} /></section>
    <StarSection locale={locale} kind="result"><p>{zh ? "将原本零散的信息变为可检索、可比较的个人工作资产，也让每次申请后的经验可以直接进入下一轮准备。" : "The system turns scattered information into a searchable, comparable personal asset, so each application can directly inform the next one."}</p></StarSection>
  </main>;
}

function CanBuyCase({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <main><CaseIntro locale={locale} index="06" group="independent" title="Can Buy Lah" description={zh ? "面向新加坡线下购物场景的 AI 辅助商品理解与比价 MVP。" : "An AI-assisted product-understanding and price-comparison MVP for in-store shopping in Singapore."} />
    <StarSection locale={locale} kind="situation"><p>{zh ? "中文用户在新加坡线下购物时，面对英文包装、陌生品牌、分散的线上价格和口碑信息，往往要在翻译、搜索、购物平台与社媒之间反复切换。" : "Chinese-speaking shoppers in Singapore often switch between translation, search, marketplaces and social platforms to understand unfamiliar packaging, prices and reviews."}</p></StarSection>
    <StarSection locale={locale} kind="task"><p>{zh ? "独立完成从用户问题拆解、产品流程和 AI 输出规则，到异常 Case 回查和可访问 MVP 的设计。" : "I independently moved from user-problem mapping and product flow to AI output rules, error-case review and an accessible MVP."}</p></StarSection>
    <StarSection locale={locale} kind="action"><p>{zh ? "将链路重构为“拍照—识别—标准化—检索—商品解读—跨平台比价—购买判断”。针对规格、口味、优惠价与 Voucher 价等失败 Case，建立“精确匹配—近似匹配—重大差异拦截”三级规则，并调整价格读取优先级和信息层级。" : "I rebuilt the journey as capture → identify → standardise → search → understand → compare → decide. For failures involving size, flavour, discounts and vouchers, I created exact-match, near-match and material-difference rules, then adjusted price priority and information hierarchy."}</p></StarSection>
    <section className="visual-grid three product"><Visual src="canbuy-discovery.png" alt="Can Buy Lah discovery screen" variant="phone" caption={zh ? "01 现场拍摄商品与价签，保留真实购物语境。" : "01 Capture product and shelf price in context."} /><Visual src="canbuy-product.png" alt="Can Buy Lah product screen" variant="phone" caption={zh ? "02 组织商品信息、口碑与使用建议。" : "02 Organise product information, feedback and guidance."} /><Visual src="canbuy-price.png" alt="Can Buy Lah price screen" variant="phone" caption={zh ? "03 并列现场价与线上参考价，明确购买判断。" : "03 Compare in-store and online references for a clear decision."} /></section>
    <StarSection locale={locale} kind="result"><p>{zh ? "当前简历口径：商品图片识别准确率 90%+、有效比价成功率 85%+；已邀请 30 名用户参与测试。产品已覆盖美妆、药品、食品和日用品等品类，并持续通过错误 Case 回查优化规则。" : "Current CV metrics: 90%+ product-image recognition accuracy, 85%+ effective price-match success and 30 invited test users. The MVP has been tested across beauty, pharmacy, food and daily necessities, with rules iterated through error-case review."}</p></StarSection>
    <Metrics items={zh ? [{ value: "90%+", label: "商品图片识别准确率" }, { value: "85%+", label: "有效比价成功率" }, { value: "30", label: "已邀请测试用户" }] : [{ value: "90%+", label: "image-recognition accuracy" }, { value: "85%+", label: "effective price-match success" }, { value: "30", label: "invited test users" }]} />
  </main>;
}

function WorkIndex({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <main className="page-shell work-index"><section className="page-heading"><p className="eyebrow">Portfolio / 2026</p><h1>{t.work}</h1><p>{locale === "zh" ? "六个项目，分为实习项目与独立项目。" : "Six projects across internships and independent work."}</p></section><section className="work-group"><div className="work-group-heading"><p className="eyebrow">01–04</p><h2>{t.internship}</h2></div><div>{projects.filter((project) => project.group === "internship").map((project) => <ProjectLink project={project} locale={locale} key={project.slug} />)}</div></section><section className="work-group"><div className="work-group-heading"><p className="eyebrow">05–06</p><h2>{t.independent}</h2></div><div>{projects.filter((project) => project.group === "independent").map((project) => <ProjectLink project={project} locale={locale} key={project.slug} />)}</div></section></main>;
}

function Home({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const skills = zh ? [{ label: "内容策略", kind: "strategy" }, { label: "达人与平台运营", kind: "operations" }, { label: "数据复盘", kind: "data" }, { label: "信息架构", kind: "architecture" }, { label: "AI 工具与工作流", kind: "ai" }, { label: "市场与竞品研究", kind: "research" }] : [{ label: "Content strategy", kind: "strategy" }, { label: "Creator & platform operations", kind: "operations" }, { label: "Data review", kind: "data" }, { label: "Information architecture", kind: "architecture" }, { label: "AI tools & workflows", kind: "ai" }, { label: "Market & competitor research", kind: "research" }];
  return <main><section className="cover-screen" aria-label="Sihan Wang portfolio cover"><img src={img("portfolio-cover-v2.png")} alt="Sihan Wang portfolio cover" /><p>个人作品集</p></section><section className="home-about"><div className="home-about-layout"><div className="home-about-copy about-card"><MediterraneanBoat /><p className="eyebrow">Sihan Wang 王思涵 · Singapore</p><h1>About Sihan</h1><div className="about-prose"><p className="home-lead">{zh ? "Hi，我是思涵，MBTI 是 INFJ。目前就读于南洋理工大学黄金辉信息与传播学院知识管理硕士，本科毕业于武汉理工大学网络与新媒体专业。" : "Hi, I’m Sihan, an INFJ. I am currently pursuing an MSc in Knowledge Management at NTU’s Wee Kim Wee School of Communication and Information, after completing a degree in Network and New Media at Wuhan University of Technology."}</p><p>{zh ? "我的实习经历主要聚焦内容运营、达人与用户运营、数据复盘和行业研究：从多账号内容规划与 KOL 筛选，到新媒体矩阵调研、跨部门项目推进，我习惯把复杂信息整理成清晰的下一步。学习和实习让我不断积累新的能力；我始终相信，认真走的每一步都会让人更接近想成为的自己。" : "My internship experience centres on content operations, creator and user operations, data review and industry research. From multi-account content planning and KOL selection to media-matrix research and cross-functional project delivery, I enjoy turning complex information into a clearer next step. Learning and practice keep adding to my toolkit, and I believe steady effort gets me closer to the person I want to become."}</p></div></div><div className="home-photo"><img src={img("sihan-portrait-lucerne.jpg")} alt="Sihan Wang in Lucerne" /><span>Lucerne, Switzerland</span></div></div><section className="home-skills"><p className="eyebrow">{zh ? "能力方向" : "Capabilities"}</p><div>{skills.map((skill) => <span key={skill.label}><SkillIcon kind={skill.kind} /><b>{skill.label}</b></span>)}</div></section></section><section id="experience" className="page-shell experience-page home-experience"><ExperienceContent locale={locale} /></section><section className="home-work"><div className="section-heading"><div><p className="eyebrow">Portfolio</p><h2>{zh ? "精选作品" : "Selected work"}</h2></div></div><section className="home-work-group"><div className="home-work-group-heading"><p className="eyebrow">01–04</p><h3>{zh ? "实习项目" : "Internship work"}</h3></div><div className="home-project-list">{projects.filter((project) => project.group === "internship").map((project) => <ProjectLink project={project} locale={locale} key={project.slug} />)}</div></section><section className="home-work-group"><div className="home-work-group-heading"><p className="eyebrow">05–06</p><h3>{zh ? "独立项目" : "Independent projects"}</h3></div><div className="home-project-list">{projects.filter((project) => project.group === "independent").map((project) => <ProjectLink project={project} locale={locale} key={project.slug} />)}</div></section></section></main>;
}

function ExperienceContent({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <><section className="page-heading"><p className="eyebrow">Profile</p><h1>{zh ? "教育与实习经历" : "Education & internship experience"}</h1></section><section className="experience-group"><div className="experience-group-heading"><p className="eyebrow">01 / {zh ? "教育经历" : "Education"}</p></div><div className="experience-list"><article><span>2025.08—2027.01</span><div><h2>{zh ? "南洋理工大学" : "Nanyang Technological University"}</h2><h3>{zh ? "知识管理硕士" : "MSc Knowledge Management"}</h3><p>{zh ? "聚焦信息系统、研究与数字化实践。" : "Focused on information systems, research and digital practice."}</p></div></article><article><span>2021.09—2025.07</span><div><h2>{zh ? "武汉理工大学" : "Wuhan University of Technology"}</h2><h3>{zh ? "网络与新媒体学士" : "BA Network and New Media"}</h3><p>{zh ? "内容生产、平台传播与用户沟通的本科训练。" : "Undergraduate training in content production, platform communication and audience understanding."}</p></div></article></div></section><section className="experience-group"><div className="experience-group-heading"><p className="eyebrow">02 / {zh ? "实习经历" : "Internships"}</p></div><div className="experience-list"><article><span>2026.04—07</span><div><h2>{zh ? "中航材利顿航空科技" : "Aviation Technology Operations"}</h2><h3>{zh ? "运营管理办公室实习" : "Operations Management Office Intern"}</h3><p>{zh ? "跨部门材料推进、项目台账与会议行动项跟进。" : "Cross-functional materials coordination, project tracking and action follow-up."}</p></div></article><article><span>2025.04—06</span><div><h2>Allison+Partners</h2><h3>{zh ? "企业传播部公关实习生" : "Corporate Communications Intern"}</h3><p>{zh ? "DW、Refrear、CAA 与 BBC Earth 项目的内容、KOL 与数据复盘工作。" : "Content, creator and review work across DW, Refrear, CAA and BBC Earth projects."}</p></div></article><article><span>2024.01—03</span><div><h2>{zh ? "腾讯 CSIG 智慧出行" : "Tencent CSIG Smart Mobility"}</h2><h3>{zh ? "行业运营实习生" : "Industry Operations Intern"}</h3><p>{zh ? "汽车品牌新媒体矩阵研究、需求拆解与体验方案支持。" : "Automotive media research, requirement decomposition and experience-solution support."}</p></div></article><article><span>2023.06—08</span><div><h2>{zh ? "同方知网" : "CNKI"}</h2><h3>{zh ? "市场专员实习生" : "Marketing Intern"}</h3><p>{zh ? "市场研究、客户会议支持和从 0 到 1 的公众号内容生产。" : "Market research, customer-meeting support and end-to-end WeChat content production."}</p></div></article></div></section></>;
}

function Experience({ locale }: { locale: Locale }) {
  return <main className="page-shell experience-page"><ExperienceContent locale={locale} /></main>;
}

export default function Portfolio({ locale, page }: { locale: Locale; page: string }) {
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
  return <div className={`portfolio locale-${locale}`} lang={locale === "zh" ? "zh-CN" : "en"}><Header locale={locale} current={current} />{body}<footer><span>© 2026 Sihan Wang</span><a href="mailto:sihan006@e.ntu.edu.sg">sihan006@e.ntu.edu.sg</a></footer></div>;
}
