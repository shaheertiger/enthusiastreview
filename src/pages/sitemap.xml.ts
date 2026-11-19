import { SITE } from '../data/site';
import { AUTHORS } from '../data/authors';
import {
  GUIDES, PRODUCTS, COMPARES, TERMS, BRANDS, guidePath, productPath, comparePath, termPath, brandPath,
  guideUpdated, productUpdated, compareUpdated, glossaryUpdated, latestDate,
} from '../lib/data';

// One sitemap for every indexable URL. scripts/indexnow-submit.mjs reads the built file.
export function GET() {
  const latest = latestDate();
  const urls: { loc: string; lastmod: string }[] = [
    { loc: '/', lastmod: latest },
    ...['/best-of/', '/gear/', '/compare/', '/glossary/', '/brands/', '/tools/'].map((loc) => ({ loc, lastmod: latest })),
    ...GUIDES.map((g) => ({ loc: guidePath(g), lastmod: guideUpdated(g) })),
    ...PRODUCTS.map((p) => ({ loc: productPath(p), lastmod: productUpdated(p) })),
    ...COMPARES.map((c) => ({ loc: comparePath(c), lastmod: compareUpdated() })),
    ...TERMS.map((t) => ({ loc: termPath(t), lastmod: glossaryUpdated() })),
    ...BRANDS.map((b) => ({ loc: brandPath(b), lastmod: latest })),
    ...['/tools/bottleneck-calculator/', '/tools/psu-calculator/'].map((loc) => ({ loc, lastmod: SITE.updated })),
    ...['/about/', '/how-we-review/', '/contact/', '/disclosure/', '/privacy/'].map((loc) => ({ loc, lastmod: SITE.updated })),
    ...Object.keys(AUTHORS).map((s) => ({ loc: `/authors/${s}/`, lastmod: latest })),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE.url}${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
