import { NextResponse, type NextRequest } from "next/server";

// Pages from the old site that no longer exist. 410 Gone tells Google and Bing
// to drop them from the index faster than a 404.
const GONE = [
  "best-cpu-cooler-for-ryzen-9-3900x-and-3950x",
  "best-power-supply-psu-for-ryzen-5-2600-and-3600",
  "best-psu-for-rtx-2080-and-2080-ti",
  "best-psu-for-ryzen-9-3900x-and-3950x",
  "best-psu-for-ryzen-7-2700x-and-3700x",
  "best-psu-under-100",
  "best-pc-cases-under-50",
  "best-pc-cases-for-ryzen-3000-series",
  "best-ram-for-ryzen-9-3900x-and-3950x",
  "best-motherboard-for-ryzen-9-3950x",
  "how-to-overclock-a-gpu",
];

// Must be a static literal (Next.js reads it at build time). Keep in sync with GONE.
export const config = {
  matcher: [
    "/best-cpu-cooler-for-ryzen-9-3900x-and-3950x", "/best-cpu-cooler-for-ryzen-9-3900x-and-3950x/",
    "/best-power-supply-psu-for-ryzen-5-2600-and-3600", "/best-power-supply-psu-for-ryzen-5-2600-and-3600/",
    "/best-psu-for-rtx-2080-and-2080-ti", "/best-psu-for-rtx-2080-and-2080-ti/",
    "/best-psu-for-ryzen-9-3900x-and-3950x", "/best-psu-for-ryzen-9-3900x-and-3950x/",
    "/best-psu-for-ryzen-7-2700x-and-3700x", "/best-psu-for-ryzen-7-2700x-and-3700x/",
    "/best-psu-under-100", "/best-psu-under-100/",
    "/best-pc-cases-under-50", "/best-pc-cases-under-50/",
    "/best-pc-cases-for-ryzen-3000-series", "/best-pc-cases-for-ryzen-3000-series/",
    "/best-ram-for-ryzen-9-3900x-and-3950x", "/best-ram-for-ryzen-9-3900x-and-3950x/",
    "/best-motherboard-for-ryzen-9-3950x", "/best-motherboard-for-ryzen-9-3950x/",
    "/how-to-overclock-a-gpu", "/how-to-overclock-a-gpu/",
  ],
};

export function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.replace(/^\/|\/$/g, "");
  if (!GONE.includes(slug)) return NextResponse.next();
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed | enthusiastreview</title></head><body style="font-family:system-ui,sans-serif;background:#f3f2f2;color:#201e1d;padding:32px 16px;max-width:720px;margin:auto"><h1>This page has been removed</h1><p>Find the right graphics card for your CPU with the <a href="/" style="color:#ae1800">GPU bottleneck finder</a>.</p></body></html>`,
    { status: 410, headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" } },
  );
}
