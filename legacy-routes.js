/**
 * Site-specific old-URL rules, run first by middleware.js (which is shared with the sister sites).
 *
 * From Nov 5-19 2026 the domain hosted dehumidifier guides under /best/, /guides/ and six
 * /compare/*-dehumidifier pages; those answer 410 Gone (off-topic for a PC hardware site) so search
 * engines drop them faster than a 404. The Nov 2026 GPU bottleneck finder pages
 * (/best-gpu-for-<cpu>/) 301 to the bottleneck calculator. The 2019-2020 PC guides that still had
 * rankings are live again at their original URLs; the rest 301 in vercel.json.
 */
const GONE = /^\/(?:best|guides)(?:\/.*)?$|^\/compare\/(?:alorair\-vs\-aprilaire\-dehumidifier|amana\-vs\-friedrich\-dehumidifier|aprilaire\-vs\-santa\-fe\-dehumidifier|frigidaire\-vs\-honeywell\-dehumidifier|haier\-vs\-ge\-dehumidifier|midea\-vs\-frigidaire\-dehumidifier)(?:\/|\.md)?$|^\/authors\/home-air-desk(?:\/|\.md)?$|^\/(?:how-to-overclock-a-gpu|how-to-benchmark-.+|how-to-get-windows-.+|how-to-choose-best-drone-.+|methodology|og)(?:\/.*)?$/;
// The Nov 2026 bottleneck-finder pages, except the guides that are live at their own URL: the 2020
// guide restored earlier, the one vercel.json redirects to /best-graphics-card/, and the eight Bing
// still ranked with clicks (Bing Webmaster, 21 Nov 2026), rebuilt as real roundups, and seven more Bing
// still showed with impressions on 22 Nov 2026 (5600, 5500, 7800X3D, 7700X, 11400F, 13400F, 7600).
// `ai` is not a CPU: /best-gpu-for-ai/ is a buyer's guide (24 Nov 2026) and must not 301 to the calculator.
const LIVE_GPU_FOR = 'ai|ryzen-5-2600-and-3600|ryzen-9-3900x-and-3950x|ryzen-5-1600|core-i3-12100f|ryzen-5-9600x|core-i5-10400f|ryzen-7-3700x|ryzen-7-5700x|core-i5-12600k|core-i7-14700k|ryzen-5-5600|ryzen-5-5500|ryzen-7-7800x3d|ryzen-7-7700x|core-i5-11400f|core-i5-13400f|ryzen-5-7600|core-ultra-7-265k|core-i5-14600k|core-i5-12400f|ryzen-7-5800x3d|ryzen-7-9800x3d|ryzen-7-2700x|ryzen-9-3900x|ryzen-5-5600g|ryzen-5-3600|ryzen-5-2600|ryzen-5-7600x|core-i5-13600k|ryzen-7-8700f|ryzen-7-7700';
const BOTTLENECK = new RegExp(`^/best-gpu-for-(?!(?:${LIVE_GPU_FOR})(?:/|\\.md)?$)[a-z0-9-]+(?:/|\\.md)?$`);
// Old single-CPU URLs whose CPU an existing guide covers. Empty since 23 Nov 2026: Bing kept showing
// /best-gpu-for-ryzen-5-3600/ and /best-gpu-for-ryzen-5-2600/ while they 301'd, so both are live pages again.
const GPU_FOR_MOVED = {};
const GONE_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed | Enthusiast Review</title></head>' +
  '<body style="font-family:system-ui,sans-serif;max-width:640px;margin:auto;padding:32px 16px;color:#1f1f1f">' +
  '<h1>This page has been removed</h1><p>Enthusiast Review covers PC hardware. Start with <a href="/best-of/">every best list</a>, <a href="/gear/">the parts we track</a> or the <a href="/tools/bottleneck-calculator/">bottleneck calculator</a>.</p></body></html>';

/** A Response for an old URL, or undefined to carry on. */
export function legacyRoute(pathname, method) {
  const moved = GPU_FOR_MOVED[pathname.replace(/(\/|\.md)$/, '')];
  if (moved) return Response.redirect(new URL(moved, 'https://www.enthusiastreview.com'), 301);
  if (BOTTLENECK.test(pathname)) {
    return Response.redirect(new URL('/tools/bottleneck-calculator/', 'https://www.enthusiastreview.com'), 301);
  }
  if (GONE.test(pathname)) {
    return new Response(method === 'HEAD' ? null : GONE_HTML, { status: 410, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  return undefined;
}
