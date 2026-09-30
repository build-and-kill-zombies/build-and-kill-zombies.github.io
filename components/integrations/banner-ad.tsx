"use client";

import { useEffect, useRef } from "react";

// Current-site Adsterra codes. Desktop and mobile are the same slot in two sizes — only one may load per visit.
const DESKTOP_BANNER = {
  key: "6a211a0747f7a2092f51ed8e96597c5c",
  width: 728,
  height: 90,
  scriptUrl: "https://www.highrevenueformat.com/6a211a0747f7a2092f51ed8e96597c5c/invoke.js",
};

const MOBILE_BANNER = {
  key: "091ebdb3aa2d7506b3e2f395fe9302eb",
  width: 320,
  height: 50,
  scriptUrl: "https://www.highrevenueformat.com/091ebdb3aa2d7506b3e2f395fe9302eb/invoke.js",
};

export function ResponsiveBannerAd() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.dataset.bannerInit === "true") return;
    host.dataset.bannerInit = "true";
    const ad = window.matchMedia("(min-width: 768px)").matches ? DESKTOP_BANNER : MOBILE_BANNER;
    (window as { atOptions?: Record<string, unknown> }).atOptions = {
      key: ad.key,
      format: "iframe",
      height: ad.height,
      width: ad.width,
      params: {},
    };
    const script = document.createElement("script");
    script.src = ad.scriptUrl;
    script.async = true;
    host.appendChild(script);
  }, []);

  return (
    <aside className="ad-banner-slot" aria-label="Advertisement">
      <p className="ad-label">Advertisement</p>
      <div className="ad-banner-frame">
        <div ref={hostRef} data-adsterra-banner />
      </div>
    </aside>
  );
}
