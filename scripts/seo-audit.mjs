// Bing playbook audit of the built site. Report only: it never fails the build.
//
//   npm run build && npm run audit:seo            summary
//   node scripts/seo-audit.mjs --list             summary plus every offending URL
//   node scripts/seo-audit.mjs --json out.json    machine-readable rows
//
// Checks each indexable page in dist/ against the on-page rules that hold rankings on Bing:
//   - title 50-65 characters, leading with the query; a year only where the answer changes
//     by year (buying guides, reviews, deals), not on how-tos and fixes
//   - meta description 110-160 characters (Bing shows it, so it is ad copy)
//   - exactly one H1
//   - a real dateModified (a date shared by most pages is a stamped date, not a real one)
//   - FAQPage schema on articles
//   - at least three internal links pointing at every page
//   - a Bing Webmaster Tools verification tag (msvalidate.01) on the home page, or DNS verification
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const LIST = args.includes('--list');
const JSON_OUT = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

if (!fs.existsSync(DIST)) {
  console.error('seo-audit: dist/ not found — run the build first.');
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(DIST);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;|&apos;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const HOW_TO = /^(how |why |what |when |can |does |do |is |are |should )|\b(fix|troubleshoot|guide to|explained)\b/i;
const YEAR_OK = /\b(best|review|deals?|sale|price|prices|cost|costs|buying guide|black friday|cyber monday|top \d+)\b/i;

const rows = [];
const inbound = new Map();
const isNoindex = (h) => /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(h);

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const route = '/' + path.relative(DIST, file).replace(/index\.html$/, '').split(path.sep).join('/');
  for (const m of html.matchAll(/href="(?:https?:\/\/www\.[^/"]+)?(\/[^"#?]*)"/g)) {
    let t = m[1];
    if (/\.\w{2,5}$/.test(t)) continue;
    if (!t.endsWith('/')) t += '/';
    if (t === route) continue;
    if (!inbound.has(t)) inbound.set(t, new Set());
    inbound.get(t).add(route);
  }
  if (isNoindex(html) || route === '/404/') continue;

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').trim();
  const desc = decode(
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ??
      html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/)?.[1] ??
      '',
  ).trim();
  const h1 = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].length;
  const modified = html.match(/"dateModified"\s*:\s*"([^"]+)"/)?.[1]?.slice(0, 10) ?? null;
  const isArticle = /"datePublished"/.test(html);
  const faq = /"@type"\s*:\s*"FAQPage"/.test(html);
  const titleCore = title.replace(/\s*[|–—]\s*[^|–—]+$/, '');
  rows.push({
    route,
    title,
    titleLength: title.length,
    yearOnHowTo: /\b20\d\d\b/.test(titleCore) && HOW_TO.test(titleCore) && !YEAR_OK.test(titleCore),
    description: desc,
    descriptionLength: desc.length,
    h1,
    modified,
    isArticle,
    faq,
  });
}

for (const r of rows) r.inbound = r.route === '/' ? Infinity : inbound.get(r.route)?.size ?? 0;

const dateCounts = new Map();
for (const r of rows) if (r.modified) dateCounts.set(r.modified, (dateCounts.get(r.modified) ?? 0) + 1);
const [topDate, topCount] = [...dateCounts].sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const checks = [
  ['Title over 65 characters', rows.filter((r) => r.titleLength > 65)],
  ['Article title under 30 characters', rows.filter((r) => r.isArticle && r.titleLength < 30)],
  ['Year in a how-to or fix title', rows.filter((r) => r.yearOnHowTo)],
  ['Meta description missing', rows.filter((r) => !r.descriptionLength)],
  ['Meta description under 110', rows.filter((r) => r.descriptionLength && r.descriptionLength < 110)],
  ['Meta description over 160', rows.filter((r) => r.descriptionLength > 160)],
  ['Not exactly one H1', rows.filter((r) => r.h1 !== 1)],
  ['Article without dateModified', rows.filter((r) => r.isArticle && !r.modified)],
  ['Article without FAQPage schema', rows.filter((r) => r.isArticle && !r.faq)],
  ['Two or fewer internal links in', rows.filter((r) => r.inbound <= 2)],
];

console.log(`seo-audit: ${rows.length} indexable pages in dist/\n`);
for (const [label, hits] of checks) {
  console.log(`${String(hits.length).padStart(5)}  ${label}`);
  if (LIST)
    for (const r of hits)
      console.log(
        `         ${r.route}  ${label.includes('itle') || label.startsWith('Year') ? `(${r.titleLength}) ${r.title}` : label.startsWith('Meta') ? `(${r.descriptionLength})` : label.startsWith('Two') ? `(${r.inbound})` : ''}`,
      );
}
console.log(
  `\n  dateModified: ${dateCounts.size} distinct dates; most common ${topDate ?? 'n/a'} on ${topCount} pages` +
    (topCount > rows.length / 2 ? '  ← over half the site shares one date: check the dates are real' : ''),
);
console.log(`  Bing verification tag (msvalidate.01) on home page: ${/msvalidate\.01/.test(home) ? 'yes' : 'no (fine if verified by DNS)'}`);
for (const f of ['robots.txt', 'llms.txt']) console.log(`  /${f}: ${fs.existsSync(path.join(DIST, f)) ? 'present' : 'MISSING'}`);

if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(rows, (k, v) => (v === Infinity ? null : v), 1));
