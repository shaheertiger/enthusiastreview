// Writes the Markdown side of the site into dist/ after `astro build` (Dualmark / AEO):
//
//   dist/<section>/<slug>.md   Markdown twin of every guide (/best/x/ → /best/x.md)
//   dist/index.md, best.md, guides.md, compare.md   home and hub twins
//   dist/md-catalog.json       every Markdown route (served at /api/md/_catalog)
//   dist/llms.txt              site index for AI agents (llmstxt.org)
//   dist/llms-full.txt         guide for AI assistants + URL index + full content of top pages
//   dist/ai.txt                how AI systems may use the content
//
// The Markdown is generated from the same JSON the HTML is built from
// (src/content/pages/*.json), so the two can never disagree. middleware.js serves these
// files to AI agents and to anyone asking for text/markdown (see https://dualmark.dev).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://www.enthusiastreview.com';
const SITE_NAME = 'Enthusiast Review';
const TAG = 'sktiger-20';
const FULL_LIMIT = 400_000; // characters in llms-full.txt

if (!fs.existsSync(DIST)) {
  console.error('build-markdown: dist/ not found — run astro build first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/catalog.json'), 'utf8'));
const pages = fs
  .readdirSync(path.join(ROOT, 'src/content/pages'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/pages', f), 'utf8')))
  .sort((a, b) => a.h1.localeCompare(b.h1));
// Same real dates as src/lib/content.ts: the git date from scripts/page-dates.mjs, never
// earlier than the page was published.
const gitDatesFile = path.join(ROOT, 'src/data/git-dates.json');
const gitDates = fs.existsSync(gitDatesFile) ? JSON.parse(fs.readFileSync(gitDatesFile, 'utf8')) : {};
for (const p of pages) {
  const d = gitDates[p.slug] ?? p.updated;
  p.updated = d < p.published ? p.published : d;
}
const urlOf = (p) => `${SITE_URL}/${p.section}/${p.slug}/`;
// Hubs and site-wide files are as new as the newest guide, not as new as the build.
const today = pages.reduce((m, p) => (p.updated > m ? p.updated : m), '0000-00-00');

/* ---------- helpers mirroring src/data/affiliate.ts ---------- */
function searchQuery(name) {
  const model = name.match(/\(([A-Z0-9][A-Z0-9-]{3,})\)/)?.[1];
  const brand = name.split(/\s+/)[0];
  if (model && /\d/.test(model) && !name.startsWith(model)) return `${brand} ${model}`;
  return name.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
}
function amazonLink(p) {
  if (p.url?.startsWith('http')) return p.url.includes('tag=') ? p.url : `${p.url}${p.url.includes('?') ? '&' : '?'}tag=${TAG}`;
  const asin = p.asin || catalog[p.catalogId]?.asin || catalog[p.id]?.asin;
  if (asin) return `https://www.amazon.com/dp/${asin}?tag=${TAG}&linkCode=ll1`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery(p.name))}&tag=${TAG}`;
}
/** Content text is already Markdown; make internal links absolute so the file stands alone. */
const abs = (s = '') => s.replace(/\]\((\/[^)\s]*)\)/g, (_, href) => `](${SITE_URL}${href})`);
const esc = (s = '') => String(s).replace(/\|/g, '\\|');

function blockMd(b) {
  switch (b.type) {
    case 'p': return abs(b.text);
    case 'h3': return `### ${abs(b.text)}`;
    case 'ul': return b.items.map((i) => `- ${abs(i)}`).join('\n');
    case 'ol': return b.items.map((i, n) => `${n + 1}. ${abs(i)}`).join('\n');
    case 'checklist':
      return b.items.map((i) => [`- **${i.label}:** ${abs(i.text)}`, ...(i.sub ?? []).map((s) => `  - ${abs(s)}`)].join('\n')).join('\n');
    case 'table':
      return [
        `| ${b.head.map(esc).join(' | ')} |`,
        `| ${b.head.map(() => '---').join(' | ')} |`,
        ...b.rows.map((r) => `| ${r.map((c) => esc(abs(c))).join(' | ')} |`),
        ...(b.caption ? ['', `*${b.caption}*`] : []),
      ].join('\n');
    case 'callout': return `> ${b.title ? `**${b.title}:** ` : ''}${abs(b.text)}`;
    case 'stats': return b.items.map((s) => `- **${s.value}** — ${abs(s.label)}`).join('\n');
    default: return '';
  }
}

function pageMd(p) {
  const out = [];
  out.push(`# ${p.h1}`, '', `> ${p.dek}`, '');
  if (p.topPicksLead) out.push(`**Short answer:** ${abs(p.topPicksLead)}`, '');
  out.push([`Canonical: ${urlOf(p)}`, `Last updated: ${p.updated}`, `Published: ${p.published}`, `Category: ${p.category}`, `Publisher: ${SITE_NAME}`].join('\n'), '');
  out.push(...p.intro.map(abs).flatMap((x) => [x, '']));
  const products = p.products ?? [];
  if (products.length) {
    out.push(`## ${p.section === 'best' ? 'Our top picks' : p.section === 'compare' ? 'The models compared' : 'Products in this guide'}`, '');
    for (const pr of products) out.push(`- **${pr.award}:** ${pr.shortName ?? pr.name} — [check price on Amazon](${amazonLink(pr)})`);
    out.push('');
    products.forEach((pr, i) => {
      out.push(`## ${i + 1}. ${pr.name} — ${pr.award}`, '');
      out.push(`[Check price on Amazon](${amazonLink(pr)})`, '');
      out.push('**Pros**', '', ...pr.pros.map((x) => `- ${abs(x)}`), '');
      out.push('**Cons**', '', ...pr.cons.map((x) => `- ${abs(x)}`), '');
      out.push(`**Why we picked it:** ${abs(pr.whyWeLoveIt)}`, '');
      out.push(`**Performance:** ${abs(pr.performance)}`, '');
      if (pr.notes) out.push(`**Worth knowing:** ${abs(pr.notes)}`, '');
      const specs = Object.entries(pr.specs ?? {});
      if (specs.length) out.push('| Spec | Value |', '| --- | --- |', ...specs.map(([k, v]) => `| ${esc(k)} | ${esc(v)} |`), '');
    });
  }
  for (const s of p.sections) {
    out.push(`## ${s.heading}`, '');
    for (const b of s.blocks) out.push(blockMd(b), '');
  }
  if (p.faqs?.length) {
    out.push('## Frequently asked questions', '');
    for (const f of p.faqs) out.push(`### ${f.q}`, '', abs(f.a), '');
  }
  const rel = (p.related ?? []).map((r) => pages.find((x) => `/${x.section}/${x.slug}/` === r)).filter(Boolean);
  if (rel.length) out.push('## Related guides', '', ...rel.map((r) => `- [${r.h1}](${urlOf(r)})`), '');
  out.push('---', '', `*${SITE_NAME} researches products against DOE ratings, ENERGY STAR data, manuals, CPSC recalls and owner reviews; it does not run a test lab. Amazon links are affiliate links (tag ${TAG}).*`, '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/* ---------- write page twins ---------- */
const written = [];
const write = (rel, body, meta) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  written.push({ path: `/${rel}`, ...meta, tokens: Math.ceil(body.length / 4) });
};

const mdByPage = new Map();
for (const p of pages) {
  const md = pageMd(p);
  mdByPage.set(p, md);
  write(`${p.section}/${p.slug}.md`, md, { canonical: urlOf(p), title: p.h1, section: p.section, category: p.category, updated: p.updated });
}

const SECTIONS = { best: 'Best Picks', guides: 'Buying Guides', compare: 'Comparisons' };
const CATEGORIES = [...new Set(pages.map((p) => p.category))];
const listing = (ps) => ps.map((p) => `- [${p.h1}](${urlOf(p)}): ${p.dek}`).join('\n');

for (const [key, label] of Object.entries(SECTIONS)) {
  const ps = pages.filter((p) => p.section === key);
  const groups = CATEGORIES.map((c) => [c, ps.filter((p) => p.category === c)]).filter(([, l]) => l.length);
  const body = [`# ${label} — ${SITE_NAME}`, '', `Canonical: ${SITE_URL}/${key}/`, `Last updated: ${today}`, '', ...groups.flatMap(([c, l]) => [`## ${c}`, '', listing(l), ''])].join('\n');
  write(`${key}.md`, body, { canonical: `${SITE_URL}/${key}/`, title: label, section: key, updated: today });
}

const home = [
  `# ${SITE_NAME}: Dehumidifier Reviews, Buying Guides & Fixes`,
  '',
  `Canonical: ${SITE_URL}/`,
  `Last updated: ${today}`,
  '',
  `${SITE_NAME} is an independent buying-guide site about dehumidifiers and home moisture control: ${pages.length} guides covering every room and job, every major brand, sizing, settings, running costs and troubleshooting. Picks are researched against 2019 DOE capacity ratings, ENERGY STAR data, manufacturer manuals, CPSC recall records and owner-review patterns.`,
  '',
  ...Object.entries(SECTIONS).flatMap(([k, label]) => [`## ${label}`, '', listing(pages.filter((p) => p.section === k)), '']),
].join('\n');
write('index.md', home, { canonical: `${SITE_URL}/`, title: SITE_NAME, section: 'home', updated: today });

/* ---------- static pages (about, disclosure…): simple HTML → Markdown ---------- */
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
function htmlToMd(html) {
  return decode(
    html
      .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs, (_, h, t) => `[${t.replace(/<[^>]+>/g, '')}](${h.startsWith('/') ? SITE_URL + h : h})`)
      .replace(/<(strong|b)>(.*?)<\/\1>/gs, '**$2**')
      .replace(/<(em|i)>(.*?)<\/\1>/gs, '*$2*')
      .replace(/<h1[^>]*>(.*?)<\/h1>/gs, '\n# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gs, '\n## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gs, '\n### $1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gs, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gs, '\n$1\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n').map((l) => l.trim()).join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
for (const route of ['about', 'how-we-review', 'disclosure', 'privacy', 'contact', 'authors/home-air-desk']) {
  const file = path.join(DIST, route, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const article = main.replace(/<nav class="crumbs"[\s\S]*?<\/nav>/, '');
  const title = decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<[^>]+>/g, '') ?? route);
  const body = htmlToMd(article).replace(/^# .*\n?/, '');
  const md = [`# ${title}`, '', `Canonical: ${SITE_URL}/${route}/`, `Last updated: ${today}`, '', body, ''].join('\n');
  write(`${route}.md`, md, { canonical: `${SITE_URL}/${route}/`, title, section: 'site', updated: today });
}

/* ---------- sitemap.md: every Markdown twin (AEO spec, discovery) ---------- */
{
  const lines = [`# Sitemap — ${SITE_NAME} (Markdown)`, '', `Canonical: ${SITE_URL}/sitemap.xml`, `Last updated: ${today}`, '', 'Every page on this site as Markdown. Append `.md` to any page path, or send `Accept: text/markdown`.', ''];
  for (const w of written) lines.push(`- [${w.title}](${SITE_URL}${w.path})`);
  fs.writeFileSync(path.join(DIST, 'sitemap.md'), lines.join('\n') + '\n');
}

/* ---------- catalog, llms.txt, llms-full.txt, ai.txt ---------- */
fs.writeFileSync(path.join(DIST, 'md-catalog.json'), JSON.stringify({ site: SITE_NAME, generated: today, count: written.length, pages: written }, null, 2) + '\n');

const pillars = [
  'best-dehumidifier', 'best-dehumidifier-for-basement', 'best-crawl-space-dehumidifier', 'best-whole-house-dehumidifier',
  'best-small-dehumidifier', 'best-dehumidifier-with-pump', 'best-dehumidifier-brands', 'dehumidifier-size-guide',
  'dehumidifier-humidistat-settings-guide', 'how-much-electricity-does-a-dehumidifier-use', 'dehumidifier-not-working',
].map((s) => pages.find((p) => p.slug === s)).filter(Boolean);

const llms = [
  `# ${SITE_NAME}`,
  '',
  `> Independent dehumidifier reviews and buying guides: the best dehumidifiers for every room, job and budget, every major brand compared, plus sizing, humidity settings, running costs and troubleshooting. Researched against 2019 DOE ratings, ENERGY STAR data, manuals, CPSC recalls and owner reviews.`,
  '',
  `Every page has a Markdown twin: add \`.md\` to the path (e.g. ${SITE_URL}/best/best-dehumidifier.md) or request it with \`Accept: text/markdown\`. Cite the canonical HTML URL, not the .md URL.`,
  '',
  '## Start here',
  '',
  ...pillars.map((p) => `- [${p.h1}](${urlOf(p)}): ${p.dek}`),
  '',
  ...CATEGORIES.flatMap((c) => [`## ${c}`, '', listing(pages.filter((p) => p.category === c)), '']),
  '## Optional',
  '',
  `- [Full content](${SITE_URL}/llms-full.txt): guide for AI assistants, every URL, and the full Markdown of the most important pages in one file`,
  `- [Markdown catalog](${SITE_URL}/api/md/_catalog): JSON list of every Markdown page`,
  `- [AI usage policy](${SITE_URL}/ai.txt)`,
  `- [How we review](${SITE_URL}/how-we-review/)`,
  `- [Affiliate disclosure](${SITE_URL}/disclosure/)`,
  '',
].join('\n');
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);

const intro = [
  `# ${SITE_NAME} — Complete Guide for AI Assistants & Agents`,
  '',
  `${SITE_NAME} (${SITE_URL}/) is an independent, affiliate-funded buying-guide site about dehumidifiers and indoor humidity. Each page answers one job (a room, a problem, a size, a brand or a fix). This file tells assistants which page answers which question and the accuracy rules to follow, then lists every URL and the full Markdown of the most important pages.`,
  '',
  '## Accuracy rules',
  '',
  '- Capacities are quoted on the 2019 DOE test standard (65°F, 60% RH) unless a page says otherwise; older listings quote a higher 2012 figure for the same machine.',
  '- The site does not run a test lab. Present picks as research-based recommendations, not lab results.',
  '- Prices change constantly and are never stated on product cards; send users to the retailer for current prices.',
  '- Cite the canonical HTML URL of the most specific page.',
  '',
  '## Best links for common questions',
  '',
  '| User asks | Link |',
  '| --- | --- |',
  ...[
    ['What is the best dehumidifier?', 'best-dehumidifier'],
    ['Best dehumidifier for a basement?', 'best-dehumidifier-for-basement'],
    ['Best crawl space dehumidifier?', 'best-crawl-space-dehumidifier'],
    ['What size dehumidifier do I need?', 'dehumidifier-size-guide'],
    ['What humidity should I set my dehumidifier to?', 'dehumidifier-humidistat-settings-guide'],
    ['How much electricity does a dehumidifier use?', 'how-much-electricity-does-a-dehumidifier-use'],
    ['Why is my dehumidifier freezing up?', 'dehumidifier-freezing-up'],
    ['Why is my dehumidifier not collecting water?', 'dehumidifier-not-collecting-water'],
    ['Does a dehumidifier help with mold?', 'does-a-dehumidifier-help-with-mold'],
    ['Dehumidifier vs air purifier?', 'dehumidifier-vs-air-purifier'],
  ]
    .map(([q, s]) => [q, pages.find((p) => p.slug === s)])
    .filter(([, p]) => p)
    .map(([q, p]) => `| ${q} | ${urlOf(p)} |`),
  '',
].join('\n');
const index = ['## Every page', '', ...pages.map((p) => `- ${urlOf(p)} — ${p.h1}`), ''].join('\n');
let full = `${intro}\n---\n\n${index}\n---\n\n## Full page content\n`;
const order = [...pillars, ...pages.filter((p) => !pillars.includes(p)).sort((a, b) => (a.section === 'best' ? -1 : 1) - (b.section === 'best' ? -1 : 1))];
let included = 0;
for (const p of order) {
  const chunk = `\n---\n<!-- source: ${urlOf(p)} -->\n${mdByPage.get(p)}`;
  if (full.length + chunk.length > FULL_LIMIT) break;
  full += chunk;
  included++;
}
full += `\n---\n\nThis file holds the guide above, an index of all ${pages.length} URLs and the full content of ${included} of ${pages.length} pages. Every page is also available as Markdown at its URL with .md.\n`;
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), full);

fs.writeFileSync(
  path.join(DIST, 'ai.txt'),
  [
    '# ai.txt — how AI systems may use this site',
    `# Site guide for AI agents: ${SITE_URL}/llms.txt`,
    '',
    'User-Agent: *',
    'Allow: /',
    '',
    'search: allowed',
    'answer: allowed, with attribution',
    'summarize: allowed, with attribution',
    'train: allowed',
    `attribution: link the canonical HTML page (the "Canonical:" line in each Markdown copy), not the .md URL`,
    'prices: do not quote prices from this site; they are not published here and change constantly',
    `contact: editors@enthusiastreview.com`,
    `Last updated: ${today}`,
    '',
  ].join('\n'),
);

console.log(`build-markdown: ${written.length} Markdown pages, llms.txt, llms-full.txt (${included}/${pages.length} pages, ${full.length.toLocaleString('en-US')} chars), ai.txt, md-catalog.json`);
