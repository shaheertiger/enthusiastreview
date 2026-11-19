/* ------------------------------------------------------------------ */
/* Content model and loaders. Schema: docs/content-schema.md.          */
/* ------------------------------------------------------------------ */
import { CATEGORIES, CATEGORY } from '../data/categories';
import { SITE } from '../data/site';

export type Spec = [string, string];
export interface FAQ { q: string; a: string }

export interface Product {
  id: string;
  name: string;
  short: string;
  brand: string;
  category: string;
  released?: string;
  price: [number, number];
  amazon?: string;
  asin?: string;
  url?: string;
  /** Official Amazon photo, from src/data/catalog.json (scripts/fetch-product-images.mjs). */
  image?: string;
  /** Title of the Amazon listing the photo and direct link come from. */
  listing?: string;
  description: string;
  quick: string;
  bestFor: string;
  skipIf: string;
  specs: Spec[];
  score: { overall: number; parts: [string, number][] };
  verdict: string[];
  pros: string[];
  cons: string[];
  extra?: { heading: string; body?: string[]; steps?: [string, string][] };
  faqs: FAQ[];
}

export interface Pick {
  id: string;
  label: string;
  bestFor?: string;
  skipIf?: string;
  writeup: string[];
  pros?: string[];
  cons?: string[];
}

export interface Section {
  h: string;
  body?: string[];
  list?: string[];
  table?: { caption?: string; head: string[]; rows: string[][] };
}

export interface Guide {
  slug: string;
  type: 'roundup' | 'brand';
  category: string;
  brand?: string;
  author?: string;
  title: string;
  h1: string;
  query?: string;
  description: string;
  dek: string;
  intro: string[];
  quickAnswer: string;
  picks: Pick[];
  tableSpecs: string[];
  ranking: { intro: string; criteria: [string, string][]; why?: string };
  mentions?: { id?: string; name?: string; text: string }[];
  sections: Section[];
  mistakes: [string, string][];
  bottomLine: string;
  faqs: FAQ[];
  sources: string[];
  related?: string[];
  about?: string[];
  published?: string;
  noindex?: boolean;
}

export interface Compare {
  a: string;
  b: string;
  title: string;
  description: string;
  quick: string;
  differ: [string, string][];
  buyA: string[];
  buyB: string[];
  faqs?: FAQ[];
}

export interface Term {
  id: string;
  term: string;
  title: string;
  short: string;
  body: string[];
  aliases?: string[];
  related?: string[];
  guides?: string[];
}

export interface Brand {
  key: string;
  name: string;
  founded?: string;
  hq?: string;
  blurb: string;
  review?: string;
}

/* ---------------------------- loading ----------------------------- */

const one = <T,>(m: Record<string, unknown>): T | undefined => Object.values(m)[0] as T | undefined;

const productFiles = import.meta.glob('../data/products/*.json', { eager: true, import: 'default' }) as Record<string, Product[]>;
const guideFiles = import.meta.glob('../data/guides/*.json', { eager: true, import: 'default' }) as Record<string, Guide>;
const compareFile = one<Compare[]>(import.meta.glob('../data/compares.json', { eager: true, import: 'default' })) ?? [];
const glossaryFile = one<Term[]>(import.meta.glob('../data/glossary.json', { eager: true, import: 'default' })) ?? [];
const brandFile = one<Record<string, Omit<Brand, 'key'>>>(import.meta.glob('../data/brands.json', { eager: true, import: 'default' })) ?? {};
/** Verified Amazon listings: { id: { asin, image, title, checked } } (scripts/fetch-product-images.mjs). */
const catalogFile = one<Record<string, { asin: string; image: string; title: string; checked?: string }>>(import.meta.glob('../data/catalog.json', { eager: true, import: 'default' })) ?? {};
/** Last real content change per file, from git (scripts/page-dates.mjs). */
const gitDates = one<Record<string, string>>(import.meta.glob('../data/git-dates.json', { eager: true, import: 'default' })) ?? {};

const catOrder = (k: string) => CATEGORIES.findIndex((c) => c.key === k);

export const PRODUCTS: Product[] = Object.values(productFiles)
  .flat()
  .map((p) => {
    const c = catalogFile[p.id];
    // A hand-set asin or url on the product wins; the catalog fills the photo and direct link.
    return c && !p.url && (!p.asin || p.asin === c.asin) ? { ...p, asin: c.asin, image: p.image ?? c.image, listing: c.title } : p;
  })
  .sort((a, b) => catOrder(a.category) - catOrder(b.category) || b.score.overall - a.score.overall || a.name.localeCompare(b.name));
const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export const ALL_GUIDES: Guide[] = Object.values(guideFiles).sort((a, b) => catOrder(a.category) - catOrder(b.category) || a.slug.localeCompare(b.slug));
export const GUIDES = ALL_GUIDES.filter((g) => !g.noindex);
const GUIDE_BY_SLUG = new Map(ALL_GUIDES.map((g) => [g.slug, g]));

export const COMPARES: Compare[] = compareFile.filter((c) => PRODUCT_BY_ID.has(c.a) && PRODUCT_BY_ID.has(c.b));
export const TERMS: Term[] = [...glossaryFile].sort((a, b) => a.term.localeCompare(b.term));
const TERM_BY_ID = new Map(TERMS.map((t) => [t.id, t]));

export const BRANDS: Brand[] = Object.entries(brandFile)
  .map(([key, b]) => ({ key, ...b }))
  .filter((b) => PRODUCTS.some((p) => p.brand === b.key));
const BRAND_BY_KEY = new Map(BRANDS.map((b) => [b.key, b]));

/* ---------------------------- lookups ----------------------------- */

export const getProduct = (id: string) => PRODUCT_BY_ID.get(id);
export const mustProduct = (id: string) => {
  const p = PRODUCT_BY_ID.get(id);
  if (!p) throw new Error(`Unknown product id "${id}"`);
  return p;
};
export const getGuide = (slug: string) => GUIDE_BY_SLUG.get(slug);
export const getTerm = (id: string) => TERM_BY_ID.get(id);
export const getBrand = (key: string) => BRAND_BY_KEY.get(key) ?? { key, name: key, blurb: '' };
export const categoryOf = (key: string) => CATEGORY[key];

export const productPath = (p: Product | string) => `/gear/${typeof p === 'string' ? p : p.id}/`;
export const guidePath = (g: Guide | string) => `/${typeof g === 'string' ? g : g.slug}/`;
export const comparePath = (c: Compare) => `/compare/${c.a}-vs-${c.b}/`;
export const termPath = (t: Term | string) => `/glossary/${typeof t === 'string' ? t : t.id}/`;
export const brandPath = (b: Brand | string) => `/brands/${typeof b === 'string' ? b : b.key}/`;

export const productsIn = (cat: string) => PRODUCTS.filter((p) => p.category === cat);
export const productsOfBrand = (brand: string) => PRODUCTS.filter((p) => p.brand === brand).sort((a, b) => b.score.overall - a.score.overall);

/** "#3 of 10 graphics cards" */
export function rankOf(p: Product) {
  const list = productsIn(p.category);
  return { rank: list.findIndex((x) => x.id === p.id) + 1, of: list.length };
}

/** Guides that pick this product, with the label they give it. */
export function guidesFeaturing(id: string) {
  return GUIDES.flatMap((g) => g.picks.filter((pk) => pk.id === id).map((pk) => ({ guide: g, label: pk.label })));
}
export const comparesFor = (id: string) => COMPARES.filter((c) => c.a === id || c.b === id);

/* ----------------------------- dates ------------------------------ */

const LAUNCH = '2026-11-19';
const gitDate = (key: string) => gitDates[key];
export const guideUpdated = (g: Guide) => gitDate(`guides/${g.slug}`) ?? LAUNCH;
export const guidePublished = (g: Guide) => g.published ?? LAUNCH;
export const productUpdated = (p: Product) => gitDate(`products/${p.category}`) ?? LAUNCH;
export const compareUpdated = () => gitDate('compares') ?? LAUNCH;
export const glossaryUpdated = () => gitDate('glossary') ?? LAUNCH;
export const latestDate = () =>
  [SITE.updated, ...GUIDES.map(guideUpdated), ...PRODUCTS.map(productUpdated), compareUpdated(), glossaryUpdated()].reduce((m, d) => (d > m ? d : m), '');

export const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/* ---------------------------- helpers ----------------------------- */

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
export const priceBand = (p: Product) => (p.price[0] === p.price[1] ? usd(p.price[0]) : `${usd(p.price[0])}–${usd(p.price[1])}`);
export const spec = (p: Product, label: string) => p.specs.find(([k]) => k.toLowerCase() === label.toLowerCase())?.[1];
export const avgScore = (list: Product[]) => (list.length ? Math.round(list.reduce((s, p) => s + p.score.overall, 0) / list.length) : 0);

/** Search wording the guide targets (lowercase), used for the Short Answer heading. */
export const guideQuery = (g: Guide) => g.query ?? g.h1.toLowerCase();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const shortAnswerHeading = (query: string) => `${cap(query).replace(/\b(cpu|gpu|psu|ssd|ram|am5|am4|aio|ddr5|ddr4|rtx|rx)\b/gi, (m) => m.toUpperCase())}: The Short Answer`;

/** Product <title>: the model name first, 50–62 characters where possible. */
export function productTitle(p: Product) {
  const cat = CATEGORY[p.category];
  const noun = cat.singular === cat.singular.toLowerCase() ? cat.singular.replace(/\b\w/g, (c) => c.toUpperCase()) : cat.singular;
  const named = new RegExp(`\\b(${noun.split(' ').pop()}|SSD|GPU|CPU|RAM|DDR[45]|Graphics|Processor|Cooler|Case|Motherboard)\\b`, 'i').test(p.name) ? p.name : `${p.name} ${noun}`;
  const options = [
    `${p.name} Review: Specs, Score & Verdict`,
    `${named} Review: Specs, Score & Verdict`,
    `${named} Review: Specs, ${SITE.score} & Verdict`,
    `${p.name} Review: Specs & ${SITE.score}`,
    `${p.name} Review and Specs`,
    `${p.short} Review: Specs, Score & Verdict`,
    `${p.short} Review: Specs & Score`,
  ];
  return options.find((t) => t.length >= 50 && t.length <= 62) ?? options.find((t) => t.length <= 62) ?? options[options.length - 1];
}

/** "4 min read" for a list of strings. */
export const readMinutes = (texts: string[]) => Math.max(1, Math.round(texts.join(' ').split(/\s+/).length / 230));

export function guideText(g: Guide): string[] {
  return [
    g.dek, ...g.intro, g.quickAnswer, ...(g.about ?? []), g.ranking.intro, ...g.ranking.criteria.flat(),
    ...g.picks.flatMap((p) => p.writeup), ...(g.mentions ?? []).map((m) => m.text),
    ...g.sections.flatMap((s) => [s.h, ...(s.body ?? []), ...(s.list ?? [])]),
    ...g.mistakes.flat(), g.bottomLine, ...g.faqs.flatMap((f) => [f.q, f.a]),
  ];
}

/* ------------------------------------------------------------------ */
/* Inline text: [links](/path/) and **bold**, plus automatic links to  */
/* the first mention of each product and glossary term on a page.      */
/* ------------------------------------------------------------------ */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface AutoTerm { phrase: string; href: string; ci: boolean }
let AUTO: { terms: AutoTerm[]; re: RegExp } | undefined;
function autoTerms() {
  if (AUTO) return AUTO;
  const terms: AutoTerm[] = [];
  for (const p of PRODUCTS) {
    terms.push({ phrase: p.name, href: productPath(p), ci: false });
    if (p.short !== p.name && p.short.length >= 6) terms.push({ phrase: p.short, href: productPath(p), ci: false });
  }
  for (const t of TERMS) {
    for (const a of [t.term, ...(t.aliases ?? [])]) if (a.length >= 3) terms.push({ phrase: a, href: termPath(t), ci: true });
  }
  // Longest first so "RTX 5070 Ti" wins over "RTX 5070" at the same position.
  terms.sort((a, b) => b.phrase.length - a.phrase.length);
  const seen = new Set<string>();
  const uniq = terms.filter((t) => (seen.has(t.phrase.toLowerCase()) ? false : (seen.add(t.phrase.toLowerCase()), true)));
  const alt = uniq.map((t) => t.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')).join('|');
  AUTO = { terms: uniq, re: new RegExp(`(?<![\\w/-])(${alt})(?![\\w-])`, 'gi') };
  return AUTO;
}

export interface LinkCtx {
  /** hrefs already linked on this page (each target is linked once). */
  linked: Set<string>;
  /** The page's own path: never linked to itself. */
  self: string;
  max: number;
}
export const newCtx = (self: string, max = 30): LinkCtx => ({ linked: new Set([self]), self, max });

function autolink(text: string, ctx?: LinkCtx): string {
  if (!ctx || !TERMS.length && !PRODUCTS.length) return esc(text);
  const { terms, re } = autoTerms();
  let out = '';
  let last = 0;
  re.lastIndex = 0;
  for (let m; (m = re.exec(text)); ) {
    const hit = m[1];
    const t = terms.find((x) => (x.ci ? x.phrase.toLowerCase() === hit.toLowerCase().replace(/\s+/g, ' ') : x.phrase === hit.replace(/\s+/g, ' ')));
    if (!t || ctx.linked.has(t.href) || ctx.linked.size > ctx.max) continue;
    ctx.linked.add(t.href);
    out += esc(text.slice(last, m.index)) + `<a href="${t.href}">${esc(hit)}</a>`;
    last = m.index + hit.length;
  }
  return out + esc(text.slice(last));
}

/** Render one text field to inline HTML. Pass a LinkCtx to auto-link first mentions. */
export function inline(text: string, ctx?: LinkCtx): string {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g);
  return parts
    .map((part) => {
      const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (m) {
        const external = /^https?:/.test(m[2]);
        if (!external) ctx?.linked.add(m[2]);
        return `<a href="${esc(m[2])}"${external ? ' rel="nofollow noopener" target="_blank"' : ''}>${esc(m[1])}</a>`;
      }
      return autolink(part, ctx);
    })
    .join('')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Plain text (links unwrapped), for meta tags and JSON-LD. */
export const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
