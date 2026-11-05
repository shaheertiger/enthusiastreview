import { PAGES, pathOf } from '../lib/content';
import { productImage } from '../data/affiliate';
import { SITE } from '../data/site';
import { AUTHORS } from '../data/authors';

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// One sitemap for every indexable URL, with the product photos on each guide
// (Google image sitemap extension). scripts/indexnow-submit.mjs reads this file.
export function GET() {
  const latest = PAGES.reduce((m, p) => (p.updated > m ? p.updated : m), SITE.updated);
  type Url = { loc: string; lastmod: string; priority: string; changefreq: string; images?: { loc: string; title: string }[] };
  const urls: Url[] = [
    { loc: '/', lastmod: latest, priority: '1.0', changefreq: 'daily' },
    ...['/best/', '/guides/', '/compare/'].map((loc) => ({ loc, lastmod: latest, priority: '0.9', changefreq: 'weekly' })),
    ...PAGES.map((p) => ({
      loc: pathOf(p),
      lastmod: p.updated,
      priority: p.section === 'best' ? '0.8' : '0.7',
      changefreq: 'monthly',
      images: p.products
        .map((pr) => ({ loc: productImage(pr), title: pr.name }))
        .filter((i): i is { loc: string; title: string } => Boolean(i.loc))
        .filter((i, n, a) => a.findIndex((x) => x.loc === i.loc) === n),
    })),
    ...['/about/', '/how-we-review/', '/contact/', '/disclosure/', '/privacy/'].map((loc) => ({ loc, lastmod: SITE.updated, priority: '0.3', changefreq: 'yearly' })),
    ...Object.keys(AUTHORS).map((s) => ({ loc: `/authors/${s}/`, lastmod: latest, priority: '0.4', changefreq: 'monthly' })),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${SITE.url}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority>` +
          (u.images ?? []).map((i) => `<image:image><image:loc>${xml(i.loc)}</image:loc><image:title>${xml(i.title)}</image:title></image:image>`).join('') +
          `</url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
