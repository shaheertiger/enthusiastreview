# enthusiastreview — GPU bottleneck finder

Next.js (App Router) site. Every CPU gets a statically generated page at
`/best-gpu-for-{cpu}/` with an interactive picker (resolution, refresh rate, RAM, use,
budget) that recommends a **Budget pick**, **Best match** and **Max before bottleneck** GPU,
followed by ~2,000 words of CPU-specific long-form content and a sticky affiliate price bar.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static generation of every page
```

Deploy on Vercel (zero config).

## Where things live

| Path | What |
|---|---|
| `lib/data.ts` | **All hardware data**: CPUs (cap, socket, specs, editorial blurb), GPUs (score, price, VRAM, lanes, watts), games, site config, Amazon tag |
| `lib/recommend.ts` | Recommendation model (CPU ceiling × settings multipliers → picks, FPS, PSU, upgrade path) |
| `lib/content.ts` | Long-form text, checklist and FAQ generated from CPU + settings |
| `components/Finder.tsx` | Client picker + article (server-rendered with default settings, hydrates on client) |
| `app/[slug]/page.tsx` | CPU page: metadata, JSON-LD, resolution ceiling table, internal links |
| `app/og/[file]/route.tsx` | Per-CPU Open Graph images at `/og/best-gpu-for-{cpu}.png` |

**Add a CPU:** append it to `CPUS` in `lib/data.ts` — its page, sitemap entry, OG image and
internal links are generated automatically. **Update prices:** edit `GPUS` and bump `SITE.updated`.

All scores, ceilings and prices are editorial estimates on a shared scale (see `/methodology/`);
replace them with real benchmark data / a live price feed as it becomes available.

## SEO (Google + Bing)

- Every page is pre-rendered HTML: title/h1 "Best GPU for {CPU} Without Bottleneck", meta
  description, canonical, Open Graph/Twitter cards with image.
- JSON-LD: `Article`, `BreadcrumbList`, `ItemList`, `FAQPage` on CPU pages; `WebSite`,
  `Organization`, `WebApplication`, `FAQPage` on the home page.
- `sitemap.xml` and `robots.txt` generated from the CPU list.
- Old WordPress URLs 301/308-redirect to the closest new page (`next.config.mjs`).
- Affiliate links use `rel="sponsored nofollow"` with disclosures near price blocks.
- Search console verification: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
  `NEXT_PUBLIC_BING_SITE_VERIFICATION` (the `msvalidate.01` value) in Vercel env vars.
- After each deploy, ping Bing/IndexNow with every sitemap URL:

```bash
npm run indexnow
```

  The key file is served from `public/<key>.txt`.
