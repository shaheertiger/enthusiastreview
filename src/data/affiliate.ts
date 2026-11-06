import CATALOG from './catalog.json';

// Amazon Associates tracking ID. Public by design: it identifies the account a
// click is credited to and appears in every outbound product link.
export const AMAZON_TAG = 'sktiger-20';

export interface CatalogEntry {
  name: string;
  asin: string;
  image: string;
  note?: string;
  skip?: boolean;
}
const CAT = CATALOG as Record<string, CatalogEntry>;

// Entries marked `skip` are known mismatches: never use their link or photo.
export const catalogEntry = (id?: string): CatalogEntry | undefined => (id && CAT[id] && !CAT[id].skip ? CAT[id] : undefined);

/**
 * Outbound Amazon link for a product, best option first:
 *   1. An explicit URL set on the product (a SiteStripe link, say) — tag added if missing.
 *   2. A direct /dp/ASIN link when the product (or its catalogId) is in src/data/catalog.json.
 *   3. A tagged Amazon search for the product name.
 * Every branch carries the tag, so the click is credited either way.
 */
export function amazonLink(p: { name: string; id?: string; catalogId?: string; asin?: string; url?: string }): string {
  if (p.url && p.url.startsWith('http')) {
    return p.url.includes('tag=') ? p.url : `${p.url}${p.url.includes('?') ? '&' : '?'}tag=${AMAZON_TAG}`;
  }
  const asin = p.asin || catalogEntry(p.catalogId)?.asin || catalogEntry(p.id)?.asin;
  if (asin) return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}&linkCode=ll1`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery(p.name))}&tag=${AMAZON_TAG}`;
}

/**
 * Sharpest Amazon search for a product without a known ASIN: brand + model number when
 * the name carries one ("Frigidaire 50-Pint … (FHDD5034W1)" → "Frigidaire FHDD5034W1"),
 * otherwise the name without parentheses.
 */
export function searchQuery(name: string): string {
  const model = name.match(/\(([A-Z0-9][A-Z0-9-]{3,})\)/)?.[1];
  const brand = name.split(/\s+/)[0];
  if (model && /\d/.test(model) && !name.startsWith(model)) return `${brand} ${model}`;
  return name.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
}

export function productImage(p: { id?: string; catalogId?: string; image?: string }): string | undefined {
  return p.image || catalogEntry(p.catalogId)?.image || catalogEntry(p.id)?.image || undefined;
}
