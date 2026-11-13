# Enthusiast Review — dehumidifier buying guides

Static [Astro](https://astro.build) site of dehumidifier reviews, buying guides and comparisons,
with Amazon affiliate links (tag `sktiger-20`). Every review page follows a magazine
buyer's-guide layout: title and dek → byline → disclosure → product hero → intro →
**Our top picks** → numbered product cards (photo, Amazon button, pros/cons, write-up,
"Features at a glance") → how we pick → what to look for → topic sections → FAQ →
why trust us → **Readers also read**.

## Run

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # validates content, then builds static HTML into dist/
```

Deploy on Vercel (framework preset: Astro, zero config).

## Where things live

| Path | What |
|---|---|
| `src/content/pages/*.json` | **One file per page.** Text, products, sections, FAQs. Schema in `src/lib/content.ts`. |
| `src/data/catalog.json` | Products with a verified Amazon ASIN + photo. Pages reference these with `catalogId`. |
| `src/data/affiliate.ts` | `amazonLink()` — explicit URL → `/dp/ASIN` from the catalog → tagged Amazon search. Every link carries the tag. |
| `src/data/site.ts` | Site name, URL, email, categories. |
| `src/data/authors.ts` | Bylines. Add real authors here and set `"author": "<slug>"` on pages. |
| `src/components/Article.astro` | The single page template for `/best/`, `/guides/` and `/compare/` pages. |
| `src/styles/global.css` | Design tokens and styles (Barlow Semi Condensed + Lora, teal accent). |
| `scripts/validate-content.mjs` | Pre-build checks: schema, word counts, internal links, catalog ids, no fake "we tested" claims; prints affiliate-link coverage. |
| `scripts/fetch-product-images.mjs` | `npm run images:fetch` — finds each product's exact Amazon ASIN + photo with the **official** Creators API SDK. |
| `vendor/creatorsapi-nodejs-sdk/` | Amazon's official Creators API Node.js SDK (Amazon ships it as a zip, not on npm), prebuilt. |

## Common tasks

- **Add a page:** copy an existing JSON file in `src/content/pages/`, change `slug` (must match the
  file name) and `section`. Hubs, home page, menus, sitemap, related links and JSON-LD pick it up
  automatically. Run `npm run validate`.
- **Give a product a photo and direct link:** add it to `src/data/catalog.json` with its ASIN and
  image URL, then set `"catalogId"` on the product. Only map the exact same model.
- **Override a link:** set `"url"` (e.g. a SiteStripe link) or `"asin"` on the product.

## Product photos and direct links (Amazon Creators API)

```bash
cp .env.example .env            # add your Creators API credential ID, secret and version
npm run images:fetch            # look up every product still missing an ASIN + photo
npm run images:fetch -- --verify   # also re-check existing ASINs against their Amazon titles
```

The script uses Amazon's official Creators API Node.js SDK (vendored in
`vendor/creatorsapi-nodejs-sdk`). It searches Amazon for each product and only accepts a
listing whose title contains the product's model number (or, without one, the same brand
and pint size), then writes the ASIN and official image URL to `src/data/catalog.json`.
Unmatched products are listed in `scripts/image-match-report.json`; set `"asin"` on those
by hand. New credentials are limited to 1 request/second and 8,640/day; the script paces
itself and saves progress every 10 products.

## Internal linking

Handled by the template, so new pages are linked automatically:

- **Contextual links:** the first mention of a brand or topic in body copy links to its page
  (`createAutolinker` in `src/lib/content.ts`; terms in `BRAND_TERMS` / `TOPIC_TERMS`).
- **Keep reading:** three in-article links per page, round-robin within its category, so every
  page is linked from the body of its siblings.
- **More from [brand]** under each product card, **Head-to-head** comparisons on brand pages,
  **More in [category]** and **Readers also read** at the bottom, linked breadcrumbs, hubs and the home page.

## AI agents (Dualmark / AEO)

The site follows the [Dualmark](https://dualmark.dev) AEO spec 1.0. After `astro build`,
`scripts/build-markdown.mjs` writes a Markdown twin of every page from the same JSON
(`/best/x/` → `/best/x.md`, `/` → `/index.md`), plus `llms.txt`, `llms-full.txt`, `ai.txt`,
`sitemap.md` and `md-catalog.json`. `middleware.js` (Vercel Routing Middleware, using
`@dualmark/core`) then:

- serves `.md` URLs with `Content-Type: text/markdown`, `X-Markdown-Tokens`, `X-Robots-Tag: noindex`,
  `Vary: Accept`, `X-AEO-Version` and `X-Content-Type-Options: nosniff`;
- returns Markdown for `Accept: text/markdown` and for known AI bots (GPTBot, ClaudeBot, PerplexityBot…)
  unless they explicitly prefer HTML, and 406 when neither format is acceptable;
- adds `Link: <…md>; rel="alternate"; type="text/markdown"` and `Vary` to every HTML page;
- answers 410 Gone for the old PC-gaming URLs.

Check it after a deploy: `npx @dualmark/cli verify https://www.enthusiastreview.com/best/best-dehumidifier/`

## URLs

Pages live at `/best/<slug>/`, `/guides/<slug>/` and `/compare/<slug>/`, with hubs at `/best/`,
`/guides/` and `/compare/`. Also `/about/`, `/how-we-review/`, `/disclosure/`, `/privacy/`,
`/contact/`, `/authors/<slug>/`, `/sitemap.xml` and `/robots.txt`.

## SEO

- Pre-rendered HTML with title, description, canonical and Open Graph tags on every page.
- `sitemap.xml` lists every URL with lastmod and the product photos on each guide (image sitemap); `sitemap.md` lists the Markdown twins.
- JSON-LD: `BreadcrumbList`, `Article`, `ItemList` and `FAQPage` on content pages; `CollectionPage` on hubs.
- Affiliate links use `rel="sponsored nofollow noopener"`; disclosure near the top of every page and in the footer.
- Search console verification: set `PUBLIC_GOOGLE_SITE_VERIFICATION` and `PUBLIC_BING_SITE_VERIFICATION` in Vercel.
- IndexNow: every Vercel **production** build ends by submitting every sitemap URL to IndexNow (Bing picks changes up within hours). Previews and local builds skip it, and a failed ping never fails the deploy. `npm run indexnow` submits the live sitemap by hand. Key file in `public/`.

### Bing first

Nearly all search traffic to sites like this comes from Bing-powered engines (Bing, DuckDuckGo, Yahoo, Ecosia, Copilot), so the on-page rules follow what Bing rewards:

- **Titles lead with the query**, 50–65 characters. The ` | Enthusiast Review` suffix is added only when it still fits in 65 (`src/layouts/Base.astro`). A year goes in the title only where the answer changes by year: buying guides and brand comparisons carry `(2026)`; how-tos and explainers do not.
- **Meta descriptions are 110–160 characters** and answer the query; Bing shows them more often than Google rewrites them.
- **Real dates.** A page's `updated` date is the last git commit that changed its JSON (`scripts/page-dates.mjs`, the first build step, writes the gitignored `src/data/git-dates.json`). Vercel builds from a shallow clone, so the script fetches full history first and ignores the shallow boundary commit if it cannot. The `updated` field in each JSON is only the fallback. Never bump a date without a real change.
- **No testing claims.** We don't run a lab; pages attribute every figure ("rated for", "the manual specifies", "owners commonly report").

`npm run build && npm run audit:seo` (add `--list` for the URLs) reports titles, descriptions, H1s, dates, FAQ schema, testing claims and weakly linked pages against those rules. Run it monthly, and after any big batch.

Bing Webmaster Tools: the home page has no `msvalidate.01` tag unless `PUBLIC_BING_SITE_VERIFICATION` is set in Vercel. Confirm the site is verified (by that tag or by DNS), and submit `/sitemap.xml`.
