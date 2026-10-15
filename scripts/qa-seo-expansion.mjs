import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Task-specific release checks: run after npm run build, against the starting commit.
const baseRef = process.argv[2] || 'c242ea027ee7f9bfcb9f66b7c225b721fb379ecb';
const atBase = (file) => execFileSync('git', ['show', `${baseRef}:${file}`]);
const read = (file) => readFileSync(file, 'utf8');
const pages = JSON.parse(read('content/generated/pages.json'));
const originalPages = JSON.parse(atBase('content/generated/pages.json'));
const newSlugs = ['car-ideas', 'halloween-event', 'weapons', 'skills', 'how-to-get-cash-fast'];
for (const old of originalPages) assert.deepEqual(pages.find(p => p.slug === old.slug), old, `${old.slug} content freeze`);
for (const file of ['content/generated/home.json', 'content/generated/site.json', 'content/generated/integrations.json', 'config/integrations.ts', 'components/integrations/banner-ad.tsx', 'components/integrations/social-bar.tsx', 'components/integrations/native-ad-client.tsx', 'lib/seo.ts', 'lib/schema.ts', 'app/sitemap.ts', 'app/robots.ts', 'next.config.ts', 'package-lock.json']) {
 assert.deepEqual(readFileSync(file), atBase(file), `${file} byte freeze`);
}
// Portal repair may change only the initial anchor discovery; effects and portals stay identical.
const adFile = 'components/templates/fixed-template-ads.tsx';
const oldAds = atBase(adFile).toString();
const newAds = read(adFile);
assert.equal(newAds.slice(newAds.indexOf('  useEffect')), oldAds.slice(oldAds.indexOf('  useEffect')), 'ad effects/portals unchanged');
assert.match(newAds, /banner: null, native: null/);
assert.equal(new Set(pages.map(p => p.slug)).size, pages.length, 'unique slugs');
assert.equal(pages.length, originalPages.length + 5);
const sitemap = read('out/sitemap.xml');
assert.match(read('out/robots.txt'), /Allow: \//);
assert.doesNotMatch(read('out/robots.txt'), /Disallow: \//);
const href = slug => `https://build-and-kill-zombies.github.io/${slug}/`;
const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
for (const slug of ['', ...pages.filter(p => p.enabled).map(p => p.slug)]) {
 const file = `out/${slug ? slug+'/' : ''}index.html`;
 assert.ok(existsSync(file), file);
 const html = read(file);
 assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, `${slug} H1 count`);
 const header = html.match(/<nav class="floating"[\s\S]*?<\/nav>/)?.[0];
 const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
 assert.ok(header && footer, `${slug} global navigation`);
 for (const target of pages.filter(p=>p.enabled && p.navVisible)) {
  assert.ok(header.includes(`href="/${target.slug}/"`), `${slug}: header ${target.slug}`);
  assert.ok(footer.includes(`href="/${target.slug}/"`), `${slug}: footer ${target.slug}`);
 }
 assert.equal((html.match(/data-ad-anchor="banner"/g)||[]).length,1, `${slug} banner anchor`);
 assert.equal((html.match(/data-ad-anchor="native"/g)||[]).length,1, `${slug} native anchor`);
 assert.equal((html.match(/googletagmanager.com\/gtag\/js/g)||[]).length,1, `${slug} GA instance`);
 if (!newSlugs.includes(slug)) continue;
 const p = pages.find(p=>p.slug===slug);
 assert.ok(p.title.length<=60 && p.description.length<=160, `${slug} meta lengths`);
 assert.ok(p.enabled && p.navVisible);
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
 assert.ok(html.includes(`rel="canonical" href="${href(slug)}"`), `${slug} canonical`);
 assert.ok(html.includes('content="index, follow"'), `${slug} robots`);
 assert.ok(sitemap.includes(`<loc>${href(slug)}</loc>`), `${slug} sitemap`);
 const article = html.match(/<article[\s\S]*?<\/article>/)?.[0];
 assert.ok(article && article.includes(p.sections[0].heading.replace(/&/g,'&amp;')), `${slug} rendered text`);
 assert.ok((article.match(/href="\//g)||[]).length>=4, `${slug} body internal links`);
 assert.ok(article.includes('href="/"'), `${slug} body home link`);
 assert.ok(article.includes('<table>'), `${slug} useful table`);
 const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
 const faq = schemas.find(s=>s['@type']==='FAQPage');
 assert.deepEqual(faq.mainEntity.map(q=>q.acceptedAnswer.text),p.faq.map(q=>q.answer));
 assert.ok(schemas.some(s=>s['@type']==='BreadcrumbList'));
 const body = strip(article);
 console.log(`PASS ${slug}: ${body.split(/\s+/).length} visible article words; title ${p.title.length}, description ${p.description.length}`);
}
console.log('PASS: all original page objects unchanged (including Codes), frozen files byte-identical, 5 static routes, canonicals, crawlability, sitemap, schemas, navigation, ad anchors and GA.');
