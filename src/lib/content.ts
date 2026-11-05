import type { Category, SectionKey } from '../data/site';
import { CATEGORIES } from '../data/site';
import { productImage } from '../data/affiliate';

/* ------------------------------------------------------------------ */
/* Content model. One JSON file per page in src/content/pages/.        */
/* Text fields accept inline **bold**, *italic* and [links](/path/).   */
/* ------------------------------------------------------------------ */

export interface Product {
  /** Stable kebab-case id, unique on the page. Used as the #anchor. */
  id: string;
  /** Key in src/data/catalog.json when we hold a verified ASIN + image for it. */
  catalogId?: string;
  /** Explicit Amazon ASIN (overrides the catalog). */
  asin?: string;
  /** Explicit outbound URL (overrides everything). */
  url?: string;
  /** Explicit image URL (overrides the catalog). */
  image?: string;
  name: string;
  shortName?: string;
  /** e.g. "Best overall", "Best value". Shown in "Our top picks". */
  award: string;
  pros: string[];
  cons: string[];
  whyWeLoveIt: string;
  performance: string;
  notes?: string;
  /** "Features at a glance" table. Only facts we can source. */
  specs: Record<string, string>;
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'checklist'; items: { label: string; text: string; sub?: string[] }[] }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'stats'; items: { value: string; label: string }[] };

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface Page {
  slug: string;
  section: SectionKey;
  category: Category;
  /** <title>, max ~65 characters. */
  title: string;
  h1: string;
  dek: string;
  description: string;
  published: string;
  updated: string;
  author?: string;
  /** Short label for cards and menus, e.g. "Basements". */
  navLabel?: string;
  intro: string[];
  /** One sentence introducing the #1 pick, shown under "Our top picks". */
  topPicksLead?: string;
  products: Product[];
  sections: Section[];
  faqs: { q: string; a: string }[];
  related?: string[];
}

const modules = import.meta.glob<{ default: Page }>('../content/pages/*.json', { eager: true });

export const PAGES: Page[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.h1.localeCompare(b.h1));

export const pathOf = (p: Pick<Page, 'section' | 'slug'>) => `/${p.section}/${p.slug}/`;

const BY_PATH = new Map(PAGES.map((p) => [pathOf(p), p]));
export const pageByPath = (path: string) => BY_PATH.get(path.endsWith('/') ? path : `${path}/`);

export const pagesIn = (section: SectionKey) => PAGES.filter((p) => p.section === section);

export function byCategory(pages: Page[] = PAGES) {
  return CATEGORIES.map((c) => ({ category: c, pages: pages.filter((p) => p.category === c) })).filter((g) => g.pages.length);
}

/** First product image on a page, used for cards. */
export const cardImage = (p: Page) => {
  for (const prod of p.products) {
    const img = productImage(prod);
    if (img) return img;
  }
  return undefined;
};

/** Up to `n` related pages: hand-picked first, then same category, then same section. */
export function relatedPages(page: Page, n = 8): Page[] {
  const self = pathOf(page);
  const out: Page[] = [];
  const add = (p?: Page) => {
    if (p && pathOf(p) !== self && !out.includes(p)) out.push(p);
  };
  (page.related ?? []).forEach((r) => add(pageByPath(r)));
  // Deterministic spread so every page gets different neighbours.
  const seed = [...page.slug].reduce((s, c) => s + c.charCodeAt(0), 0);
  const rotate = (arr: Page[]) => arr.map((_, i) => arr[(i + seed) % arr.length]);
  rotate(PAGES.filter((p) => p.category === page.category)).forEach(add);
  rotate(PAGES.filter((p) => p.section === page.section)).forEach(add);
  rotate(PAGES).forEach(add);
  return out.slice(0, n);
}

/* ------------------------------------------------------------------ */
/* Inline markdown → HTML (escape first, then apply a tiny subset).     */
/* ------------------------------------------------------------------ */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * `links` maps product names (as they appear in **bold**) to outbound affiliate URLs,
 * so bolded product mentions in body copy become sponsored links automatically.
 */
export function md(s: string, links?: Map<string, string>): string {
  let out = esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
      const ext = /^https?:/.test(href);
      return `<a href="${href}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  if (links?.size) {
    // Only bold text that is not already inside a link.
    out = out.replace(/(<a [^>]*>.*?<\/a>)|<strong>([^<]+)<\/strong>/g, (m, a, name) => {
      if (a) return a;
      const href = links.get(name.trim().toLowerCase());
      return href ? `<a href="${href}" rel="sponsored nofollow noopener" target="_blank"><strong>${name}</strong></a>` : m;
    });
  }
  return out;
}

/** name/shortName (lower-cased) → affiliate URL for every product on a page. */
export function productLinkMap(products: Product[], linkFor: (p: Product) => string) {
  const m = new Map<string, string>();
  for (const p of products) {
    const href = linkFor(p);
    for (const n of [p.name, p.shortName]) if (n) m.set(n.trim().toLowerCase(), href);
  }
  return m;
}

/** Plain text (for meta tags and JSON-LD). */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1');

export const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/* ------------------------------------------------------------------ */
/* Interlinking                                                        */
/* ------------------------------------------------------------------ */

/** Brand name as written in copy → brand page slug suffix (best-<x>-dehumidifier). */
const BRAND_TERMS: [RegExp, string][] = [
  [/\bMidea\b/, 'midea'], [/\bFrigidaire\b/, 'frigidaire'], [/\bhOmeLabs\b/i, 'homelabs'], [/\bAlorAir\b/i, 'alorair'],
  [/\bAprilaire\b/i, 'aprilaire'], [/\bSanta Fe\b/, 'santa-fe'], [/\bHoneywell\b/, 'honeywell'], [/\bGE\b(?! Appliances Park)/, 'ge'],
  [/\bLG\b/, 'lg'], [/\bHisense\b/, 'hisense'], [/\bToshiba\b/, 'toshiba'], [/\bDanby\b/, 'danby'], [/\bPelonis\b/, 'pelonis'],
  [/\bWaykar\b/, 'waykar'], [/\bIvation\b/, 'ivation'], [/\bEva-?Dry\b/i, 'eva-dry'], [/\bPro Breeze\b/, 'pro-breeze'],
  [/\bDri-Eaz\b/i, 'dri-eaz'], [/\bEbac\b/, 'ebac'], [/\bTCL\b/, 'tcl'], [/\bHaier\b/, 'haier'], [/\bKenmore\b/, 'kenmore'],
  [/\bKeystone\b/, 'keystone'], [/\bBlack\s?(?:\+|&amp;|and)\s?Decker\b/i, 'black-decker'], [/\bDe'?Longhi\b/i, 'delonghi'],
  [/\bAmana\b/, 'amana'], [/\bFriedrich\b/, 'friedrich'], [/\bCostway\b/, 'costway'], [/\bVremi\b/, 'vremi'], [/\bYaufey\b/i, 'yaufey'],
  [/\bShinco\b/, 'shinco'], [/\bTOSOT\b/i, 'tosot'], [/\bKesnos\b/i, 'kesnos'], [/\bPerfect Aire\b/i, 'perfect-aire'],
  [/\bWhynter\b/, 'whynter'], [/\bAEOCKY\b/i, 'aeocky'],
];

/** Topic phrases (first mention) → page. Order matters: more specific first. */
const TOPIC_TERMS: [RegExp, string][] = [
  [/\bcrawl ?spaces?\b/i, '/best/best-crawl-space-dehumidifier/'],
  [/\bfinished basements?\b/i, '/best/best-dehumidifier-for-finished-basement/'],
  [/\bbasements?\b/i, '/best/best-dehumidifier-for-basement/'],
  [/\bwhole-(?:house|home) (?:dehumidifiers?|systems?|units?)\b/i, '/best/best-whole-house-dehumidifier/'],
  [/\bdesiccant\b/i, '/best/best-desiccant-dehumidifier/'],
  [/\b(?:built-in|condensate) pumps?\b/i, '/best/best-dehumidifier-with-pump/'],
  [/\b(?:drain hose|gravity drain(?:age)?)\b/i, '/best/best-dehumidifier-with-drain-hose/'],
  [/\bhumidistat\b/i, '/guides/dehumidifier-humidistat-settings-guide/'],
  [/\bhygrometers?\b/i, '/guides/when-to-use-a-dehumidifier/'],
  [/\b(?:auto-defrost|ices? (?:up|over)|freez(?:es|ing) up)\b/i, '/guides/dehumidifier-freezing-up/'],
  [/\b(?:running costs?|kilowatt-hours?|kWh)\b/, '/guides/how-much-electricity-does-a-dehumidifier-use/'],
  [/\bENERGY STAR\b/, '/best/best-energy-efficient-dehumidifier/'],
  [/\b(?:2019 DOE|DOE 2019|pints? (?:a|per) day)\b/i, '/guides/dehumidifier-size-guide/'],
  [/\bLGR\b/, '/best/best-commercial-dehumidifier/'],
  [/\bmusty\b/i, '/best/best-dehumidifier-for-musty-smell/'],
  [/\bblack mold\b/i, '/best/best-dehumidifier-for-black-mold/'],
  [/\bmold\b/i, '/guides/does-a-dehumidifier-help-with-mold/'],
  [/\bdust mites?\b/i, '/best/best-dehumidifier-for-dust-mites/'],
  [/\ballerg(?:y|ies)\b/i, '/best/best-dehumidifier-for-allergies/'],
  [/\bsilverfish\b/i, '/best/best-dehumidifier-for-silverfish/'],
  [/\bcentipedes?\b/i, '/best/best-dehumidifier-for-centipedes/'],
  [/\b(?:cock)?roaches\b/i, '/best/best-dehumidifier-for-cockroaches/'],
  [/\bwater damage\b/i, '/best/best-dehumidifier-for-water-damage/'],
  [/\bair purifiers?\b/i, '/guides/dehumidifier-vs-air-purifier/'],
  [/\bair conditioners?\b/i, '/guides/dehumidifier-vs-air-conditioner/'],
  [/\bhumidifiers?\b/, '/guides/dehumidifier-vs-humidifier/'],
  [/\bwindow condensation|condensation on (?:the )?windows\b/i, '/guides/dehumidifier-for-condensation-on-windows/'],
  [/\bgarages?\b/i, '/best/best-dehumidifier-for-garage/'],
  [/\bbedrooms?\b/i, '/best/best-dehumidifier-for-bedroom/'],
  [/\bbathrooms?\b/i, '/best/best-dehumidifier-for-bathroom/'],
  [/\blaundry rooms?\b/i, '/best/best-dehumidifier-for-laundry-room/'],
  [/\bkitchens?\b/i, '/best/best-dehumidifier-for-kitchen/'],
  [/\bclosets?\b/i, '/best/best-dehumidifier-for-closet/'],
  [/\battics?\b/i, '/best/best-dehumidifier-for-attic/'],
  [/\bsunrooms?\b/i, '/best/best-dehumidifier-for-sunroom/'],
  [/\bapartments?\b/i, '/best/best-dehumidifier-for-apartment/'],
  [/\bcondos?\b/i, '/best/best-dehumidifier-for-condo/'],
  [/\bdorm rooms?\b/i, '/best/best-dehumidifier-for-dorm-room/'],
  [/\bnurser(?:y|ies)\b/i, '/best/best-dehumidifier-for-nursery/'],
  [/\b(?:home )?offices?\b/i, '/best/best-dehumidifier-for-office/'],
  [/\bclassrooms?\b/i, '/best/best-dehumidifier-for-classroom/'],
  [/\bhome gyms?\b/i, '/best/best-dehumidifier-for-gym/'],
  [/\bpantr(?:y|ies)\b/i, '/best/best-dehumidifier-for-pantry/'],
  [/\bcellars?\b/i, '/best/best-dehumidifier-for-cellar/'],
  [/\bsheds?\b/i, '/best/best-dehumidifier-for-shed/'],
  [/\bcabins?\b/i, '/best/best-dehumidifier-for-cabin/'],
  [/\bpole barns?\b/i, '/best/best-dehumidifier-for-pole-barn/'],
  [/\bstorage units?\b/i, '/best/best-dehumidifier-for-storage-unit/'],
  [/\bshipping containers?\b/i, '/best/best-dehumidifier-for-shipping-container/'],
  [/\bwarehouses?\b/i, '/best/best-dehumidifier-for-warehouse/'],
  [/\bserver rooms?\b/i, '/best/best-dehumidifier-for-server-room/'],
  [/\bmobile homes?\b/i, '/best/best-dehumidifier-for-mobile-home/'],
  [/\bRVs?\b|\bcampers?\b|\bmotorhomes?\b/, '/best/best-rv-dehumidifier/'],
  [/\bboats?\b/i, '/best/best-dehumidifier-for-boat/'],
  [/\bcars?\b/i, '/best/best-car-dehumidifier/'],
  [/\bgun safes?\b/i, '/best/best-dehumidifier-for-gun-safe/'],
  [/\bgun cabinets?\b/i, '/best/best-dehumidifier-for-gun-cabinet/'],
  [/\bgreenhouses?\b/i, '/best/best-dehumidifier-for-greenhouse/'],
  [/\bgrow tents?\b/i, '/best/best-dehumidifier-for-grow-tent/'],
  [/\bterrariums?\b/i, '/best/best-dehumidifier-for-terrarium/'],
  [/\bhouseplants?\b/i, '/best/best-dehumidifier-for-plants/'],
  [/\bpianos?\b/i, '/best/best-dehumidifier-for-piano/'],
  [/\bguitars?\b/i, '/best/best-dehumidifier-for-guitar/'],
  [/\bhearing aids?\b/i, '/best/best-dehumidifier-for-hearing-aids/'],
  [/\bvinyl records?\b|\brecord collections?\b/i, '/best/best-dehumidifier-for-vinyl-record-collection/'],
  [/\bsneakers?\b/i, '/best/best-dehumidifier-for-sneaker-collection/'],
  [/\bcamera (?:gear|lenses|bodies|dry cabinets?)\b/i, '/best/best-camera-dry-cabinet/'],
  [/\bsaunas?\b/i, '/best/best-dehumidifier-for-sauna/'],
  [/\b(?:indoor )?pool rooms?\b|\bindoor pools?\b/i, '/best/best-dehumidifier-for-pool-room/'],
  [/\bwood floors?\b|\bhardwood\b/i, '/best/best-dehumidifier-for-wood-floors/'],
  [/\bdry(?:ing)? (?:clothes|laundry)\b/i, '/best/best-dehumidifier-for-drying-clothes/'],
  [/\bmoisture absorbers?\b|\bDampRid\b/, '/best/best-moisture-absorber/'],
  [/\brent(?:al|ing)\b/i, '/guides/dehumidifier-rental/'],
  [/\bfilters?\b/i, '/guides/dehumidifier-replacement-filter/'],
  [/\bplacement\b/i, '/guides/where-to-place-a-dehumidifier/'],
];

/** Brand page for a product name, if we have one. */
export function brandPageFor(name: string): Page | undefined {
  for (const [re, key] of BRAND_TERMS) if (re.test(name.split(/\s+/).slice(0, 3).join(' ')) && name.search(re) < 12) return pageByPath(`/best/best-${key}-dehumidifier/`);
  return undefined;
}

/**
 * Creates a per-page linker: the first mention of a brand or topic in body copy links to
 * that page, once per target, skipping the page itself and anything the page already links to.
 */
export function createAutolinker(page: Page, max = 10) {
  const self = pathOf(page);
  const json = JSON.stringify(page);
  const used = new Set<string>([self, ...[...json.matchAll(/\]\((\/[a-z]+\/[a-z0-9-]+\/)/g)].map((m) => m[1])]);
  const terms: [RegExp, string][] = [
    ...BRAND_TERMS.map(([re, key]) => [re, `/best/best-${key}-dehumidifier/`] as [RegExp, string]),
    ...TOPIC_TERMS,
  ].filter(([, href]) => pageByPath(href));
  let count = 0;
  return (html: string): string => {
    if (count >= max) return html;
    // Split into tags/links and text; only touch text outside <a> and <strong>.
    const parts = html.split(/(<a\b[^>]*>.*?<\/a>|<strong>.*?<\/strong>|<[^>]+>)/s);
    for (let i = 0; i < parts.length && count < max; i += 2) {
      for (const [re, href] of terms) {
        if (count >= max) break;
        if (used.has(href)) continue;
        const m = parts[i].match(re);
        if (!m || m.index === undefined) continue;
        const t = parts[i];
        parts[i] = `${t.slice(0, m.index)}<a href="${href}">${m[0]}</a>${t.slice(m.index + m[0].length)}`;
        used.add(href);
        count++;
        // Re-split this chunk so later terms don't match inside the new link.
        const sub = parts[i].split(/(<a\b[^>]*>.*?<\/a>)/s);
        parts.splice(i, 1, ...sub);
      }
    }
    return parts.join('');
  };
}

/** Comparison pages that mention a brand (for brand pages). */
export function comparisonsFor(page: Page): Page[] {
  const brand = page.slug.match(/^best-(.+)-dehumidifier$/)?.[1];
  if (!brand || page.category !== 'Brands') return [];
  return PAGES.filter((p) => p.section === 'compare' && p.slug.split('-vs-').some((s) => s.replace(/-dehumidifier$/, '') === brand));
}

/**
 * Three in-body "keep reading" links per page. Pages in a category are ordered, and each
 * recommends the next three (wrapping around), so every page receives exactly three
 * in-article links from its siblings — no page is left without contextual inbound links.
 */
export function keepReading(page: Page, n = 3): Page[] {
  const sibs = PAGES.filter((p) => p.category === page.category);
  const i = sibs.indexOf(page);
  if (sibs.length < 2) return [];
  const out: Page[] = [];
  for (let k = 1; out.length < Math.min(n, sibs.length - 1); k++) out.push(sibs[(i + k) % sibs.length]);
  return out;
}
