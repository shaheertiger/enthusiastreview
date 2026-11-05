// Finds the exact Amazon listing (ASIN + official product photo) for every product on
// the site through the Amazon Creators API, and writes them to src/data/catalog.json.
// A product with a catalog entry gets a direct /dp/ASIN affiliate link and a real photo;
// one without falls back to a tagged Amazon search link and a drawn placeholder.
//
//   cp .env.example .env        # fill in your Creators API credentials
//   npm run images:fetch        # fill in missing products
//   npm run images:fetch -- --verify   # also re-check every existing ASIN's title
//   npm run images:fetch -- --dry-run  # report only, write nothing
//
// Matching is deliberately strict, because a wrong match sends readers to the wrong
// product: when the name has a model number (FFAD5033W1, TP50AWKN, HD55, EDV-2400),
// the Amazon title must contain it; otherwise the brand AND the pint size must match.
// Anything else is left unmatched and listed in scripts/image-match-report.json.
import { ApiClient, TypedDefaultApi, SearchItemsRequestContent, GetItemsRequestContent } from 'amazon-creators-api';
import fs from 'node:fs';
import path from 'node:path';
import { isMatch } from './lib/match.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = path.join(ROOT, 'src/content/pages');
const CATALOG_PATH = path.join(ROOT, 'src/data/catalog.json');
const REPORT_PATH = path.join(ROOT, 'scripts/image-match-report.json');
const DRY = process.argv.includes('--dry-run');
const VERIFY = process.argv.includes('--verify');

for (const k of Object.keys(process.env).filter((k) => k.startsWith('AMAZON_CREATORS_')))
  process.env[k] = process.env[k].trim().replace(/^<(.*)>$/, '$1').trim();
for (const k of ['AMAZON_CREATORS_CLIENT_ID', 'AMAZON_CREATORS_CLIENT_SECRET', 'AMAZON_CREATORS_PARTNER_TAG'])
  if (!process.env[k]) {
    console.error(`Missing ${k}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }

const client = new ApiClient();
client.credentialId = process.env.AMAZON_CREATORS_CLIENT_ID;
client.credentialSecret = process.env.AMAZON_CREATORS_CLIENT_SECRET;
client.version = process.env.AMAZON_CREATORS_VERSION || '3.1';
client.marketplace = process.env.AMAZON_CREATORS_MARKETPLACE || 'www.amazon.com';
const api = new TypedDefaultApi(client);
const TAG = process.env.AMAZON_CREATORS_PARTNER_TAG;
const RESOURCES = ['itemInfo.title', 'images.primary.large', 'images.primary.medium'];

// ~1 request/second is the Creators API limit.
const DELAY = 1100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function retry(fn, n = 4) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const throttled = e?.type === 'ThrottleException' || e?.body?.type === 'ThrottleException';
      if (!throttled || i >= n) throw e;
      await sleep(DELAY * 2 ** i);
    }
  }
}
const detail = (e) => (typeof e?.message === 'string' ? e.message : JSON.stringify(e?.body ?? e));

/* ---------- collect products ---------- */
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
const wanted = new Map(); // key -> { name, pages[] }
for (const f of fs.readdirSync(PAGES).filter((f) => f.endsWith('.json'))) {
  const page = JSON.parse(fs.readFileSync(path.join(PAGES, f), 'utf8'));
  for (const p of page.products ?? []) {
    if (p.url || p.asin) continue; // hand-set links win
    const key = p.catalogId ?? p.id;
    const e = wanted.get(key) ?? { name: p.name, pages: [] };
    e.pages.push(page.slug);
    wanted.set(key, e);
  }
}

const report = [];
const todo = [...wanted].filter(([k]) => !catalog[k]?.asin || !catalog[k]?.image);
console.log(`${wanted.size} distinct products on the site, ${todo.length} without an ASIN + photo.`);

/* ---------- 1. verify existing ASINs (optional) ---------- */
if (VERIFY) {
  const keys = Object.keys(catalog).filter((k) => catalog[k].asin);
  for (let i = 0; i < keys.length; i += 10) {
    const batch = keys.slice(i, i + 10);
    try {
      const req = new GetItemsRequestContent();
      req.partnerTag = TAG;
      req.itemIds = [...new Set(batch.map((k) => catalog[k].asin))];
      req.resources = RESOURCES;
      const res = await retry(() => api.getItems(client.marketplace, req));
      const items = new Map((res?.itemsResult?.items ?? []).map((it) => [it.asin, it]));
      for (const k of batch) {
        const it = items.get(catalog[k].asin);
        const title = it?.itemInfo?.title?.displayValue;
        const ok = isMatch(catalog[k].name, title);
        report.push({ key: k, status: it ? (ok ? 'verified' : 'title-mismatch') : 'asin-dead', title, asin: catalog[k].asin });
        if (it && ok) {
          const img = it.images?.primary?.large?.url ?? it.images?.primary?.medium?.url;
          if (img) catalog[k].image = img;
        }
      }
    } catch (e) {
      batch.forEach((k) => report.push({ key: k, status: 'error', error: detail(e) }));
    }
    await sleep(DELAY);
  }
}

/* ---------- 2. search for missing products ---------- */
let n = 0;
for (const [key, { name, pages }] of todo) {
  n++;
  try {
    const req = new SearchItemsRequestContent();
    req.partnerTag = TAG;
    req.keywords = name.replace(/[()]/g, ' ');
    req.itemCount = 5;
    req.searchIndex = 'All';
    req.resources = RESOURCES;
    const res = await retry(() => api.searchItems(client.marketplace, req));
    const items = res?.searchResult?.items ?? [];
    const hit = items.find((it) => isMatch(name, it?.itemInfo?.title?.displayValue));
    if (hit) {
      const image = hit.images?.primary?.large?.url ?? hit.images?.primary?.medium?.url ?? '';
      catalog[key] = { name, asin: hit.asin, image };
      report.push({ key, name, status: 'matched', asin: hit.asin, title: hit.itemInfo.title.displayValue, pages });
    } else {
      report.push({ key, name, status: 'no-confident-match', topTitles: items.slice(0, 3).map((it) => it?.itemInfo?.title?.displayValue), pages });
    }
  } catch (e) {
    report.push({ key, name, status: 'error', error: detail(e), pages });
  }
  if (n % 10 === 0) console.log(`${n}/${todo.length}…`);
  await sleep(DELAY);
}

if (!DRY) fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n');
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
const count = (s) => report.filter((r) => r.status === s).length;
console.log(
  `Done${DRY ? ' (dry run — catalog not written)' : ''}. matched=${count('matched')} unmatched=${count('no-confident-match')} errors=${count('error')}` +
    (VERIFY ? ` verified=${count('verified')} mismatched=${count('title-mismatch')} dead=${count('asin-dead')}` : '') +
    `\nReview ${path.relative(ROOT, REPORT_PATH)} — for unmatched products, set "asin" on the product by hand.`,
);
