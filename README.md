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

## URLs

Pages live at `/best/<slug>/`, `/guides/<slug>/` and `/compare/<slug>/`, with hubs at `/best/`,
`/guides/` and `/compare/`. Also `/about/`, `/how-we-review/`, `/disclosure/`, `/privacy/`,
`/contact/`, `/authors/<slug>/`, `/sitemap.xml` and `/robots.txt`.

## SEO

- Pre-rendered HTML with title, description, canonical and Open Graph tags on every page.
- JSON-LD: `BreadcrumbList`, `Article`, `ItemList` and `FAQPage` on content pages; `CollectionPage` on hubs.
- Affiliate links use `rel="sponsored nofollow noopener"`; disclosure near the top of every page and in the footer.
- Search console verification: set `PUBLIC_GOOGLE_SITE_VERIFICATION` and `PUBLIC_BING_SITE_VERIFICATION` in Vercel.
- After each deploy, ping Bing/IndexNow with every sitemap URL: `npm run indexnow` (key file in `public/`).
