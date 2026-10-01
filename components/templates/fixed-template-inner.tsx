import { FixedTemplateAds } from "@/components/templates/fixed-template-ads";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { DataTable as DataTableDefinition, SeoPageDefinition, Subsection } from "@/config/types";
import { getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument, renderTable } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { routePath } from "@/lib/urls";

function renderSubsection(subsection: Subsection): string {
  const paragraphs = subsection.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
  const bullets = subsection.bullets?.length
    ? `<ul>${subsection.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>`
    : "";
  const table = subsection.table ? renderTable(subsection.table) : "";
  return `<h3>${esc(subsection.heading)}</h3>${paragraphs}${bullets}${table}`;
}

function renderLinks(links: NonNullable<SeoPageDefinition["sections"][number]["links"]>): string {
  return `<ul class="related-links">${links.map((link) => {
    const description = link.description ? ` <span>— ${esc(link.description)}</span>` : "";
    return `<li><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${description}</li>`;
  }).join("")}</ul>`;
}

function articleInner(page: SeoPageDefinition): string {
  const lastUpdated = `<p class="meta-date">Last updated: <time datetime="${esc(page.lastReviewed)}">${esc(page.lastReviewed)}</time></p>`;
  const sections = page.sections.map((section) => {
    const intro = section.intro ? `<p>${esc(section.intro)}</p>` : "";
    const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>`
      : "";
    const subsections = (section.subsections ?? []).map(renderSubsection).join("");
    const steps = section.steps?.length
      ? `<ol>${section.steps.map((step) => `<li><b>${esc(step.heading)}</b> ${esc(step.description)}</li>`).join("")}</ol>`
      : "";
    const table = section.table ? renderTable(section.table) : "";
    const links = section.links?.length ? renderLinks(section.links) : "";
    return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${bullets}${subsections}${steps}${table}${links}</section>`;
  }).join("");
  const faq = page.faq?.length
    ? `<section id="faq"><h2>Frequently Asked Questions</h2>${page.faq.map((item) => `<div class="faq-item"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></div>`).join("")}</section>`
    : "";
  const related = getRelatedPages(page);
  const relatedHtml = related.length
    ? `<section id="related"><h2>Related Guides</h2><ul>${related.map((item) => `<li><a href="${esc(routePath(item.slug))}">${esc(item.navLabel)}</a></li>`).join("")}</ul></section>`
    : "";
  return `${lastUpdated}${sections}${faq}${relatedHtml}`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: "/",
    logoUrl: null,
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <FixedTemplateAds />
    </>
  );
}
