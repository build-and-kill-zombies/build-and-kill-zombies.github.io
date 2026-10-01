"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ResponsiveBannerAd } from "@/components/integrations/banner-ad";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";

function findAnchor(name: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(`[data-ad-anchor="${name}"]`);
}

/** Mounts ad components into the anchor divs rendered inside the fixed-template HTML. */
export function FixedTemplateAds() {
  // Resolve anchors after hydration commit: if hydration recovery re-creates the
  // template HTML, anchors captured during render would be detached from the document.
  const [anchors, setAnchors] = useState<{ banner: HTMLElement | null; native: HTMLElement | null }>({
    banner: null,
    native: null,
  });

  useEffect(() => {
    setAnchors({ banner: findAnchor("banner"), native: findAnchor("native") });
  }, []);

  return (
    <>
      {anchors.banner ? createPortal(<ResponsiveBannerAd />, anchors.banner) : null}
      {anchors.native ? createPortal(<NativeAdSlot />, anchors.native) : null}
    </>
  );
}
