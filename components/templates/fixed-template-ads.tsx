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
  const [anchors, setAnchors] = useState(() => ({ banner: findAnchor("banner"), native: findAnchor("native") }));

  useEffect(() => {
    // Re-check after hydration settles: if hydration recovery re-created the
    // template HTML, anchors captured during render are detached. setTimeout so
    // setState is not called synchronously in the effect (react-hooks lint rule).
    const id = setTimeout(() => {
      setAnchors((prev) => {
        const next = {
          banner: prev.banner?.isConnected ? prev.banner : findAnchor("banner"),
          native: prev.native?.isConnected ? prev.native : findAnchor("native"),
        };
        return next.banner === prev.banner && next.native === prev.native ? prev : next;
      });
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {anchors.banner ? createPortal(<ResponsiveBannerAd />, anchors.banner) : null}
      {anchors.native ? createPortal(<NativeAdSlot />, anchors.native) : null}
    </>
  );
}
