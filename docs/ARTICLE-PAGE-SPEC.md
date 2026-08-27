# EnthusiastReview — Article Page Spec

How an article page on enthusiastreview.com is built, so a new page comes out
matching the other 14. The reference implementation is
**`app/best-psu-under-100/`**; when anything here is ambiguous, open those two
files and copy what they do.

This is the site's adaptation of the shared Honest Reviewers article-page spec.
The structure is the same; the stack is not — this repo is **Next.js 15 (App
Router) + Tailwind 3**, not Astro, so shared chrome lives in React components
rather than an `.astro` layout.

---

## 1. Stack and repo facts

- **Next.js 15 App Router**, Tailwind 3 plus hand-written CSS in
  `app/globals.css`. Deployed on Vercel.
- **One directory per URL.** `app/<slug>/` → `https://enthusiastreview.com/<slug>/`.
  Each directory holds exactly two files: `article.ts` (content + metadata) and
  `page.tsx` (route metadata + render).
- Every internal link ends in `/`. `validate:links` fails the build otherwise.
- Shared chrome — hero, breadcrumb, byline, contents card, JSON-LD, sidebar
  contents — lives in `components/ArticleLayout.tsx`. Article pages never render
  their own header, footer, or schema.

## 2. The build gates — read this before writing anything

`npm run build` runs three validators before Next compiles. All three must pass.

| Command | Rule |
|---|---|
| `npm run validate:words` | **Every page needs ≥ 2,500 words**, counted after tags and entities are stripped, so only real prose counts. |
| `npm run validate:links` | Every internal `href` in article HTML, in `.tsx` sources, and every hero CTA anchor must resolve — to a real `app/<slug>/page.tsx` with a trailing slash, or to an `id` that exists on the page. |
| `npm run validate:format` | Every page must contain the 15 structural elements in §4. `scripts/format-audit.mjs` prints exactly which page is missing which. |

Run `npm run validate:format` after any structural edit. It is cheap and catches
drift immediately.

## 3. The `article.ts` contract

```ts
import type { ArticleMeta } from "@/lib/article";

export const meta: ArticleMeta = {
  slug: "best-psu-under-100",
  heading: "The 7 Best PSUs Under $100 for Gaming Builds in 2026",
  highlight: "PSUs",              // substring of `heading`, rendered in accent
  standfirst: "…",                // one concrete sentence, ~150–160 chars
  kind: "Buyer's Guide",          // or "Comparison" / "How-To"
  category: "Power Supplies",     // must match lib/pages.ts
  author: "Marcus Chen",
  authorRole: "PC Hardware Editor",
  updated: "August 2026",
  published: "2026-08-01",        // ISO
  modified: "2026-08-27",         // ISO
  ctas: [
    { text: "See the Top Picks", href: "#top-picks" },
    { text: "Read the Buying Guide", href: "#buying-guide" },
  ],
};

export const articleHtml = "…";   // body only — no <article>, no <h1>, no byline
```

`heading` becomes the `<h1>` inside the hero. `standfirst` is reused as the
meta/OG description and the Article node's `description`. Both CTA anchors are
checked against real section ids.

`page.tsx` is boilerplate: `title`, `description`, canonical, OpenGraph
`article` metadata, Twitter card, then
`<ArticleLayout meta={meta} html={articleHtml} title={title} />`. Copy it from an
existing page and change the strings.

## 4. Page skeleton — the required elements

`ArticleLayout` renders 1–3 from `meta`; 4–9 live in `articleHtml`.

1. **Dark hero** (`.article-hero`) — `<TrustBadge />`, an orange kind pill and a
   green `Updated <Month> <Year>` pill, the `<h1>` with `highlight` wrapped in
   `.hero-highlight`, the standfirst, and two CTAs (solid orange to the top pick,
   translucent to a key section).
2. **Byline strip** (`.byline-strip`) — initials avatar, author name, role and
   last-updated line, and `<SocialProof />` pushed right with `margin-left: auto`.
3. **Contents card** (`.contents-card`) — the list icon plus the exact words
   **"In This Guide"**, then a two-column numbered nav. Generated from the body's
   `<h2 id>`s up to and including the FAQ, so it cannot drift from the page.
4. **Lead paragraph** — the first child of `articleHtml` is a `<p>`; it is styled
   as the lead automatically.
5. **Sections** — `<h2 id="…">N. Heading</h2>`, numbered to match the contents
   card. 4–9 of them.
6. **FAQ** — `<h2 id="faq">N. Frequently Asked Questions</h2>` then 5+
   `<details class="faq-item">` cards. The FAQPage JSON-LD is read out of this
   markup, so the two can never disagree.
7. **Common Mistakes** — `<h2 id="common-mistakes">Common Mistakes to Avoid</h2>`,
   one intro `<p>`, then `<div class="mistakes-grid">` of exactly four
   `<div class="mistake-card">` blocks, each an `<h3>` naming a concrete failure
   mode and a `<p>` giving the fix.
8. **Related Guides** — `<h2 id="related-guides">Related Guides</h2>` then a
   `.related-grid` of three `.related-card` links to real pages.
9. **Closing** — `<h2 id="bottom-line">The Bottom Line</h2>` and a
   `.closing-box`, bolding the key recommendation.

Order is enforced: FAQ → Common Mistakes → Related Guides → The Bottom Line.

## 5. JSON-LD

`ArticleLayout` builds one `@graph` per page via `lib/article.ts`:
**BreadcrumbList**, **FAQPage** (read from the rendered FAQ), **Article**, and a
**HowTo** node on `kind: "How-To"` pages (steps read from `.step-title`).

`Organization` and `WebSite` are emitted once in `app/layout.tsx`. **Never** add
either to a page — a second copy is a duplicate.

Breadcrumb position 2 is derived from `kind`: Buying Guides, Comparisons, or
How-To Guides.

## 6. Writing standards

- **≥ 2,500 words of real prose.** Most pages run 3,200–3,900.
- **Specific over generic.** Every claim should name a measurement, a price band,
  a part number, or a trade-off. "A 2080 Ti spikes past its 250W rating" beats
  "high-end cards use a lot of power".
- **Say what is bad.** Every pick gets real cons; every Common Mistakes card
  names a concrete failure mode and its fix. The positioning is honesty.
- Plain English. No hype, no exclamation marks, no "game-changer".
- Section headings are numbered in the body and mirrored in the contents card.

## 7. Internal linking

- Always `/slug/` with the trailing slash.
- The target page must already exist in `app/`. Add the page first, or drop the
  link.
- Three Related Guides cards minimum, plus 2–4 contextual in-body links.

## 8. After the page exists

1. `npm run build` — all three validators plus Next.
2. Add the page to `lib/pages.ts` so it appears on the home page, in the footer,
   and in `app/sitemap.ts`.
3. Load it in a browser at desktop and mobile widths. A passing build does not
   mean the page looks right — wide tables need `.table-wrap` around them, and
   anything wider than the column will overflow silently.
4. After the production deploy is live: `npm run indexnow`.

## 9. Caveat worth knowing

`SocialProof` deliberately shows the page's read time and last-updated date
rather than an invented "join 12.4k readers" figure. If real analytics are ever
wired up, that component is where a measured number would go.
