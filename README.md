# PC Hardware SEO Pages

This batch adds 14 buying-guide pages to `enthusiastreview.com`, restructured to mirror the
proven format of thehonestreviewers.com's top 6 ranking pages (comparison table → product
reviews with pros/cons → buying/compatibility guide → FAQ → related links). See `TEMPLATE.md`
for the exact structure spec used for every page.

## What's here

Each folder under `content/` matches an existing enthusiastreview.com URL slug. The `index.html`
inside is the **article body only** — no site chrome — meant to be pasted directly into the
WordPress editor (Custom HTML block, or Classic Editor's "Text" tab) for that URL's existing post.

| File | Existing URL |
|---|---|
| `content/best-cpu-cooler-for-ryzen-9-3900x-and-3950x/` | /best-cpu-cooler-for-ryzen-9-3900x-and-3950x/ |
| `content/best-gpu-for-ryzen-5-2600-and-3600/` | /best-gpu-for-ryzen-5-2600-and-3600/ |
| `content/best-power-supply-psu-for-ryzen-5-2600-and-3600/` | /best-power-supply-psu-for-ryzen-5-2600-and-3600/ |
| `content/best-psu-for-rtx-2080-and-2080-ti/` | /best-psu-for-rtx-2080-and-2080-ti/ |
| `content/best-pc-cases-under-50/` | /best-pc-cases-under-50/ |
| `content/best-psu-for-ryzen-9-3900x-and-3950x/` | /best-psu-for-ryzen-9-3900x-and-3950x/ |
| `content/best-psu-for-ryzen-7-2700x-and-3700x/` | /best-psu-for-ryzen-7-2700x-and-3700x/ |
| `content/best-ram-for-ryzen-9-3900x-and-3950x/` | /best-ram-for-ryzen-9-3900x-and-3950x/ |
| `content/best-gpu-for-ryzen-9-3900x-and-3950x/` | /best-gpu-for-ryzen-9-3900x-and-3950x/ |
| `content/best-motherboard-for-ryzen-9-3950x/` | /best-motherboard-for-ryzen-9-3950x/ |
| `content/best-pc-cases-for-ryzen-3000-series/` | /best-pc-cases-for-ryzen-3000-series/ |
| `content/best-psu-under-100/` | /best-psu-under-100/ |
| `content/best-graphics-card-under-100/` | /best-graphics-card-under-100/ |
| `content/how-to-overclock-a-gpu/` | /how-to-overclock-a-gpu/ |

Each file starts with an HTML comment giving the recommended **title tag**, **meta description**,
and **primary keyword** for that page — set those in Yoast/RankMath, they aren't picked up
automatically from the HTML body.

## Before publishing — replace placeholders

- Every "Check Price on Amazon →" button links to a real, working `amazon.com/s?k=...` search
  URL, flagged with `<!-- TODO: swap for real affiliate link once available -->`. Swap these for
  your actual Associates/affiliate links before publishing — as written they earn no commission.
- Product images aren't included — add your own product photos where the review structure expects
  them (each product review is a natural spot for a right-aligned or top image).
- "Editor's Rating: X.X/5" scores are original editorial scores, not scraped Amazon data — keep
  it that way rather than presenting them as real aggregate review counts.

## Indexing new/updated pages

You mentioned a Bing IndexNow key. Once these are live on enthusiastreview.com:
1. Host the key verification file at `https://enthusiastreview.com/<your-key>.txt`, containing
   just the key on one line (requires access to the live WordPress file system — not available
   from this session).
2. Submit updated URLs with a POST to `https://api.indexnow.org/indexnow` (or `bing.com/indexnow`)
   with your key and the list of the 14 URLs above. Many SEO plugins (RankMath, Yoast) have a
   built-in IndexNow integration that automates this on publish/update — that's the simpler path
   if you're not scripting it by hand.
