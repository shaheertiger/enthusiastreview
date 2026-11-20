# enthusiastreview.com: the method to rank on Google and Bing

The site is a PC hardware buying-guide site again (it was one from 2019 to 2020). This version copies the
structure that already earns impressions on our two sister sites and keeps the Bing on-page rules this
repo already had. Schema and house rules for content: [`content-schema.md`](content-schema.md).

## 1. The evidence (Search Console, last 24 hours, 19 Nov 2026)

Impression-weighted average position by page type:

| Page type | besthometheaterreview.com | best-proteinpowder.com | Here |
|---|---|---|---|
| Comparison `/compare/a-vs-b/` | 20.0 (5 pages) | **6.7** (70 pages) | 35 pages |
| Brand review `/<brand>-review/` | **17.7** (7) | **12.1** (43) | 3 pages |
| Brand hub `/brands/<brand>/` | 28.8 (1) | **14.3** (29) | 27 pages |
| Product page `/gear/<model>/` | **19.4** (68) | 35.2 (28) | 73 pages |
| Buyer's guide `/best-x/` | 28.8 (22) | 34.1 (61) | 18 pages |
| Glossary | 38.8 | 45.1 | 24 terms |
| Tools | 27.8 | 47.7 | 2 calculators |

What it says:

1. **Specific pages rank first.** Comparisons, brand reviews, brand hubs and model pages sit on page 1–2
   within weeks; broad `/best-x/` guides take longer (positions 30–60 for head terms like "best chocolate
   protein powder", "best home theater seating"). The specific pages are what pass authority up.
2. **Exact model searches win.** "hisense u7sg review" (position 1), "svs soundbar" (9.5), model-number
   queries all land on product pages. So every product gets its own page with the model in the H1 and title.
3. **Long-tail guides win before head terms.** "best protein powder for baristas" (2), "best protein
   powder for coffee" (6.8) beat "best protein powder" (12.8). The restored 2020 URLs here are long-tail
   by nature ("best cpu cooler for ryzen 9 3900x").
4. **Glossary and tools are support pages.** They rank poorly alone but feed internal links and answer
   definitional queries; keep them, don't prioritise them.

And from this domain's own 2020 history (Semrush, Canada): `/best-pc-cases-under-50/`,
`/best-cpu-cooler-for-ryzen-9-3900x-and-3950x/`, `/best-gpu-for-ryzen-5-2600-and-3600/`,
`/best-motherboard-for-ryzen-9-3950x/`, `/best-ram-for-ryzen-9-3900x-and-3950x/`, `/best-psu-under-100/`
and `/best-psu-for-rtx-2080-and-2080-ti/` held positions 2–11. They are live again at the same URLs with
2026 content written for people who still own that hardware. The other 2020 URLs 301 to their nearest
page (`vercel.json`).

### 1b. What earns the clicks (besthometheaterreview.com, 17–19 Nov 2026, 12 clicks / 900 impressions)

| Signal | Data | What we copy |
|---|---|---|
| Clicks by page type | 6 of 12 clicks to `/gear/` model pages, 3 to `/best-x/` guides, 1 to a brand review | Model pages stay first-class: model in H1 and title |
| Queries that clicked | "hisense ax5120g", "polk signature elite es35 review", "kef ls50 wireless ii review", "svs soundbar", "polk 5.1 speaker package" | `<Model> Review: Specs, Score & Verdict (NN/100)` titles |
| Model + attribute searches | "onkyo tx-rz50 specs", "era 300 dimensions", "s90f refresh rate", "polk es20 frequency response", "s95f firmware" | Meta description leads with the spec sheet: `<Model> at a glance: <spec>, <spec>, <spec>. <verdict>`; driver/firmware H2 |
| Rich results | **Product snippets** 222 impressions (2 clicks), **Review snippet** 41 (1 click) | A full Product + Review (rating, pros/cons, ASIN as `sku`, publisher) for *every* product on a page: product pages, each pick in a guide's ItemList, both sides of a comparison (`src/lib/schema.ts`) |
| Homepage | Position 1–5 for "best home theater system for beginners / modern / premium" | Homepage keeps its "What Is the Best …?" H2 answer |
| Guide outline | Top guide (best subwoofer, 2 clicks) numbers every H2: "1. Compare the Picks at a Glance" … "18. All Subwoofers We Track" | Guide H2s carry their number (matches the On this page list) |
| Site-wide schema | Organization (`#organization`, 512 px PNG logo) + WebSite (`#website`) on every page; Article has `headline` = title, `keywords`, `articleSection`, `image`, `inLanguage` | Same, emitted by `Base.astro`; no headings before the H1 (menu labels are not headings) |

Author: the same named author as the sister site, Justin Lee (Person with `alumniOf`, `hasCredential`,
`knowsAbout`, `sameAs` LinkedIn), on every Article, Review and the `/authors/justin-lee/` ProfilePage.
Only facts from his real profile go in `src/data/authors.ts`.

## 2. Site structure (copied from the sister sites)

| Sister-site pattern | Here |
|---|---|
| Root-level buyer's guides | `/best-graphics-card/`, `/best-pc-cases-under-50/` … |
| Brand reviews at the root | `/corsair-review/`, `/msi-review/`, `/thermalright-review/` |
| `/gear/<model>/` product pages | 73 parts, each with specs, score, verdict, alternatives, compare links, FAQ, "Featured in" |
| `/compare/<a>-vs-<b>/` | 35 pairs, linked from both product pages and from guides that pick both |
| `/brands/` + `/brands/<brand>/` | 27 brand hubs |
| `/glossary/<term>/` | 24 terms, auto-linked on first mention site-wide |
| `/tools/` | Bottleneck and PSU calculators |
| `/best-of/`, `/gear/`, `/compare/` hubs | yes |

Guide skeleton (sister-site order, Bing's Short Answer first):

```
H1 (the search) · dek · byline (real git date, read time) · research disclosure
Lede: sentence 1 names the pick with numbers
Shortlist (numbered picks, label, best for, score, price)        ← not a heading
On this page                                                       ← not a heading
H2 1. <H1>: The Short Answer     (the number is part of the rendered H2, as on the sister site)     quick answer + picks table (best for / skip it if / score / price)
H2 2. Who <Brand> Is              (brand pages)
H2 3. How We Ranked These …      criteria; plainly says nothing was bench-tested
H2 4. <H1>: Our N Picks           one card per pick: key specs, skip it if, buy button, write-up, pros/cons
H2 5. Spec Sheets Side by Side
H2 6. Notable Mentions
H2 7–12. Topic sections, mostly the questions people type (92% are questions)
H2 Common Mistakes to Avoid · The Bottom Line · Frequently Asked Questions (FAQPage)
H2 Sources and Recent Updates · All <category> We Track · Head-to-Head Comparisons · Related Guides
```

## 3. Bing and Google on-page rules (kept from the previous version of this repo)

- **Titles lead with the search, 50–62 characters.** `(2026)` only on guides, brand pages and comparisons.
  Product pages: `<Model> Review: Specs, Score & Verdict`, padded with the category noun when short, plus
  ` (NN/100)` when the title still fits in 65 characters.
- **Product descriptions are generated** (`productDescription()`): `<Model> at a glance:` up to three specs,
  then the hand-written `description`, cut at a word at 158 characters.
- **Descriptions 140–158 characters, answer and a number first** ("The RTX 5070 is the best graphics card
  for most people: 12 GB, 250 W…"). The validator warns outside the range; `audit:seo` flags no-number openers.
- **First H2 is "<search>: The Short Answer"** on guides and comparisons.
- **Real dates.** `scripts/page-dates.mjs` stamps each page with the last commit that changed its JSON.
  Use the `Page-Dates: skip` trailer on mechanical commits.
- **IndexNow on every production deploy**; submit `/sitemap.xml` in Bing Webmaster Tools and Search Console.
- **One URL per search.** The validator fails two indexable guides targeting the same query.
- **Schema:** Organization + WebSite on every page; Article + BreadcrumbList + ItemList of full Product +
  Review nodes + FAQPage on guides; Product + Review + FAQPage on product pages; Article + 2-Product ItemList
  + FAQPage on comparisons; DefinedTerm on glossary pages; WebApplication on tools.
- **Markdown twins and llms.txt** for AI search (Dualmark), generated from the built HTML.

## 4. Old URLs

| URLs | Response | Why |
|---|---|---|
| `/best/*`, `/guides/*`, six `/compare/*-dehumidifier/` | **410 Gone** (middleware) | Dehumidifier pages from Nov 5–19, 2026: off-topic now |
| `/best-gpu-for-<cpu>/` (Nov 2026 bottleneck finder) | 301 → `/tools/bottleneck-calculator/` | Same intent |
| `/gpu-bottleneck-calculator/`, `/bottleneck-calculator/` | 301 → the calculator | Same intent |
| 2020 URLs not restored | 301 to the nearest guide (`vercel.json`) | Keep link equity |
| `/how-to-overclock-a-gpu/` and other 2019 how-tos | 410 | No equivalent page |

## 5. Keyword → page map (Semrush US exports, 19 Nov 2026: "graphic card", "amd", "nvidia")

Every keyword in these exports has KD 28 or under, so they are winnable. Off-topic matches (stock prices,
"amd" the eye condition, NVIDIA Shield) are ignored.

| Search (monthly US volume, KD) | Page |
|---|---|
| how to update nvidia drivers (135,000, 19); nvidia driver updates (2,900); roll back / uninstall nvidia drivers (1,900 each); download nvidia app (3,600) | `/how-to-update-nvidia-drivers/` |
| nvidia green lines on screen (14,800, 23); green dots on screen nvidia (8,100) | `/nvidia-green-lines-on-screen/` |
| amd ryzen 5 9600x vs amd ryzen 7 7800x3d (8,100, 26) | `/compare/ryzen-5-9600x-vs-ryzen-7-7800x3d/` |
| amd video cards (6,600, 21); best amd graphics card (2,900); best amd video card (1,300); best radeon gpu (1,000) | `/best-amd-graphics-card/` |
| intel vs amd (5,400); amd is better or intel (4,400); amd or intel / intel or amd (3,600 each); amd vs intel cpu (2,400) | `/amd-vs-intel/` |
| error 207 amd (5,400); amd error 182 (2,900); error 182/207 amd software (2,400 each); amd error 195 (1,600) | `/amd-software-error-182-207/` |
| good video cards (5,400, 21); best gpu (4,400, 19); best vga card for gaming (3,600, 17); top graphics cards for gaming (1,600) | `/best-graphics-card/` (title now leads with "Best GPU") |
| rx 6700 10gb nvidia equivalent (4,400, 16); 6600 xt / 9070 xt / 9060 xt nvidia equivalent (390–1,300) | `/amd-vs-nvidia-gpu-equivalents/` |
| best amd cpu for gaming (3,600); best amd cpu (3,600, 15); best amd processor for gaming (2,900); best ryzen gaming cpu (1,000) | `/best-amd-cpu-for-gaming/` |
| nvidia overlay fps n/a (3,600); how to open / turn off nvidia overlay (2,900 each); disable nvidia statistics overlay (2,400) | `/how-to-turn-off-nvidia-overlay/` |
| 14700f amd equivalent (2,900, 17) | `/intel-vs-amd-cpu-equivalents/` |
| nvidia control panel not opening (2,900) | `/nvidia-control-panel-not-opening/` |
| how to check what graphics card i have (2,900) | `/how-to-check-what-graphics-card-i-have/` |
| amd radeon rx 9060 xt vs nvidia geforce rtx 5070 (2,900, 11) | `/compare/rx-9060-xt-16gb-vs-rtx-5070/` |
| adrenalin amd (2,400); amd driver timeout (2,400); amd display driver failed to load (2,900) | `/how-to-update-amd-drivers/` |
| best nvidia graphics card (2,400, 15); best selling 50 series gpu (1,300); best 5080 graphics card (590) | `/best-nvidia-graphics-card/` |
| amd radeon rx 6600 (4,400); amd ryzen 7 5800x (4,400); 5800x3d (4,400); rx 6700 xt (3,600); ryzen 7 8700f (3,600); nvidia 4070 (2,900); rtx 4060 (2,400) | `/gear/rx-6600/`, `/gear/ryzen-7-5800x/`, `/gear/ryzen-7-5800x3d/`, `/gear/rx-6700-xt/`, `/gear/ryzen-7-8700f/`, `/gear/rtx-4070/`, `/gear/rtx-4060/` |
| amd ryzen 7 9800x3d vs intel core i9-14900k (1,600); 9950x3d vs 14900k (880) | `/compare/ryzen-7-9800x3d-vs-core-i9-14900k/`, `/compare/ryzen-9-9950x3d-vs-core-i9-14900k/` |
| nvidia vs amd / nvidia or amd / amd gpu vs nvidia (1,000–1,300) | `/nvidia-vs-amd/` |
| amd ryzen 7 9700x (4,400); 9800x3d cpu (4,400); radeon rx 9070 (3,600); nvidia 5070 ti (2,900); rtx 5060 ti 16gb (2,900); rtx 5080 graphics card (2,900) | existing `/gear/` pages |
| best gpu for 1440p / best 1440p gpu (590–720) | `/best-graphics-card-for-1440p/` (title now leads with "Best GPU for 1440p") |

Next from these exports: "graphics card repair" (1.2M, KD 27, mostly local intent: a "should you repair or
replace a GPU" article), "how to check graphics card temperature windows 11" (1,900), "how to remove graphics
card" (1,600), "how to update firmware on amd motherboard" (1,900), "best gpu for ai" (720), "best graphics
card under 300 / gpu under 500" (390–480), "best motherboard for amd ryzen 7 9800x3d" (480).

## 6. What to do next (in order)

1. **Submit** the sitemap in Search Console and Bing Webmaster Tools; request indexing for the seven restored URLs.
2. **More comparisons and brand hubs** — the best-ranking page types on both sister sites. Add pairs people
   search ("rtx 5070 vs rtx 5070 ti", "9800x3d vs 9700x", "nh-d15 g2 vs phantom spirit"). Each needs only a
   `compares.json` entry.
3. **More brand reviews** once a brand has 4+ products: NVIDIA, AMD, Lian Li, Noctua, G.Skill.
4. **More model pages** for parts people search by name (RTX 5060 Ti 8GB, RX 9060 XT 8GB, Ryzen 5 9600,
   B850 Tomahawk), each linked into a guide and a comparison.
5. **Long-tail guides** in the 2020 pattern: "best cpu cooler for ryzen 7 9700x", "best psu for rtx 5070",
   "best gpu for ryzen 7 5800x3d".
6. **Review at 4 weeks.** Position 5–20 with impressions → add answered questions and internal links.
   Page 1 with CTR under 2% → rewrite title and description.
7. **Product photos and direct links.** Set `asin` only after checking the listing is the exact model.

Check the site against the rules at any time: `npm run build && npm run audit:seo`.
