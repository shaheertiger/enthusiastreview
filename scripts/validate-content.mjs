// Validates every page in src/content/pages/ before a build.
//   node scripts/validate-content.mjs            → all pages
//   node scripts/validate-content.mjs a.json b…  → just those files (by name or path)
// Fails (exit 1) on errors; prints warnings without failing.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'src/content/pages');
const CATALOG = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/catalog.json'), 'utf8'));
const SITE_TS = fs.readFileSync(path.join(ROOT, 'src/data/site.ts'), 'utf8');
const CATEGORIES = [...SITE_TS.matchAll(/^\s+'([^']+)',$/gm)].map((m) => m[1]);
const SECTIONS = ['best', 'guides', 'compare'];
const STATIC = ['/', '/best/', '/guides/', '/compare/', '/about/', '/how-we-review/', '/contact/', '/disclosure/', '/privacy/', '/authors/home-air-desk/'];
const BLOCK_TYPES = ['p', 'h3', 'ul', 'ol', 'checklist', 'table', 'callout', 'stats'];
// We research; we do not run a test lab. Copy must not claim hands-on testing.
const FAKE_TESTING = /\b(we tested|we've tested|we have tested|our testers?|in our (lab|tests|testing)|our lab|hands-on test|we measured|tested by us|our testing showed)\b/i;

const all = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const pages = all.map((f) => ({ f, d: JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) }));
const validPaths = new Set([...STATIC, ...pages.map(({ d }) => `/${d.section}/${d.slug}/`)]);
// While pages are being written in parallel, PLANNED=<file> (one path per line) whitelists pages that will exist.
if (process.env.PLANNED) for (const l of fs.readFileSync(process.env.PLANNED, 'utf8').split('\n')) if (l.trim()) validPaths.add(l.trim());
const only = process.argv.slice(2).map((a) => path.basename(a));
const targets = only.length ? pages.filter((p) => only.includes(p.f)) : pages;

let errors = 0;
let warnings = 0;
const textOf = (d) => {
  const out = [...(d.intro ?? []), d.topPicksLead ?? '', d.dek ?? ''];
  for (const p of d.products ?? []) out.push(...(p.pros ?? []), ...(p.cons ?? []), p.whyWeLoveIt ?? '', p.performance ?? '', p.notes ?? '');
  for (const s of d.sections ?? [])
    for (const b of s.blocks ?? []) {
      if (b.text) out.push(b.text);
      if (b.title) out.push(b.title);
      if (b.items) for (const i of b.items) out.push(typeof i === 'string' ? i : [i.label, i.text, i.value, ...(i.sub ?? [])].join(' '));
      if (b.rows) for (const r of b.rows) out.push(r.join(' '));
    }
  for (const f of d.faqs ?? []) out.push(f.q, f.a);
  return out.join(' ');
};

for (const { f, d } of targets) {
  const err = (m) => { errors++; console.log(`✖ ${f}: ${m}`); };
  const warn = (m) => { warnings++; console.log(`△ ${f}: ${m}`); };
  for (const k of ['slug', 'section', 'category', 'title', 'h1', 'dek', 'description', 'published', 'updated'])
    if (typeof d[k] !== 'string' || !d[k].trim()) err(`missing "${k}"`);
  if (`${d.slug}.json` !== f) err(`slug "${d.slug}" must match file name`);
  if (!SECTIONS.includes(d.section)) err(`section must be one of ${SECTIONS}`);
  if (!CATEGORIES.includes(d.category)) err(`category "${d.category}" not in ${CATEGORIES.join(' | ')}`);
  if (d.title && d.title.length > 70) warn(`title is ${d.title.length} chars (aim ≤ 65)`);
  if (d.description && (d.description.length < 110 || d.description.length > 165)) warn(`description is ${d.description.length} chars (aim 120–160)`);
  for (const k of ['published', 'updated']) if (d[k] && !/^\d{4}-\d{2}-\d{2}$/.test(d[k])) err(`${k} must be YYYY-MM-DD`);
  if (!Array.isArray(d.intro) || !d.intro.length) err('intro must be a non-empty array of paragraphs');
  if (!Array.isArray(d.products)) err('products must be an array (may be empty)');
  if (!Array.isArray(d.sections) || d.sections.length < 3) err('need at least 3 sections');
  if (!Array.isArray(d.faqs) || d.faqs.length < 3) err('need at least 3 faqs');
  if (d.section === 'best' && (d.products?.length ?? 0) < 3) err('best-of pages need at least 3 products');

  const ids = new Set();
  for (const [i, p] of (d.products ?? []).entries()) {
    const at = `products[${i}]`;
    for (const k of ['id', 'name', 'award', 'whyWeLoveIt', 'performance']) if (typeof p[k] !== 'string' || !p[k].trim()) err(`${at} missing "${k}"`);
    if (p.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) err(`${at}.id "${p.id}" must be kebab-case`);
    if (ids.has(p.id)) err(`${at}.id "${p.id}" duplicated`);
    ids.add(p.id);
    if (!Array.isArray(p.pros) || p.pros.length < 2) err(`${at} needs ≥ 2 pros`);
    if (!Array.isArray(p.cons) || p.cons.length < 1) err(`${at} needs ≥ 1 con`);
    if (!p.specs || typeof p.specs !== 'object' || Object.keys(p.specs).length < 3) err(`${at} needs ≥ 3 specs`);
    if (p.catalogId && !CATALOG[p.catalogId]) err(`${at}.catalogId "${p.catalogId}" not in catalog.json`);
    // "amazonOnly" pages may only feature products with a verified Amazon listing (ASIN + photo).
    if (d.amazonOnly) {
      const c = CATALOG[p.catalogId];
      if (!c || !c.asin || !c.image || c.skip) err(`${at} "${p.name}" is not a verified Amazon product (amazonOnly page needs a catalogId with ASIN + image)`);
    }
    if (p.asin && !/^[A-Z0-9]{10}$/.test(p.asin)) err(`${at}.asin "${p.asin}" is not a valid ASIN`);
  }
  const secIds = new Set();
  for (const [i, s] of (d.sections ?? []).entries()) {
    if (!s.id || !/^[a-z0-9-]+$/.test(s.id)) err(`sections[${i}] needs a kebab-case id`);
    if (secIds.has(s.id) || ids.has(s.id)) err(`sections[${i}].id "${s.id}" duplicated`);
    secIds.add(s.id);
    if (!s.heading) err(`sections[${i}] missing heading`);
    for (const [j, b] of (s.blocks ?? []).entries()) {
      if (!BLOCK_TYPES.includes(b.type)) err(`sections[${i}].blocks[${j}] unknown type "${b.type}"`);
      if (b.type === 'table' && (!Array.isArray(b.head) || !b.rows?.every((r) => r.length === b.head.length)))
        err(`sections[${i}].blocks[${j}] table rows must match head length`);
    }
  }
  const text = textOf(d);
  const words = text.split(/\s+/).filter(Boolean).length;
  const min = d.section === 'best' ? 1300 : 1000;
  if (words < min) err(`only ${words} words (need ≥ ${min})`);
  const fake = text.match(FAKE_TESTING);
  if (fake) err(`claims hands-on testing ("${fake[0]}") — we research, we don't lab-test`);
  for (const m of text.matchAll(/\]\((\/[^)]*)\)/g)) {
    const href = m[1].split('#')[0];
    if (!validPaths.has(href)) err(`internal link to missing page ${m[1]}`);
  }
  for (const r of d.related ?? []) if (!validPaths.has(r)) err(`related link to missing page ${r}`);
  if (/dehumidifierverdict/i.test(JSON.stringify(d))) err('mentions dehumidifierverdict');
}

// Affiliate coverage: every product always gets a tagged link; this shows how many are
// direct /dp/ASIN links (with a real photo) vs. tagged Amazon searches.
let direct = 0, search = 0, photo = 0;
for (const { d } of targets)
  for (const p of d.products ?? []) {
    const pick = (k) => (CATALOG[k] && !CATALOG[k].skip ? CATALOG[k] : undefined);
    const c = pick(p.catalogId) ?? pick(p.id);
    if (p.url || p.asin || c?.asin) direct++; else search++;
    if (p.image || c?.image) photo++;
  }
console.log(`\nAffiliate links: ${direct + search} product cards — ${direct} direct /dp/ links, ${search} tagged searches; ${photo} with a product photo.`);
console.log(`${targets.length} page(s) checked — ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
