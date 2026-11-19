# Enthusiast Review — PC hardware buying guides

Static [Astro](https://astro.build) site of PC hardware buying guides, product pages and comparisons
(graphics cards, CPUs, CPU coolers, power supplies, cases, RAM, motherboards, SSDs), with Amazon
affiliate links (tag `sktiger-20`). The site was a PC hardware site from 2019; this version brings that
genre back, restores the 2020 URLs that still had rankings, and copies the page structure that works on
our sister sites (besthometheaterreview.com, best-proteinpowder.com). See
[`docs/ranking-method.md`](docs/ranking-method.md).

## Run

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # page dates → validate → astro build → Markdown twins → IndexNow (production only)
npm run audit:seo # after a build: titles, descriptions, Short Answer H2, H1s, schema, inbound links
```

Deploy on Vercel (framework preset: Astro).

## URLs (the sister-site structure)

| Path | Page | Source |
|---|---|---|
| `/<slug>/` | Buyer's guides (`/best-graphics-card/`) and brand reviews (`/corsair-review/`) at the root | `src/data/guides/<slug>.json` |
| `/gear/<id>/` | One page per product: specs, ER Score, verdict, alternatives, FAQ | `src/data/products/<category>.json` |
| `/compare/<a>-vs-<b>/` | Head-to-heads: Short Answer, specs side by side, differences, scores | `src/data/compares.json` |
| `/glossary/<id>/` | Spec-sheet terms with a worked example | `src/data/glossary.json` |
| `/brands/` and `/brands/<brand>/` | Brand hubs with every product we track | `src/data/brands.json` |
| `/tools/bottleneck-calculator/`, `/tools/psu-calculator/` | Calculators | `src/data/hardware-index.ts` |
| `/best-of/`, `/gear/`, `/compare/`, `/glossary/`, `/tools/` | Hubs | generated |

Also `/about/`, `/how-we-review/`, `/disclosure/`, `/privacy/`, `/contact/`, `/authors/<slug>/`,
`/sitemap.xml`, `/robots.txt`, and a Markdown twin of every page (`/gear/rtx-5070.md`).

## Where things live

| Path | What |
|---|---|
| `docs/content-schema.md` | **The JSON schema and house rules** for every content type. Read before editing content. |
| `src/lib/data.ts` | Loads all content; lookups, dates, price bands, titles, inline text with auto-links. |
| `src/pages/[slug].astro` | Guide template: Short Answer → how we ranked → picks → spec table → mentions → sections → mistakes → bottom line → FAQ → sources → all we track. |
| `src/pages/gear/[id].astro` | Product template (Product + Review + FAQPage schema). |
| `src/pages/compare/[pair].astro` | Comparison template. |
| `src/data/categories.ts` | The eight categories, their hero guide and icon. |
| `src/data/affiliate.ts` | `amazonLink()`: explicit URL → verified `asin` → tagged Amazon search. |
| `scripts/validate-content.mjs` | Schema, ids, internal links, one-URL-per-search, no testing claims, lengths. |
| `scripts/page-dates.mjs` | Real `updated` dates from git per content file. |
| `scripts/build-markdown.mjs` | Markdown twins + `llms.txt`, `llms-full.txt`, `ai.txt` from the built HTML. |
| `middleware.js` | Dualmark Markdown negotiation; 410 Gone for the old dehumidifier URLs; 301 for old bottleneck-finder URLs. |
| `vercel.json` | 301s for the 2020 URLs that were merged into newer pages. |

## Common tasks

- **Add a product:** append it to `src/data/products/<category>.json` (schema §1). Its `/gear/` page,
  sitemap entry, hub rows and auto-links appear automatically.
- **Add a comparison:** append `{a, b, title, description, quick, differ, buyA, buyB}` to `compares.json`.
  It is linked from both product pages, the hub and any guide that picks both.
- **Add a guide:** copy a file in `src/data/guides/`, change `slug` (must match the file name). Run
  `npm run validate`: it refuses a second page that targets the same search.
- **Direct product links:** set `"asin"` on a product only after checking the Amazon listing is the exact model.

## Honesty rules (enforced by the validator)

We have not bench-tested these parts. The ER Score is a research score from spec sheets, platform
documentation, independent measurements and owner reports, and every page says so. The validator fails
any text that claims testing.
