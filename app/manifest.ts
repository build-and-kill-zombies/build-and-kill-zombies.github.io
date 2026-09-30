import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { themes } from "@/config/themes";
import { assetPath } from "@/lib/urls";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const theme = themes[siteConfig.theme.preset] ?? themes["obsidian-red"];
  const tokens = theme?.tokens ?? {};
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: assetPath("/"),
    display: "standalone",
    background_color: `hsl(${tokens.background ?? "0 0% 100%"})`,
    theme_color: `hsl(${tokens.primary ?? "0 0% 10%"})`,
    icons: [{ src: assetPath(siteConfig.assets.logo), sizes: "any", type: "image/svg+xml" }],
  };
}
