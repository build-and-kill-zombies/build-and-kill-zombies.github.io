"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { InternalLink } from "@/config/types";
import { homePage } from "@/content/home";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event.type === "keydown" && (event as KeyboardEvent).key !== "Escape") return;
      if (event.type === "pointerdown" && root.contains(event.target as Node)) return;
      root.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((menu) => {
        menu.open = false;
        if (event.type === "keydown") menu.querySelector("summary")?.focus();
      });
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [pathname]);
  if (!isFixedTemplate()) return null;
  const skin = siteSkin();
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = path === "/" ? "home" : "inner";
  const currentSlug = page === "inner" ? path.split("/").filter(Boolean).at(-1) ?? "" : "";
  const nav = links
    .filter((link) => link.slug.replace(/^\/+|\/+$/g, ""))
    .map((link) => ({
      slug: link.slug.replace(/^\/+|\/+$/g, ""),
      label: link.label,
      href: routePath(link.slug),
    }));
  const rendered = renderFixedDocument({
    skin,
    page,
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug,
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: page === "home" ? assetPath(siteConfig.assets.cover) : null,
    heading: page === "home" ? homePage.hero.heading : null,
    lead: page === "home" ? homePage.hero.lead : null,
  });
  return <div ref={rootRef} className="fixed-template-header" dangerouslySetInnerHTML={{ __html: rendered.chrome }} />;
}
