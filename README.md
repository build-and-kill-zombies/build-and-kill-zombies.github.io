# Build and Kill Zombies Guide

An independent, fan-made information site for the Roblox game Build and Kill Zombies. It covers current codes, a tier list, the best car builds, a beginner route, and boss tips.

Live site: https://build-and-kill-zombies.github.io/

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
```

The site is a Next.js static export deployed to GitHub Pages from the `out/` directory.

## Before publishing

1. Keep `siteUrl`, `basePath`, and `readyForLaunch` in `content/generated/site.json` correct for the live domain.
2. Refresh page content and `lastReviewed` dates when the game updates.
3. Run `npm run typecheck`, `npm run lint`, and `npm run build` before pushing.
