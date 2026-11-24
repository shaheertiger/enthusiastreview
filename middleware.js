/**
 * Vercel Routing Middleware.
 *
 * 1. Old URLs. From Nov 5-19 2026 the domain hosted dehumidifier guides under /best/, /guides/
 *    and six /compare/*-dehumidifier pages; those answer 410 Gone (off-topic for a PC hardware
 *    site) so search engines drop them faster than a 404. The Nov 2026 GPU bottleneck finder
 *    pages (/best-gpu-for-<cpu>/) 301 to the bottleneck calculator. The 2019-2020 PC guides that
 *    still had rankings are live again at their original URLs; the rest 301 in vercel.json.
 *
 * 2. Dualmark / AEO (https://dualmark.dev, AEO spec 1.0): every page has a Markdown twin,
 *    written into dist/ by scripts/build-markdown.mjs.
 *      GET /best/x.md                            -> Markdown of /best/x/
 *      GET /best/x/ + Accept: text/markdown      -> Markdown (q-values respected)
 *      GET /best/x/ from a known AI bot          -> Markdown, unless its Accept prefers HTML
 *      GET /best/x/ + Accept: application/json   -> 406 Not Acceptable
 *      GET /api/md/best/x                        -> Markdown of /best/x/, always
 *      GET /api/md/_catalog                      -> JSON list of every Markdown page
 *    HTML responses get Vary: Accept and a Link header pointing at their Markdown twin.
 *    Browsers, curl and link previews (wildcard or missing Accept) always get HTML.
 */
import { AEO_SPEC_VERSION, detectAIBot, negotiateFormat } from '@dualmark/core';
import { next } from '@vercel/functions';

export const config = {
  runtime: 'nodejs',
  // Everything except build assets and static files (but .md files are included).
  matcher: ['/((?!_astro/|_vercel/|.*\\.(?:css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|txt|xml|json|map)$).*)'],
};

const GONE = /^\/(?:best|guides)(?:\/.*)?$|^\/compare\/(?:alorair\-vs\-aprilaire\-dehumidifier|amana\-vs\-friedrich\-dehumidifier|aprilaire\-vs\-santa\-fe\-dehumidifier|frigidaire\-vs\-honeywell\-dehumidifier|haier\-vs\-ge\-dehumidifier|midea\-vs\-frigidaire\-dehumidifier)(?:\/|\.md)?$|^\/authors\/home-air-desk(?:\/|\.md)?$|^\/(?:how-to-overclock-a-gpu|how-to-benchmark-.+|how-to-get-windows-.+|how-to-choose-best-drone-.+|methodology|og)(?:\/.*)?$/;
// The Nov 2026 bottleneck-finder pages, except the guides that are live at their own URL: the 2020
// guide restored earlier, the one vercel.json redirects to /best-graphics-card/, and the eight Bing
// still ranked with clicks (Bing Webmaster, 21 Nov 2026), rebuilt as real roundups, and seven more Bing
// still showed with impressions on 22 Nov 2026 (5600, 5500, 7800X3D, 7700X, 11400F, 13400F, 7600).
const LIVE_GPU_FOR = 'ryzen-5-2600-and-3600|ryzen-9-3900x-and-3950x|ryzen-5-1600|core-i3-12100f|ryzen-5-9600x|core-i5-10400f|ryzen-7-3700x|ryzen-7-5700x|core-i5-12600k|core-i7-14700k|ryzen-5-5600|ryzen-5-5500|ryzen-7-7800x3d|ryzen-7-7700x|core-i5-11400f|core-i5-13400f|ryzen-5-7600|core-ultra-7-265k|core-i5-14600k|core-i5-12400f|ryzen-7-5800x3d|ryzen-7-9800x3d|ryzen-7-2700x|ryzen-9-3900x|ryzen-5-5600g|ryzen-5-3600|ryzen-5-2600|ryzen-5-7600x|core-i5-13600k';
const BOTTLENECK = new RegExp(`^/best-gpu-for-(?!(?:${LIVE_GPU_FOR})(?:/|\\.md)?$)[a-z0-9-]+(?:/|\\.md)?$`);
// Old single-CPU URLs whose CPU an existing guide covers. Empty since 23 Nov 2026: Bing kept showing
// /best-gpu-for-ryzen-5-3600/ and /best-gpu-for-ryzen-5-2600/ while they 301'd, so both are live pages again.
const GPU_FOR_MOVED = {};
const GONE_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed | Enthusiast Review</title></head>' +
  '<body style="font-family:system-ui,sans-serif;max-width:640px;margin:auto;padding:32px 16px;color:#1f1f1f">' +
  '<h1>This page has been removed</h1><p>Enthusiast Review covers PC hardware. Start with <a href="/best-of/">every best list</a>, <a href="/gear/">the parts we track</a> or the <a href="/tools/bottleneck-calculator/">bottleneck calculator</a>.</p></body></html>';

// Marks the middleware's own request for a static .md file so it isn't handled twice.
const INTERNAL = 'x-markdown-internal';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Allow-Headers': 'Accept, Content-Type' };
const DESCRIBED_BY = ['/llms.txt', '/llms-full.txt', '/ai.txt'].map((p) => `<${p}>; rel="describedby"; type="text/plain"`);

/** /best/x/ -> /best/x.md ; / -> /index.md */
function markdownPath(pathname) {
  const p = pathname.replace(/\.md$/, '').replace(/\/+$/, '');
  return p === '' || p === '/index' ? '/index.md' : `${p}.md`;
}
const isContentRoute = (pathname) => !/\.[a-z0-9]+$/i.test(pathname) && !/^\/(api|_[^/]*|\.well-known)(\/|$)/.test(pathname);
const alternateLink = (pathname) => `<${markdownPath(pathname)}>; rel="alternate"; type="text/markdown"`;

function respond(request, body, { status = 200, contentType = 'text/markdown; charset=utf-8', canonical, lastModified, byUserAgent = false } = {}) {
  const headers = new Headers({
    ...CORS,
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-AEO-Version': AEO_SPEC_VERSION,
    Vary: byUserAgent ? 'Accept, User-Agent' : 'Accept',
    'X-Markdown-Tokens': String(Math.max(1, Math.ceil(body.length / 4))),
    'X-Robots-Tag': 'noindex, follow',
    'Cache-Control': status === 200 ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'public, s-maxage=300',
  });
  if (canonical) {
    headers.set('Content-Location', canonical);
    headers.set('Link', `<${canonical}>; rel="canonical"`);
  }
  if (lastModified) headers.set('Last-Modified', lastModified);
  return new Response(request.method === 'HEAD' ? null : body, { status, headers });
}

function notFound(request, pathname) {
  const origin = new URL(request.url).origin;
  return respond(request, `# Page not found\n\n> There is no Markdown page at ${pathname}.\n\nEvery page is listed in ${origin}/llms.txt and ${origin}/api/md/_catalog.\n`, { status: 404 });
}

function notAcceptable(request, pathname) {
  return new Response(request.method === 'HEAD' ? null : 'Not Acceptable\n\nSupported types: text/html, text/markdown\n', {
    status: 406,
    headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', Vary: 'Accept', Link: alternateLink(pathname) },
  });
}

const fetchInternal = (request, path) => fetch(new URL(path, request.url), { headers: { [INTERNAL]: '1' } });

async function serveMarkdown(request, pathname, { negotiated = false, byUserAgent = false } = {}) {
  const res = await fetchInternal(request, markdownPath(pathname));
  if (!res.ok) return negotiated ? undefined : notFound(request, pathname);
  const body = await res.text();
  const canonical = body.match(/^Canonical: (\S+)$/m)?.[1];
  const updated = body.match(/^Last updated: (\d{4}-\d{2}-\d{2})$/m)?.[1];
  return respond(request, body, { canonical, lastModified: updated ? new Date(`${updated}T00:00:00Z`).toUTCString() : undefined, byUserAgent });
}

export default async function middleware(request) {
  if (request.headers.get(INTERNAL)) return next();
  const { pathname } = new URL(request.url);
  const { method } = request;

  const moved = GPU_FOR_MOVED[pathname.replace(/(\/|\.md)$/, '')];
  if (moved) return Response.redirect(new URL(moved, 'https://www.enthusiastreview.com'), 301);
  if (BOTTLENECK.test(pathname)) {
    return Response.redirect(new URL('/tools/bottleneck-calculator/', 'https://www.enthusiastreview.com'), 301);
  }
  if (GONE.test(pathname)) {
    return new Response(method === 'HEAD' ? null : GONE_HTML, { status: 410, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }

  const direct = pathname === '/api/md' || pathname.startsWith('/api/md/');
  const suffix = !direct && pathname.endsWith('.md');

  if (!direct && !suffix) {
    if (!isContentRoute(pathname) || (method !== 'GET' && method !== 'HEAD')) return next();
    const accept = request.headers.get('accept') ?? '';
    const isBot = detectAIBot(request.headers.get('user-agent') ?? '').isBot;
    // AI bots get Markdown first unless their Accept ranks HTML higher; people get HTML first.
    const format = negotiateFormat(accept, isBot ? ['markdown', 'html'] : ['html', 'markdown']);
    if (format === null) return notAcceptable(request, pathname);
    if (format === 'markdown') {
      const md = await serveMarkdown(request, pathname, { negotiated: true, byUserAgent: isBot });
      if (md) return md;
    }
    return next({ headers: { Link: [alternateLink(pathname), ...DESCRIBED_BY].join(', '), Vary: 'Accept, User-Agent' } });
  }

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...CORS, 'Access-Control-Max-Age': '86400' } });
  if (method !== 'GET' && method !== 'HEAD') return new Response('Method not allowed\n', { status: 405, headers: { ...CORS, Allow: 'GET, HEAD, OPTIONS' } });

  if (direct) {
    const rest = pathname.replace(/^\/api\/md\/?/, '');
    if (rest.replace(/\/+$/, '') === '_catalog') {
      const res = await fetchInternal(request, '/md-catalog.json');
      if (!res.ok) return notFound(request, pathname);
      return respond(request, await res.text(), { contentType: 'application/json; charset=utf-8' });
    }
    return serveMarkdown(request, `/${rest}`);
  }
  return serveMarkdown(request, pathname);
}
