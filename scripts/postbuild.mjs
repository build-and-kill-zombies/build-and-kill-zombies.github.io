import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const root = process.cwd();
const output = join(root, "out");
const publicDir = join(root, "public");

writeFileSync(join(output, ".nojekyll"), "", "utf8");

const customDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN?.trim();
if (customDomain) writeFileSync(join(output, "CNAME"), `${customDomain}\n`, "utf8");

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const absolute = join(directory, name);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

/** Ensure technical verification files from public/ are present at the build output root. */
function ensureTechnicalPublicFiles() {
  if (!existsSync(publicDir) || !existsSync(output)) return [];
  const copied = [];
  for (const absolute of walk(publicDir)) {
    const local = relative(publicDir, absolute).split(sep).join("/");
    const base = local.split("/").pop() || "";
    const technical = /^google[a-z0-9_-]*\.html$/i.test(base)
      || /^(robots\.txt|ads\.txt)$/i.test(base)
      || local.startsWith(".well-known/");
    if (!technical) continue;
    const target = join(output, local);
    mkdirSync(dirname(target), { recursive: true });
    if (!existsSync(target)) {
      copyFileSync(absolute, target);
      copied.push(local);
    }
  }
  return copied;
}

/** Inject the Google tag snippet right after <head> in every HTML file; GSC GA verification requires it there. */
function injectGoogleAnalytics() {
  const integrationsPath = join(root, "content", "generated", "integrations.json");
  if (!existsSync(integrationsPath) || !existsSync(output)) return 0;
  const integrations = JSON.parse(readFileSync(integrationsPath, "utf8"));
  const measurementId = integrations.gaMeasurementId;
  if (!measurementId) return 0;
  const snippet =
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`
    + `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`
    + `gtag('js',new Date());gtag('config','${measurementId}');</script>`;
  let injected = 0;
  for (const file of walk(output)) {
    if (!file.endsWith(".html")) continue;
    const html = readFileSync(file, "utf8");
    if (html.includes("googletagmanager.com/gtag/js")) continue;
    if (!html.includes("<head>")) continue;
    writeFileSync(file, html.replace("<head>", `<head>${snippet}`), "utf8");
    injected += 1;
  }
  return injected;
}

const ensured = ensureTechnicalPublicFiles();
const injected = injectGoogleAnalytics();
console.log(
  customDomain
    ? `Static output prepared with CNAME ${customDomain}.`
    : "Static output prepared for GitHub Pages.",
);
if (ensured.length) {
  console.log(`Ensured technical public files in out/: ${ensured.join(", ")}`);
}
if (injected) {
  console.log(`Injected Google Analytics tag into ${injected} HTML pages.`);
}
