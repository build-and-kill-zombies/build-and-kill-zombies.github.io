import { FixedTemplateAds } from "@/components/templates/fixed-template-ads";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument, renderTable } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

const CARD_TEXTS: Record<string, string> = {
  codes: "Active codes, redemption steps, and expired lists.",
  "tier-list": "Upgrade priorities ranked for stronger runs.",
  "best-build": "The car setup and upgrade order that works.",
  "beginner-guide": "A first-session route for new players.",
  bosses: "Boss prep, timers, and fight strategy.",
};

function supplement(home: HomePageDefinition): string {
  const supporting = home.hero.supportingText ? `<p>${esc(home.hero.supportingText)}</p>` : "";
  const sections = home.sections.map((section) => {
    const intro = section.intro ? `<p>${esc(section.intro)}</p>` : "";
    const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>`
      : "";
    const steps = section.steps?.length
      ? `<ol>${section.steps.map((step) => `<li><b>${esc(step.heading)}</b> ${esc(step.description)}</li>`).join("")}</ol>`
      : "";
    const table = section.table ? renderTable(section.table) : "";
    const links = section.links?.length
      ? `<ul class="related-links">${section.links.map((link) => `<li><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${link.description ? ` <span>— ${esc(link.description)}</span>` : ""}</li>`).join("")}</ul>`
      : "";
    return `<section id="${esc(section.id)}" class="doc-section"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${bullets}${steps}${table}${links}</section>`;
  }).join("");
  const faq = home.faq.length
    ? `<section id="faq" class="doc-section"><h2>Frequently Asked Questions</h2>${home.faq.map((item) => `<div class="faq-item"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></div>`).join("")}</section>`
    : "";
  const updated = `<p class="meta-date">Last updated: <time dateTime="${esc(home.lastReviewed)}">${esc(home.lastReviewed)}</time></p>`;
  return `<div class="section">${updated}${supporting}${sections}${faq}</div>`;
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.map((link) => {
    const slug = link.slug.replace(/^\/+|\/+$/g, "");
    return {
      href: routePath(link.slug),
      title: link.label,
      text: CARD_TEXTS[slug] ?? link.label,
    };
  });
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    officialUrl: siteConfig.game.officialUrl,
    supplementHtml: supplement(home),
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <FixedTemplateAds />
    </>
  );
}