import { accentOverrideCss, resolveAccent, templatePack, type TemplateSkin } from "./catalog";
import { SPEC_HTML } from "./spec-html";
import type { DataTable } from "@/config/types";

export interface TemplateLink {
  slug: string;
  label: string;
  href: string;
}

export interface TemplateEntry {
  href: string;
  title: string;
  text: string;
}

export interface FixedTemplateInput {
  skin: TemplateSkin | string;
  page: "home" | "inner";
  accentColorId?: string | null;
  gameName: string;
  nav: TemplateLink[];
  currentSlug?: string | null;
  homeHref: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  heading?: string | null;
  lead?: string | null;
  /** Real SEO body. Replaces the approved inner article demo. */
  articleHtml?: string | null;
  /** Real pages. Replaces demo cards on the home template. */
  entries?: TemplateEntry[] | null;
  /** Official game page shown as a hero CTA on the home template. */
  officialUrl?: string | null;
  /** Extra real copy appended inside <main>, after the approved structure. */
  supplementHtml?: string | null;
}

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderTable(table: DataTable): string {
  const head = table.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join("");
  const body = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="table-scroll"><table><caption>${esc(table.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/** Shared styles for real article content (tables, lists, link chips) not present in the approved template CSS. */
export const CONTENT_CSS = `
.layout article h3,.doc-section h3{font-size:20px;margin:24px 0 8px}
.layout article table,.doc-section table{width:100%;border-collapse:collapse;font-size:14px;background:#fff;border-radius:14px;overflow:hidden}
.layout article th,.layout article td,.doc-section th,.doc-section td{border:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top;line-height:1.5}
.layout article th,.doc-section th{background:#EFF4FF;font-weight:800}
.layout article caption,.doc-section caption{caption-side:top;text-align:left;font-weight:800;padding:0 0 8px;color:var(--ink)}
.blocks{text-align:center}
.layout article ul,.doc-section ul{padding-left:20px;margin:10px 0}
.layout article li,.doc-section li{margin:6px 0}
.table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:14px 0}
.table-scroll table{min-width:520px}
.related-links{list-style:none;padding:0}
.related-links li{margin:6px 0}
.related-links a{display:inline-block;background:#fff;border:1px solid var(--line);border-radius:999px;padding:8px 14px;font-weight:800;color:var(--accent);margin:2px 6px 2px 0}
.doc-section{padding:8px 0 22px}
.doc-section h2{font-size:27px;margin:30px 0 10px}
.doc-section p{color:var(--muted);line-height:1.75;margin:10px 0}
.doc-section li{color:var(--muted);line-height:1.7}
.faq-item h3{margin:18px 0 6px}
.faq-item p{color:var(--muted);line-height:1.75}
.meta-date{font-size:13px;color:var(--muted);margin:0 0 6px}
.brand{display:inline-flex;align-items:center;gap:8px;font-size:15px;white-space:nowrap;padding:0 10px;min-width:0}
.brand img{flex-shrink:0}
.brand span,.brand i{white-space:nowrap}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:center}
.hero-copy{text-align:left}
.hero-copy h1{font-size:46px;margin:14px 0}
.hero-copy p{margin-left:0}
.hero-copy .actions{justify-content:flex-start;margin-top:20px}
.hero-media img{border-radius:24px;border:2px solid #272536;box-shadow:6px 6px 0 #272536}
@media(max-width:960px){.hero-grid{grid-template-columns:1fr}.hero-copy{text-align:center}.hero-copy p{margin-left:auto;margin-right:auto}.hero-copy .actions{justify-content:center}}
@media(max-width:820px){.brand{font-size:13px}.brand img{height:22px;width:22px}.hero-copy h1{font-size:36px}.hero-copy{padding-bottom:6px}}
@media(max-width:820px){.blocks .block:last-child:nth-child(odd){grid-column:1/-1}}
.nav-inner{min-width:0}
.nav{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.nav::-webkit-scrollbar{display:none}
.nav-link{flex:0 0 auto;white-space:nowrap}
body{overflow-x:hidden}
@media(max-width:480px){.brand{font-size:12px;padding:0 6px}.nav-link{padding:9px 11px;font-size:12px}}
`;

export function templateNavLinks(nav: TemplateLink[], page: "home" | "inner", currentSlug?: string | null): string {
  const items = nav.filter((item) => item.slug.replace(/^\/+|\/+$/g, ""));
  return items.map((item) => {
    const slug = item.slug.replace(/^\/+|\/+$/g, "");
    const active = page === "inner" && currentSlug && slug === currentSlug.replace(/^\/+|\/+$/g, "");
    return `<a class="nav-link${active ? " active" : ""}" href="${esc(item.href)}">${esc(item.label)}</a>`;
  }).join("");
}

function brandInner(gameName: string, skin: string, page: "home" | "inner", logoUrl?: string | null): string {
  const logo = logoUrl
    ? `<img alt="" src="${esc(logoUrl)}" style="height:26px;width:26px;object-fit:cover;border-radius:8px">`
    : "";
  if (skin === "resource") {
    const tag = page === "home" ? "<small>GAME RESOURCE CENTER</small>" : "";
    return `${logo}${esc(gameName)}${tag}`;
  }
  const parts = gameName.trim().split(/\s+/).filter(Boolean);
  const tag = skin === "horror" ? "i" : "span";
  if (parts.length < 2) return `${logo}${esc(gameName)}`;
  const last = esc(parts[parts.length - 1] ?? "");
  const rest = esc(parts.slice(0, -1).join(" "));
  return `${logo}${rest} <${tag}>${last}</${tag}>`;
}

function replaceNav(html: string, links: string): string {
  if (html.includes('<nav class="wrap nav">')) {
    return html.replace(/<nav class="wrap nav">[\s\S]*?<\/nav>/, `<nav class="wrap nav">${links}</nav>`);
  }
  if (html.includes('<div class="nav">')) {
    return html.replace(/<div class="nav">[\s\S]*?<\/div>/, `<div class="nav">${links}</div>`);
  }
  return html.replace(/<nav class="nav">[\s\S]*?<\/nav>/, `<nav class="nav">${links}</nav>`);
}

function replaceBrand(html: string, inner: string, homeHref: string): string {
  return html.replace(
    /<a class="(brand|logo)" href="home\.html" aria-label="Back to homepage">[\s\S]*?<\/a>/,
    `<a class="$1" href="${esc(homeHref)}" aria-label="Back to homepage">${inner}</a>`,
  );
}

function replaceCrumbs(html: string, homeHref: string, current: string | null): string {
  const body = current
    ? `<a href="${esc(homeHref)}">Home</a> › ${esc(current)}`
    : `<a href="${esc(homeHref)}">Home</a>`;
  return html
    .replace(/<div class="site-breadcrumb">[\s\S]*?<\/div>/g, `<div class="site-breadcrumb">${body}</div>`)
    .replace(/<div class="crumb">[\s\S]*?<\/div>/g, `<div class="crumb">${body}</div>`);
}

function replaceBalanced(html: string, tag: string, className: string, inner: string): string {
  const marker = `<${tag} class="${className}">`;
  const start = html.indexOf(marker);
  if (start < 0) return html;
  const openEnd = start + marker.length;
  const closer = `</${tag}>`;
  let depth = 1;
  let index = openEnd;
  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, index);
    const nextClose = html.indexOf(closer, index);
    if (nextClose < 0) return html;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + tag.length + 1;
    } else {
      depth -= 1;
      if (depth === 0) return `${html.slice(0, openEnd)}${inner}${html.slice(nextClose)}`;
      index = nextClose + closer.length;
    }
  }
  return html;
}

function applyEntries(html: string, skin: string, entries: TemplateEntry[]): string {
  const cards = entries.map((entry, index) => {
    const title = esc(entry.title);
    const text = esc(entry.text);
    const href = esc(entry.href);
    if (skin === "portal") return `<a class="card" href="${href}"><div class="icon">${index + 1}</div><h3>${title}</h3><p>${text}</p></a>`;
    if (skin === "wiki") return `<a class="row" href="${href}"><b>${title}</b><span>${text}</span></a>`;
    if (skin === "editorial") {
      return `<article class="article"><a href="${href}"><div class="thumb"></div><div class="article-body"><h3>${title}</h3><p>${text}</p></div></a></article>`;
    }
    if (skin === "glass") {
      return `<a class="block" href="${href}"><div class="num">0${index + 1}</div><b>${title}</b><p>${text}</p></a>`;
    }
    if (skin === "pixel") return `<a class="tile" href="${href}"><div class="icon">▣</div><b>${title}</b><p>${text}</p></a>`;
    if (skin === "horror") return `<article class="card"><a href="${href}"><div class="tag">GUIDE</div><h3>${title}</h3><p>${text}</p></a></article>`;
    return `<a class="quick" href="${href}"><b>${title}</b><span>${text}</span></a>`;
  }).join("");
  if (skin === "portal") return replaceBalanced(html, "div", "grid", cards);
  if (skin === "wiki") return replaceBalanced(html, "div", "list", cards);
  if (skin === "resource") return replaceBalanced(html, "div", "quick-grid", cards);
  if (skin === "editorial") return replaceBalanced(html, "section", "grid", cards);
  if (skin === "glass") return replaceBalanced(html, "div", "blocks", cards);
  if (skin === "pixel") return replaceBalanced(html, "div", "tiles", cards);
  if (skin === "horror") return replaceBalanced(html, "div", "cards", cards);
  return html;
}

function insertBanner(html: string, bannerUrl: string): string {
  const img = `<img alt="" src="${esc(bannerUrl)}" style="width:100%;height:180px;object-fit:cover;display:block">`;
  if (html.includes('<div class="visual">')) return html.replace('<div class="visual">', `<div class="visual">${img}`);
  if (html.includes('<header class="hero-wrap">')) return html.replace('<header class="hero-wrap">', `<header class="hero-wrap">${img}`);
  if (html.includes('<article class="lead-card">')) return html.replace('<article class="lead-card">', `<article class="lead-card">${img}`);
  if (html.includes('<section class="hero">')) return html.replace('<section class="hero">', `<section class="hero">${img}`);
  if (html.includes('<section class="panel hero">')) return html.replace('<section class="panel hero">', `<section class="panel hero">${img}`);
  return html;
}

/** Restyle the glass home hero from stacked-banner into a copy-left / media-right grid. */
function splitHero(html: string, officialUrl?: string | null): string {
  const marker = '<section class="hero">';
  const start = html.indexOf(marker);
  if (start < 0) return html;
  const rest = html.slice(start + marker.length);
  const imgMatch = rest.match(/^<img[^>]*>/);
  if (!imgMatch) return html;
  const blocksIndex = rest.indexOf('<div class="blocks">');
  if (blocksIndex < 0) return html;
  let copy = rest.slice(imgMatch[0].length, blocksIndex);
  if (officialUrl) {
    copy = copy.replace(
      /(<div class="actions">[\s\S]*?)(<\/div>)/,
      `$1<a class="btn" href="${esc(officialUrl)}" target="_blank" rel="noopener noreferrer">Play on Roblox</a>$2`,
    );
  }
  const img = imgMatch[0]
    .replace('alt=""', 'alt="Build and Kill Zombies Roblox gameplay with a player-built zombie-killing car"')
    .replace(/style="[^"]*"/, 'style="width:100%;height:auto;display:block"')
    .replace(/<img /, '<img width="1524" height="848" ');
  const rebuilt = `<section class="hero"><div class="hero-grid"><div class="hero-copy">${copy}</div><div class="hero-media">${img}</div></div></section>`;
  return `${html.slice(0, start)}${rebuilt}${rest.slice(blocksIndex)}`;
}

function applyCopy(html: string, input: FixedTemplateInput): string {
  let next = html.replaceAll("Riftfall Survival", input.gameName);
  next = next.replace("PLAYFUL GAME GUIDE", "GAME GUIDE");
  if (input.heading) next = next.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(input.heading)}</h1>`);
  if (input.lead) {
    if (next.includes('<p class="lead">')) next = next.replace(/<p class="lead">[\s\S]*?<\/p>/, `<p class="lead">${esc(input.lead)}</p>`);
    else if (next.includes('<p class="deck">')) next = next.replace(/<p class="deck">[\s\S]*?<\/p>/, `<p class="deck">${esc(input.lead)}</p>`);
    else next = next.replace(/(<h1>[\s\S]*?<\/h1>)<p>[\s\S]*?<\/p>/, `$1<p>${esc(input.lead)}</p>`);
  }
  return next;
}

/** Ad anchors are self-contained empty divs; the client mounts ad components into them via portal. */
export const ADSTERRA_BANNER_ANCHOR = '<div data-ad-anchor="banner"></div>';
export const ADSTERRA_NATIVE_ANCHOR = '<div data-ad-anchor="native"></div>';

function insertAfterAnchor(source: string, anchor: string, insertion: string, fromIndex = 0): string | null {
  const anchorIndex = source.indexOf(anchor, fromIndex);
  if (anchorIndex < 0) return null;
  const at = anchorIndex + anchor.length;
  return `${source.slice(0, at)}${insertion}${source.slice(at)}`;
}

/**
 * Banner goes right after the hero section (the first-screen visual block); Native goes after the
 * first content block that closes after the banner slot, keeping at least one real block between them.
 */
function insertAdMarkers(html: string, page: "home" | "inner", skin: string): string {
  let next = insertAfterAnchor(html, "</section>", ADSTERRA_BANNER_ANCHOR) ?? html;
  const bannerIndex = next.indexOf(ADSTERRA_BANNER_ANCHOR);
  if (bannerIndex < 0) return next;

  if (skin === "glass" && page === "home") {
    // Glass home: the guide-entry cards grid sits between hero and supplement — native goes right after it.
    next = insertAfterAnchor(next, '</div><div class="section">', ADSTERRA_NATIVE_ANCHOR)
      ?? insertAfterAnchor(next, "</section>", ADSTERRA_NATIVE_ANCHOR, bannerIndex)
      ?? next;
  } else {
    next = insertAfterAnchor(next, "</section>", ADSTERRA_NATIVE_ANCHOR, bannerIndex) ?? next;
  }
  return next;
}

export function renderFixedTemplate(input: FixedTemplateInput): string {
  const pack = templatePack(input.skin);
  const source = SPEC_HTML[pack.specId]?.[input.page];
  if (!source) throw new Error(`Missing approved HTML for ${pack.specId} ${input.page}`);
  const paint = resolveAccent(pack.skin, input.accentColorId);
  const currentLabel = input.page === "inner"
    ? (input.nav.find((item) => item.slug.replace(/^\/+|\/+$/g, "") === (input.currentSlug || "").replace(/^\/+|\/+$/g, ""))?.label || input.heading || "Guide")
    : null;
  let html = source;
  html = replaceBrand(html, brandInner(input.gameName, pack.skin, input.page, input.logoUrl), input.homeHref);
  html = html.replaceAll('href="home.html"', `href="${esc(input.homeHref)}"`);
  html = replaceNav(html, templateNavLinks(input.nav, input.page, input.currentSlug));
  html = replaceCrumbs(html, input.homeHref, currentLabel);
  html = html.replace(/href="inner\.html#([^"]+)"/g, (_match, id: string) => {
    const clean = (item: { slug: string }) => item.slug.replace(/^\/+|\/+$/g, "");
    const linked = input.nav.find((item) => clean(item) === id) ?? input.nav.find((item) => clean(item).endsWith(id));
    return `href="${esc(linked?.href || `#${id}`)}"`;
  });
  if (input.bannerUrl) {
    html = insertBanner(html, input.bannerUrl);
    if (input.page === "home") html = splitHero(html, input.officialUrl);
  }
  if (input.page === "home" && input.entries) {
    html = html.replace(/<section class="section"><div class="cards">[\s\S]*?<\/section>/, "");
    html = applyEntries(html, pack.skin, input.entries);
  }
  if (input.page === "inner" && input.articleHtml) {
    html = replaceArticleBody(html, input.articleHtml);
    html = syncAside(html, input.articleHtml);
  }
  if (input.supplementHtml) html = html.replace("</main>", `${input.supplementHtml}</main>`);
  html = applyCopy(html, input);
  html = insertAdMarkers(html, input.page, pack.skin);
  html = html.replace(/--accent:#[0-9A-Fa-f]{6}/, `--accent:${paint.textAccent}`);
  html = html.replace("</style>", `${accentOverrideCss(pack.skin, paint)}</style>`);
  return html;
}

function syncAside(html: string, articleHtml: string): string {
  const sections = [...articleHtml.matchAll(/<section id="([^"]+)">\s*<h2>([\s\S]*?)<\/h2>/g)];
  if (!sections.length || !html.includes("<aside")) return html;
  const links = sections.map((match) => `<a href="#${match[1]}">${match[2]}</a>`).join("");
  return html.replace(/<aside([^>]*)>([\s\S]*?)<\/aside>/, (_full, attrs: string, inner: string) => {
    let used = false;
    const next = inner.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, () => {
      if (used) return "";
      used = true;
      return links;
    });
    return `<aside${attrs}>${used ? next : `${inner}${links}`}</aside>`;
  });
}

function replaceArticleBody(html: string, articleHtml: string): string {
  const match = html.match(/<article([^>]*)>([\s\S]*?)<\/article>/);
  if (!match) return html;
  const inner = match[2] ?? "";
  const crumb = inner.match(/<div class="(?:crumb|site-breadcrumb)">[\s\S]*?<\/div>/);
  const h1 = inner.match(/<h1>[\s\S]*?<\/h1>/);
  return html.replace(match[0], `<article${match[1] ?? ""}>${crumb?.[0] ?? ""}${h1?.[0] ?? ""}${articleHtml}</article>`);
}

export function extractStyle(html: string): string {
  return [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((match) => match[1] ?? "").join("\n");
}

export function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return (match?.[1] ?? html).replace(/<script[\s\S]*?<\/script>/g, "");
}

export function splitFixedChrome(body: string, skin: string): { chrome: string; rest: string } {
  const source = body.trim();
  const pattern = skin === "editorial"
    ? /^<div class="topline">[\s\S]*?<\/header>/
    : skin === "resource"
      ? /^<header[\s\S]*?<\/header>\s*<div class="navbar">[\s\S]*?<\/div>/
      : skin === "glass"
        ? /^<nav class="floating">[\s\S]*?<\/nav>/
        : /^<header[\s\S]*?<\/header>/;
  const match = source.match(pattern);
  if (!match) return { chrome: "", rest: source };
  return { chrome: match[0], rest: source.slice(match[0].length) };
}

function scopeSelectorList(selector: string, scope: string): string {
  return selector.split(",").map((part) => {
    const sel = part.trim();
    if (!sel || sel.startsWith("@")) return sel;
    if (sel === ":root" || sel === "html" || sel === "body") return scope;
    return `${scope} ${sel}`;
  }).join(",");
}

export function scopeTemplateCss(css: string, scope: string): string {
  let index = 0;
  let out = "";
  const source = css.trim();
  while (index < source.length) {
    while (source[index] === " " || source[index] === "\n") index += 1;
    if (index >= source.length) break;
    if (source.startsWith("@media", index) || source.startsWith("@supports", index)) {
      const brace = source.indexOf("{", index);
      if (brace < 0) break;
      const header = source.slice(index, brace + 1);
      let depth = 1;
      let cursor = brace + 1;
      while (cursor < source.length && depth > 0) {
        if (source[cursor] === "{") depth += 1;
        else if (source[cursor] === "}") depth -= 1;
        cursor += 1;
      }
      const inner = source.slice(brace + 1, cursor - 1);
      out += `${header}${scopeTemplateCss(inner, scope)}}`;
      index = cursor;
      continue;
    }
    const brace = source.indexOf("{", index);
    if (brace < 0) break;
    const selector = source.slice(index, brace).trim();
    const close = source.indexOf("}", brace);
    if (close < 0) break;
    const body = source.slice(brace + 1, close);
    out += `${scopeSelectorList(selector, scope)}{${body}}`;
    index = close + 1;
  }
  return out;
}

export function scopedTemplateCss(skin: string, accentColorId?: string | null): string {
  const pack = templatePack(skin);
  const home = SPEC_HTML[pack.specId]?.home ?? "";
  const inner = SPEC_HTML[pack.specId]?.inner ?? "";
  const paint = resolveAccent(pack.skin, accentColorId);
  const raw = `${extractStyle(home)}\n${extractStyle(inner)}\n${accentOverrideCss(pack.skin, paint)}\n${CONTENT_CSS}`;
  return scopeTemplateCss(raw, `body[data-fixed-template="${pack.skin}"]`);
}

export function renderFixedDocument(input: FixedTemplateInput): { html: string; body: string; chrome: string; rest: string } {
  const html = renderFixedTemplate(input);
  const body = extractBody(html);
  const parts = splitFixedChrome(body, templatePack(input.skin).skin);
  return { html, body, ...parts };
}
