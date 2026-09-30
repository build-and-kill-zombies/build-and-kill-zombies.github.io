"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ResponsiveBannerAd } from "@/components/integrations/banner-ad";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";

function findAnchor(name: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(`[data-ad-anchor="${name}"]`);
}

/** Mounts ad components into the anchor divs rendered inside the fixed-template HTML. */
export function FixedTemplateAds() {
  // Anchors come from server-rendered static HTML, so they exist before the client render starts.
  const [bannerAnchor] = useState(() => findAnchor("banner"));
  const [nativeAnchor] = useState(() => findAnchor("native"));

  return (
    <>
      {bannerAnchor ? createPortal(<ResponsiveBannerAd />, bannerAnchor) : null}
      {nativeAnchor ? createPortal(<NativeAdSlot />, nativeAnchor) : null}
    </>
  );
}
