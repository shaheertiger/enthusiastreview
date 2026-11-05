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
| `scripts/validate-content.mjs` | Pre-build checks: schema, word counts, internal links, catalog ids, no fake "we tested" claims. |

## Common tasks

- **Add a page:** copy an existing JSON file in `src/content/pages/`, change `slug` (must match the
  file name) and `section`. Hubs, home page, menus, sitemap, related links and JSON-LD pick it up
  automatically. Run `npm run validate`.
- **Give a product a photo and direct link:** add it to `src/data/catalog.json` with its ASIN and
  image URL, then set `"catalogId"` on the product. Only map the exact same model.
- **Override a link:** set `"url"` (e.g. a SiteStripe link) or `"asin"` on the product.

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
