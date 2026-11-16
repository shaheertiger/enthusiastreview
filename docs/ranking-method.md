# enthusiastreview.com: the method to rank on Google and Bing

This is the treadmillreviewsusa.com ranking method, adapted to this site: 212 dehumidifier
guides (210 indexable) in `src/content/pages/`, one Astro template (`src/components/Article.astro`),
and Amazon affiliate links. Sections 1–6 say what the rule is, what was done here, and what's left.
Sections 7–10 are the working loop.

**Data used:** the site's own content and build output. Data still missing:
- **Semrush:** the account's API units balance is zero, so no keyword export was pulled.
- **Bing Webmaster Tools:** no page or keyword reports were supplied.
- **Google Search Console:** no export was supplied.

The volume and KD columns in section 7 are blank until those exports exist. Fill them in
before trusting the order of the list.

Check the site against the rules at any time:

```bash
npm run build && npm run audit:seo
```

---

## 0. The diagnosis in one paragraph

The site doesn't need more pages. It has a page for nearly every dehumidifier search worth
winning (rooms, sizes, brands, problems, fixes). What held it back on Google were the same five
problems as the treadmill site:

1. **Pages competing for the same search**, e.g. Wi-Fi vs. smart, sleeping vs. bedroom, ducted vs.
   whole-house, and basement and musty-smell titles that both said "musty smells".
2. **Every page reading the same.** About 180 pages used the same three headings ("X, by the
   numbers", "How we pick X", "What to look for in X") and the same disclosure and trust paragraph.
3. **Descriptions that listed topics instead of answering.** 124 of 217 had no number in the
   first clause.
4. **Spec-based copy with a testing-flavoured label** ("Performance:").
5. **Off-topic pages** (Amazon Prime, hearing-aid dryers).

All five are fixed at the site level (see the git log on this branch). What remains is
page-by-page work: depth, original visuals, first-hand evidence and internal links from pages
that already rank.

---

## 1. Site-level fixes

### 1a. One URL per search (done)

| Search | Was | Now | Redirect |
|---|---|---|---|
| smart / Wi-Fi dehumidifier | `best-smart-dehumidifier`, `best-wifi-dehumidifier` | `best-smart-dehumidifier` (title covers Wi-Fi, Alexa, app) | wifi → smart |
| dehumidifier for bedroom / sleeping | `best-dehumidifier-for-bedroom`, `best-dehumidifier-for-sleeping` | `best-dehumidifier-for-bedroom` ("Quiet Picks for Sleep") | sleeping → bedroom |
| dehumidifier for apartment / condo | `…-for-apartment`, `…-for-condo` | `…-for-apartment` (with the condo HOA, insurance and drain-line section) | condo → apartment |
| gun safe / gun cabinet dehumidifier | `…-for-gun-safe`, `…-for-gun-cabinet` | `…-for-gun-safe` ("Safe & Gun Cabinet Picks") | gun cabinet → gun safe |
| whole house / ducted dehumidifier | `best-whole-house-dehumidifier`, `best-ducted-dehumidifier` | `best-whole-house-dehumidifier` ("Ducted & HVAC Picks") | ducted → whole house |

The merged page took the other page's unique sections, FAQs and products. The 301s live in
`vercel.json`, for both the HTML URL and its `.md` twin, and point straight at the final
`https://www.` URL so there's no extra redirect hop. Internal links were rewritten to the kept URLs.

Pages that overlapped but serve **different products** were kept and **retitled** so each owns
one search:

| Pair | Split |
|---|---|
| large room vs. heavy duty | large room = 50-pint home units; heavy duty = 100- to 240-pint |
| industrial vs. heavy duty vs. commercial vs. LGR vs. water damage | industrial = restoration-grade; commercial = job sites; LGR = the technology; water damage = flood cleanup |
| basement vs. musty smell | basement no longer says "mold & musty smells" |
| allergies vs. asthma | allergies no longer says "and asthma" |
| warehouse vs. industrial | warehouse no longer leads with "industrial" |
| small vs. mini vs. closet | small = compact units for small rooms; mini = tiny/cordless; closet = closets |

**Guard rail:** `npm run validate` now fails the build if two indexable pages target the same
search (the title up to "(2026)", ":" or "?", or the page's `query` field). `audit:seo` reports
duplicate titles.

**Next candidates to watch** once Search Console data exists (merge only if Google shows both
URLs for the same queries):
- `best-dehumidifier-with-pump` vs. `best-50-pint-dehumidifier-with-pump`
- `best-crawl-space-dehumidifier` vs. `best-encapsulated-crawl-space-dehumidifier`
- `best-quiet-dehumidifier` vs. `best-dehumidifier-for-nursery`
- `best-dehumidifier-for-drying-room` vs. `best-grow-room-dehumidifier`

### 1b. Off-topic pages (done)

`is-amazon-prime-worth-it` and `best-dehumidifier-for-hearing-aids` carry `"noindex": true`.
The flag keeps the page live for visitors (`noindex, follow`) but leaves it out of:
- the sitemap, hubs, menus, related links and autolinks
- `llms.txt` and the Markdown twins

Use the same flag for any future page that isn't about dehumidifiers or indoor humidity.

Kept on purpose, because each one answers a humidity problem: camera dry cabinets, the pest
pages, car and boat pages, and moisture absorbers.

### 1c. The template fingerprint (done at template level)

- **Disclosure, byline method line and trust box** now depend on page type and topic, and
  rotate between wordings (`src/data/page-copy.mjs`). Each method line says what that page type
  is actually based on.
- **Repeated headings:** 169 "X, by the numbers" sections became the Short Answer block
  (section 4). 360 "How we pick X", "What to look for in X" and "How to choose X" headings now
  use several wordings, most of them questions. Anchors are unchanged.

**Still to do, page by page:** a unique lede, a Common Mistakes section and a bottom line
written for that page. The skeleton is the same everywhere, and that's fine; repeated sentences
are the problem.

### 1d. Honesty signals (done)

- Product cards say "What the ratings show:" instead of "Performance:".
- The trust box says plainly that the machines weren't lab-tested and that every figure is
  attributed.
- `validate-content.mjs` still fails any page that claims hands-on testing.

If you get hands-on time with any machine, that page becomes the site's flagship (section 5B).

---

## 2. Page types on this site

Every page is one of these. `pageType()` in `src/data/page-copy.mjs` assigns it automatically.

| Type | Here | Examples | Count |
|---|---|---|---|
| **A. Question / number answer** | `guides/`, Buying Advice | `dehumidifier-size-guide`, `how-much-electricity-does-a-dehumidifier-use`, `how-long-do-dehumidifiers-last` | ~15 |
| **B. Model review** | none yet | — the biggest gap; see 5B | 0 |
| **C. Brand guide** | `best/`, Brands | `best-midea-dehumidifier`, `best-alorair-dehumidifier` | 49 |
| **D. Buyer's guide (roundup)** | `best/`, every other category | `best-dehumidifier-for-basement`, `best-50-pint-dehumidifier` | ~125 |
| **E. Problem / fix** | `guides/`, How-To & Fixes | `dehumidifier-not-collecting-water`, `dehumidifier-freezing-up` | 9 |
| **F. X vs Y** | `compare/` and `guides/*-vs-*` | `midea-vs-frigidaire-dehumidifier`, `dehumidifier-vs-air-conditioner` | 9 |
| **G. Store page** | `best/`, Retailers | `best-costco-dehumidifier`, `best-walmart-dehumidifier` | 4 |

---

## 3. The snippet: title, description, URL (done; keep it that way)

### Title: the exact search first, 50–62 characters

| Type | Formula | Example on the site |
|---|---|---|
| A | `<Exact question>? <the answer in brief>` | `How Long Do Dehumidifiers Last? 5–10 Years, by Type` |
| C | `Best <Brand> Dehumidifier (2026): <models or verdict>` | `Best Midea Dehumidifier (2026): Cube, 35-Pint & Pump Models` |
| D | `Best <exact search> (2026): <how ranked or what's special>` | `Best Dehumidifier for Basement (2026): Pump & Low-Temp Picks` |
| E | `<Problem>? <the fix promise>` | `Dehumidifier Not Collecting Water? 6 Causes and Easy Fixes` |
| F | `<X> vs. <Y> (2026): <which to buy, in brief>` | `Haier vs. GE Dehumidifier (2026): Same Owner, Which to Buy?` |
| G | `Best <Store> Dehumidifier (2026): <what's worth buying>` | `Best Walmart Dehumidifier (2026): 5 Brands Worth Buying There` |

Rules:
- Use the **highest-volume wording** from the keyword export. Until there's an export, use the
  wording people type ("dehumidifier for basement", not "basement moisture control unit").
- **(2026)** goes only on C, D, F and G. Update it on 1 January, and only on pages you actually
  rechecked.
- Never use "Tested" unless the machine was physically tested.
- The ` | Enthusiast Review` suffix is added automatically only when the title stays within 65
  characters, so at 50–62 it's normally left off.

### Meta description: 140–158 characters, answer first

The first clause is the answer, with a number: the pick and its capacity, the humidity target,
the cost or the size. Examples now live on the site:

- **size guide:** "Most spaces up to 1,000 sq ft need 20–30 pints a day; 1,000–2,000 sq ft needs 25–50, by
  dampness…"
- **basement:** "A 50-pint unit suits most basements; the Midea Cube 50 is our top pick with a 4.35-gallon tank…"
- **freezing up:** "Most dehumidifiers ice up below about 60–65°F or with a dirty filter. Frost that clears in
  20–30 minutes is normal…"

A yes/no answer ("No. Dehumidifier water isn't distilled…") also counts. `audit:seo` lists any
description whose first clause has no number. Three pages are flagged because their answer is
qualitative (smoke smell, how a dehumidifier works, disposal), and that's acceptable.

### URL

Don't change existing URLs to match a new title; retitle instead. Change a URL only when merging,
and add a 301 in `vercel.json` (HTML and `.md`).

---

## 4. The page skeleton (implemented in the template)

```
H1          The search, plain                                    page.h1
Dek         One sentence                                          page.dek
Byline      Author · "Updated <real git date>" · method note      methodNote(page)
Disclosure  Page-specific                                         disclosure(page)

H2 1        "<Search>: The Short Answer"                          shortAnswerHeading(page)
            Verdict in 1–2 sentences                              page.topPicksLead
            One scannable block (stats row + one paragraph)       page.shortAnswer
            The picks list (types C, D, F, G)                     page.products

Hero, lede  40–70 words ideally; sentence 1 = the answer          page.intro
Product cards (C, D, F, G)
H2 2–8      Each H2 = a question people search                    page.sections
H2          Common Mistakes (5, page-specific)                    ← not on any page yet
H2          Frequently Asked Questions (6–8, FAQPage schema)       page.faqs
H2          The Bottom Line                                       last section
Box         Why trust / sources (page-specific)                   trustBox(page)
            Related guides                                         related + automatic
```

**Gaps against the method** (from the content as it stands):

| Rule | Now | Target |
|---|---|---|
| Common Mistakes section | 1 page | every page, 5 page-specific mistakes of 40–60 words |
| Question H2s | 37% of topic headings | most of them (`audit:seo` prints the share) |
| Length | roundups: median 1,660 words; guides: 1,220 | D: 3,500–6,000; A, E, F: 2,500–4,000. Add answered questions, not padding |
| FAQs | 19 pages have 5 | 6–8 |
| Lede | narrative intros | sentence 1 answers; 40–70 words |
| Original visual | product photos only | one chart or diagram per page (size chart, humidity chart, wattage chart, placement diagram) with alt text |
| Author | "The Home Air Desk" (an organisation) | a real, named author with credentials and a profile in `src/data/authors.ts` |

---

## 5. Required blocks by page type

### A. Question / number answer
- The number in the description, the Short Answer and the lede.
- One **original table or calculator**: pints by square footage and dampness, watts and monthly
  cost by size, lifespan by type, humidity targets by room.
- A link to the roundup that a person with this question needs next, e.g. size guide →
  `best-dehumidifier-for-basement`.

### B. Model review (new page type; the biggest Google opportunity)
The site has no single-model reviews. The treadmill data showed reviews are where Google most
rewards first-hand evidence. Start with the models the site recommends most often:

| Model | Featured on (guides) | Suggested URL |
|---|---|---|
| Midea Cube 50 (MAD50S1QWT) | 42 | `/reviews/midea-cube-50-review/` |
| Midea Cube 20 | 39 | `/reviews/midea-cube-20-review/` |
| AlorAir Sentinel HDi65S | 29 | `/reviews/alorair-sentinel-hdi65s-review/` |
| hOmeLabs HME1003 | 24 | `/reviews/homelabs-hme1003-review/` |
| Midea Cube 35 | 24 | `/reviews/midea-cube-35-review/` |
| Frigidaire FFAP5033W1 | 19 | `/reviews/frigidaire-ffap5033w1-review/` |
| AlorAir Storm LGR Extreme | 16 | `/reviews/alorair-storm-lgr-extreme-review/` |

Each review needs:
- **Short Answer:** the verdict, "Buy it if… / Skip it if…" and the price band.
- **Spec table** from the manufacturer and ENERGY STAR: DOE 2019 pints, AHAM pints for
  LGRs, coverage, tank size, pump lift, minimum operating temperature, IEF (L/kWh), noise, warranty
  by component. Name the source and the date checked.
- **Question H2s:**
  - "Is the <Model> Big Enough for a Basement?"
  - "How Loud Is the <Model>?"
  - "Does the <Model> Work in a Cold Basement?"
  - "What Does It Cost to Run?"
  - "What Do Owners Complain About?"
  - "Warranty: What It Actually Covers"
  - "<Model> vs. <rival>"
  - "Who Should Buy It, and Who Should Skip It?"
- **The Google upgrade: first-hand evidence.** Your own photos, a measured noise reading, a
  measured watt draw (a $20 plug meter), pints collected in a week, a timed setup. Label it clearly
  ("Measured by <author> on <date>").

Adding a `reviews` section needs a new route folder (`src/pages/reviews/[slug].astro`) and a
`SECTIONS` entry in `src/data/site.ts`. It's a small change, but make it with the first real review.

### C. Brand guide
- A lineup table: model, pints (DOE 2019), pump, coverage, warranty, ENERGY STAR status.
- Verdict H2s: "Is <Brand> a Good Dehumidifier Brand?", "Where Are <Brand> Dehumidifiers Made?",
  "<Brand> Warranty and Recalls", "Best <Brand> Dehumidifier for a Basement".
- Link to the X-vs-Y page for that brand (the template does this automatically under "Head-to-head").

### D. Buyer's guide (roundup)
- The real number of picks in the title when you add one ("5 Picks"). Vary it; don't make every
  list 5.
- A quick comparison table first: the spec that matters for this guide. That's the minimum
  temperature for garages, pump lift for basements, dB for bedrooms and cubic feet for closets.
- A method section that says exactly what was and wasn't done (the "How we…" sections already do).
- The niche-specific questions as H2s, e.g. "How Cold Can a Garage Dehumidifier Run?"

### E. Problem / fix
- The Short Answer is the most likely cause and its fix (done for all 9).
- Numbered steps, causes in order of likelihood, each an H2 phrased as the symptom.
- A safety box (unplug first; refrigerant isn't a DIY repair) and "when to call a tech" with
  typical costs.

### F. X vs Y
- A side-by-side table in the first screen (the template renders it under "Side by side").
- The Short Answer is "Pick X if…, pick Y if…" (done).
- Each difference as a question H2, e.g. "Which Has the Longer Warranty?"

### G. Store page
- What the store actually stocks, delivery and returns, and price match, all sourced from the
  store with the date checked.
- 3–5 picks.

---

## 6. Google vs. Bing: what each needs on top

**Both (in place):**
- Article, FAQPage, BreadcrumbList and ItemList schema
- Self-canonicals and trailing slashes
- Real git dates (`scripts/page-dates.mjs`)
- A sitemap with product images

**Google adds:**
1. **One URL per search.** Done (1a), and guarded by the validator.
2. **Evidence of experience.** Model reviews with measurements (5B) and a named author. This is the
   largest remaining gap.
3. **Topical focus.** Done (1b).
4. **Unique writing per page.** Template-level done (1c); ledes and Common Mistakes still to write.
5. **Real freshness.** Recheck prices, stock and discontinued models monthly on C, D and G pages.
   The "Updated" date moves only when the JSON changes, so never edit a file just to bump it.
6. **Internal links from pages that already rank.** Needs Search Console or Bing data to know
   which pages those are (section 8, step 7).
7. **Specific before broad.** "best dehumidifier" and "best dehumidifier for basement" take months.
   Win the specific searches first; they pass authority up.

**Bing adds:**
- The answer in the description (done).
- The exact query in the title, H1 and the Short Answer H2 (done).
- IndexNow on every production deploy (in place) and the sitemap submitted in Bing Webmaster Tools.
  Confirm the site is verified: there's no `msvalidate.01` tag unless `PUBLIC_BING_SITE_VERIFICATION`
  is set.

---

## 7. Keyword → page map (fill in volume and KD first)

These pages already own the search; most need the **section 4 gaps** closed, not a new page.
Run a Semrush export (US, filter on "dehumidifier") and fill in the volume and KD columns. Then
work the KD ≤ 40 rows first, highest volume first.

| # | Search | Owner page | Volume | KD | Next action |
|---|---|---|---|---|---|
| 1 | what size dehumidifier do I need | `guides/dehumidifier-size-guide` | | | Chart as an image; calculator; Common Mistakes |
| 2 | how much electricity does a dehumidifier use | `guides/how-much-electricity-does-a-dehumidifier-use` | | | Wattage chart image; measured plug-meter reading |
| 3 | dehumidifier not collecting water | `guides/dehumidifier-not-collecting-water` | | | Symptom H2s; "when to call a tech" with costs |
| 4 | dehumidifier freezing up | `guides/dehumidifier-freezing-up` | | | Symptom H2s; temperature diagram |
| 5 | best dehumidifier for basement | `best/best-dehumidifier-for-basement` | | | Long-term target; link in from 1–4 |
| 6 | best crawl space dehumidifier | `best/best-crawl-space-dehumidifier` | | | Comparison table by min. temp and pump lift |
| 7 | best dehumidifier with pump | `best/best-dehumidifier-with-pump` | | | Check overlap with the 50-pint pump page |
| 8 | best 50 pint dehumidifier | `best/best-50-pint-dehumidifier` | | | Question H2s; Common Mistakes |
| 9 | best 70 pint dehumidifier | `best/best-70-pint-dehumidifier` | | | Explain "70-pint" vs. DOE 2019 in the Short Answer |
| 10 | best quiet dehumidifier | `best/best-quiet-dehumidifier` | | | dB table first |
| 11 | best dehumidifier for bedroom | `best/best-dehumidifier-for-bedroom` | | | Check the merged sleep section reads naturally |
| 12 | best dehumidifier for garage | `best/best-dehumidifier-for-garage` | | | Minimum-temperature table first |
| 13 | best small dehumidifier | `best/best-small-dehumidifier` | | | Size table: cu ft vs. pints |
| 14 | best whole house dehumidifier | `best/best-whole-house-dehumidifier` | | | Installed-cost table; link to the installation guide |
| 15 | best smart dehumidifier | `best/best-smart-dehumidifier` | | | App, Alexa and Google feature table |
| 16 | best energy efficient dehumidifier | `best/best-energy-efficient-dehumidifier` | | | IEF chart image |
| 17 | best desiccant dehumidifier | `best/best-desiccant-dehumidifier` | | | Compressor vs. desiccant by temperature chart |
| 18 | best midea dehumidifier | `best/best-midea-dehumidifier` | | | Brand blocks (5C) |
| 19 | best frigidaire dehumidifier | `best/best-frigidaire-dehumidifier` | | | Brand blocks (5C) |
| 20 | best hOmeLabs dehumidifier | `best/best-homelabs-dehumidifier` | | | Brand blocks (5C) |
| 21 | midea vs frigidaire dehumidifier | `compare/midea-vs-frigidaire-dehumidifier` | | | Difference H2s as questions |
| 22 | dehumidifier vs air purifier | `guides/dehumidifier-vs-air-purifier` | | | Answer in sentence 1 (done); a table |
| 23 | does a dehumidifier help with mold | `guides/does-a-dehumidifier-help-with-mold` | | | Health caveat; link to black mold |
| 24 | where to place a dehumidifier | `guides/where-to-place-a-dehumidifier` | | | Placement diagram (original visual) |
| 25 | midea cube 50 review | **new:** `reviews/midea-cube-50-review` | | | Type B with measurements (5B) |

Re-run the match every month: sort a fresh export by volume, keep KD ≤ 40, and check
`src/content/pages/` for an owner page before creating anything. The validator refuses a second
page targeting the same search.

---

## 8. The workflow for every page

1. **Pick the search** from section 7. Confirm no other page targets it (`npm run validate` will
   tell you).
2. **Collect the questions** from the keyword export filtered by the head term, Google's "People
   also ask" and the Bing keyword report. These become the H2s and FAQs.
3. **Collect the facts** from:
   - the ENERGY STAR product finder (DOE 2019 pints, IEF)
   - manufacturer manuals and spec pages
   - CPSC recalls
   - store pages
   - owner reviews (summarise, attribute, don't invent)

   Note each source and the date checked.
4. **Write the snippet first** (section 3) and the Short Answer (`topPicksLead`). If you can't put
   the answer and a number in the description, you don't know the answer yet.
5. **Write to the skeleton** (section 4) and the type blocks (section 5). Add a Common Mistakes
   section and bring FAQs to 6–8.
6. **Add the original visual** and any first-hand evidence.
7. **Link it** from its hub, from 2+ pages that already get impressions (add them to those pages'
   `related` or link in body copy), and out to 2–4 siblings. Use the exact search as anchor text at
   least once.
8. **Publish.** A production deploy pings IndexNow automatically. Then request indexing in Search
   Console (URL Inspection).
9. **Review at 4 weeks.** Position 5–20 with impressions → strengthen the page with more answered
   questions and more internal links. Page 1 with CTR under 2% → rewrite the title and description.

## 9. Pre-publish checklist

- [ ] One page type (A–G); `npm run validate` passes (no other page targets this search)
- [ ] Title 50–62 characters, highest-volume wording first; "(2026)" only on C, D, F, G
- [ ] Description 140–158 characters; first clause = the answer, with a number
- [ ] `topPicksLead` answers the search in 1–2 sentences; `shortAnswer` has one stats or table block
- [ ] Every other H2 is a searched question
- [ ] No testing language unless testing happened (the validator checks)
- [ ] Sourced spec table (C, D, F) with the date checked
- [ ] One original visual with alt text
- [ ] Unique lede, Common Mistakes (5), 6–8 FAQs, bottom line; a health or safety caveat where relevant
- [ ] Internal links: hub, 2+ ranking pages in, 2–4 siblings out, trailing slashes
- [ ] `npm run build && npm run audit:seo` is clean for the page; schema validates in the Rich
      Results Test
- [ ] Production deploy (IndexNow) and Request Indexing

## 10. Order of work from here

| Week | Do |
|---|---|
| 0 (done) | Merges and 301s; noindex off-topic; Short Answer H2 on every page; template boilerplate varied; repeated headings reworded; all titles and descriptions to the snippet rules |
| 1 | Get the data: a Semrush export, the Bing Webmaster page and keyword reports, a 3-month Search Console export (Pages.csv + Queries.csv). Fill section 7. Add a real named author |
| 2 | Common Mistakes + 6–8 FAQs + answer-first lede on the top 20 pages by impressions |
| 3–4 | Section 7 rows 1–12 to the full skeleton, with original chart images on the chart pages (size, electricity, humidity by room, placement) |
| 5–6 | Rows 13–24; the first model review with measurements (5B) |
| Then | Monthly: fresh export → section 7; the 4-week review loop (section 8, step 9); recheck prices and discontinued models on C, D and G pages |
