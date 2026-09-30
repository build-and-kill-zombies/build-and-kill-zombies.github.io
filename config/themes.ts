import type { ThemeConfig, ThemePresetName } from "./types";

export const themes: Partial<Record<ThemePresetName, ThemeConfig>> = {
  "obsidian-red": {
    name: "obsidian-red" as ThemePresetName,
    label: "Site Theme",
    description: "Selected site theme",
    tokens: {
  "background": "222 100% 95%",
  "foreground": "0 0% 7%",
  "card": "222 35% 100%",
  "card-foreground": "0 0% 7%",
  "primary": "240 6% 10%",
  "primary-foreground": "0 0% 100%",
  "secondary": "222 100% 88%",
  "muted": "222 100% 90%",
  "muted-foreground": "0 0% 7%",
  "border": "222 100% 79%",
  "radius": "1.6rem",
  "card-shadow": "0 18px 50px rgba(37, 99, 235, .14)",
  "hero-gradient": "radial-gradient(circle at 18% 0%, hsl(240 6% 10% / .38), transparent 42%), radial-gradient(circle at 88% 8%, hsl(240 6% 10% / .2), transparent 36%)",
  "background-pattern": "radial-gradient(hsl(240 6% 10% / .08) 1px, transparent 1px)",
  "font-sans": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
  "font-heading": "\"Space Grotesk\", ui-sans-serif, system-ui, sans-serif",
  "heading-weight": "700",
  "heading-letter-spacing": "-0.04em"
},
  },
};
