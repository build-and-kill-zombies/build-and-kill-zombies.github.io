"use client";

import { useEffect } from "react";

const SOCIAL_BAR_SRC = "https://pl31582349.profitableratecpmnetwork.com/37/5f/fb/375ffb231e7c2805c59afba6f6729c07.js";

export function SocialBar() {
  useEffect(() => {
    if (document.querySelector("script[data-adsterra-social-bar]")) return;
    const script = document.createElement("script");
    script.src = SOCIAL_BAR_SRC;
    script.async = true;
    script.dataset.adsterraSocialBar = "true";
    document.body.appendChild(script);
  }, []);

  return null;
}
