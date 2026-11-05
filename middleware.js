// Vercel Routing Middleware. The domain used to host a PC-gaming site (GPU bottleneck
// finder, PSU/RAM/case lists). Those pages are gone for good; answering 410 Gone tells
// Google and Bing to drop them from the index faster than a 404 would. None of these
// paths overlap the dehumidifier site, whose pages all live under /best/, /guides/ and /compare/.
export const config = {
  matcher: [
    '/:old(best-gpu-for-.+|best-graphics-card-.+|gpu-bottleneck-calculator|bottleneck-calculator|how-to-overclock-a-gpu|best-cpu-cooler-.+|best-psu-.+|best-power-supply-.+|best-pc-cases-.+|best-ram-.+|best-motherboard-.+|methodology)/:rest*',
    '/og/:path*',
  ],
};

export default function middleware() {
  return new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed | Enthusiast Review</title></head>' +
      '<body style="font-family:system-ui,sans-serif;max-width:640px;margin:auto;padding:32px 16px;color:#1f1f1f">' +
      '<h1>This page has been removed</h1><p>Enthusiast Review now covers dehumidifiers. Start with <a href="/best/best-dehumidifier/">the best dehumidifiers</a> or browse <a href="/best/">every guide</a>.</p></body></html>',
    { status: 410, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } },
  );
}
