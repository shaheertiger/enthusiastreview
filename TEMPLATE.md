# EnthusiastReview Content Template

This file defines the shared structure every new page must follow. It was reverse-engineered
from the top 6 ranking pages on thehonestreviewers.com (home-improvement niche) and adapted for
the PC hardware niche on enthusiastreview.com. Follow it closely — the whole point is to mirror
the SEO structure that is already proven to rank.

## Site identity to use consistently

- Site/brand name: **EnthusiastReview**
- Author persona (use for every "listicle" page unless told otherwise): **Marcus Chen, PC Hardware Editor**
- Author persona for the how-to guide: same author is fine
- Tone: confident, specific, practical — written for PC builders who already own the CPU/GPU in
  the title and need a compatible part. Avoid generic filler. Avoid fabricated lab-testing claims
  ("we tested this for 6 months in our lab") since that isn't true — instead frame authority as
  research/comparison based on specs, compatibility data, and aggregated buyer feedback, e.g.
  "We compared every cooler compatible with the 3900X and 3950X's AM4 socket and 105W/140W TDP,
  weighing thermal performance, noise, and price."

## File format

Each page is a single HTML file containing ONLY the article body (no `<html>`/`<head>`/nav/footer
chrome — this gets pasted into the WordPress editor as the post content). Start the file with an
HTML comment block containing SEO metadata, then the article body.

```html
<!--
SEO METADATA
Title Tag: <60-70 char title, pattern: "N Best [Product] in 2026 ([Compatibility]) | EnthusiastReview">
Meta Description: <150-160 chars, includes primary keyword + benefit>
URL Slug: <matches the existing URL exactly>
Primary Keyword: <the keyword we're targeting>
-->

<article>
  ...
</article>
```

## Structure for a "Best X" listicle page (most pages)

1. **H1**: "The N Best [Product] for [Platform] in 2026" (match existing URL's implied topic)
2. **Byline line**: `Marcus Chen, PC Hardware Editor · Updated [Month] 2026`
3. **Intro** (150-250 words): state the compatibility problem plainly (e.g. "The Ryzen 9 3900X
   and 3950X run hot under load — a weak cooler bottlenecks boost clocks"), promise the guide's
   value, mention how many products compared and the criteria (compatibility, performance/value,
   price).
4. **Quick comparison table** ("At a Glance"): 5-7 rows (one per product), columns tailored to
   category (see per-page brief), so skimmers get the answer in 5 seconds.
5. **Table of Contents**: anchor links to each H2 below.
6. **"Types of [Product]" section (H2)**: 3-4 H3 subsections explaining the category so the
   reader can self-select, matching the educational-but-brief tone of the reference pages.
7. **"Our N Top Picks" (H2)**: the main reviews. For EACH product:
   - H3 heading: `#N. [Product Name] — Best [Positioning, e.g. "Best Overall"]`
   - `Editor's Rating: X.X/5` (do NOT claim a specific fake review count as real Amazon data —
     this is our own editorial score)
   - 150-250 word narrative: what it does well, key specs, who it's for
   - **Pros** bulleted list (4-5 items)
   - **Cons** bulleted list (2-3 items)
   - **Bottom Line**: one bold sentence
   - CTA: `[Check Price on Amazon →](https://www.amazon.com/s?k=<url-encoded exact product name>)`
     (a real, working Amazon search link — not a fake affiliate ID; mark with an HTML comment
     `<!-- TODO: swap for real affiliate link once available -->` right after it)
8. **Buying/compatibility guide (H2)** with 4-6 H3 steps or considerations specific to the
   category (e.g. socket/TDP compatibility, wattage headroom, clearance, form factor).
9. **A second guide section (H2)**: category-specific — e.g. installation tips, common mistakes,
   or a compatibility comparison table. Include one callout-style bolded tip box.
10. **FAQ (H2)**: 6-8 Q&As, each H3 question + 60-120 word answer, written to directly match
    "People Also Ask"-style queries for the keyword.
11. **Related Guides (H2)**: 3 links to other EnthusiastReview pages (relative links like
    `/best-psu-for-ryzen-9-3900x-and-3950x/`) — the specific related slugs are given in each
    page's brief below.
12. **Bottom Line closing paragraph** (80-120 words) reiterating the top pick.

Target length: **3,000-4,500 words** for listicles.

## Structure for the how-to / informational page (how-to-overclock-a-gpu only)

Mirror the "How Much Does It Cost to Seal a Driveway" reference page's informational-guide shape
instead of a listicle:
1. H1 stating the topic plainly with a year, e.g. "How to Overclock a GPU: The Complete 2026 Guide"
2. Intro summarizing the expected outcome/risk up front
3. A comparison table (e.g. overclocking software tools: MSI Afterburner vs EVGA Precision X1
   vs AMD Adrenalin vs NVIDIA app — columns: GPU brand support, key features, ease of use)
4. Numbered step-by-step H2/H3 walkthrough (prep → core clock → memory clock → voltage/power
   limit → stability testing → cooling/thermals)
5. A safety/warning callout section (voiding warranty, thermal limits, incremental testing)
6. FAQ (H2), 5-7 Qs
7. Related Guides section linking to: /best-graphics-card-under-100/, /best-gpu-for-ryzen-9-3900x-and-3950x/, /best-gpu-for-ryzen-5-2600-and-3600/
8. Closing summary

Target length: 3,500-4,500 words.

## Research guidance

Use WebSearch briefly (2-4 queries) to ground product picks in real, currently-available 2026
hardware. Prioritize well-known brands appropriate to category: Noctua, be quiet!, Corsair,
Cooler Master, NZXT, Arctic (coolers); Corsair, EVGA, Seasonic, be quiet!, Cooler Master, Thermaltake
(PSUs); Fractal Design, NZXT, Corsair, Cooler Master, Lian Li, Montech (cases); G.Skill, Corsair,
Kingston, Crucial (RAM); ASUS, MSI, Gigabyte, ASRock (motherboards, GPUs); NVIDIA/AMD GPU model
lines appropriate to the price tier and era compatibility implied by the page topic. Keep specs
plausible and internally consistent (wattage, TDP, socket, clearance in mm, etc.) — do not invent
absurd numbers.

## Output

Write the finished file to the exact path given in your brief. When done, reply with just the
file path and final word count — nothing else.
