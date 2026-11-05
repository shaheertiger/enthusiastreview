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
