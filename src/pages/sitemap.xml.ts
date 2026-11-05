import { PAGES, pathOf } from '../lib/content';
import { SITE } from '../data/site';
import { AUTHORS } from '../data/authors';

export function GET() {
  const latest = PAGES.reduce((m, p) => (p.updated > m ? p.updated : m), SITE.updated);
  const urls: { loc: string; lastmod: string; priority: string }[] = [
    { loc: '/', lastmod: latest, priority: '1.0' },
    ...['/best/', '/guides/', '/compare/'].map((loc) => ({ loc, lastmod: latest, priority: '0.9' })),
    ...PAGES.map((p) => ({ loc: pathOf(p), lastmod: p.updated, priority: p.section === 'best' ? '0.8' : '0.7' })),
    ...['/about/', '/how-we-review/', '/contact/', '/disclosure/', '/privacy/'].map((loc) => ({ loc, lastmod: SITE.updated, priority: '0.3' })),
    ...Object.keys(AUTHORS).map((s) => ({ loc: `/authors/${s}/`, lastmod: latest, priority: '0.4' })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE.url}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
