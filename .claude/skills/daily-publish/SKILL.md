---
name: daily-publish
description: Daily publishing run for enthusiastreview.com. Pull Bing Webmaster API data and Vercel Analytics, pick the 10 pages Bing and DuckDuckGo are rewarding, write them, validate, build, push and open a PR. Use when asked to "run the daily publish", "write today's pages", or by the daily scheduled task.
---

# Daily publish: data first, then 10 pages

Bing's index serves Bing, DuckDuckGo, Yahoo and Ecosia: about 90% of this site's search visits. Every run
starts from **today's** Bing and Vercel numbers. Never write a page before both data pulls succeed; if one
fails, stop and report the error instead of guessing topics.

## 1. Branch

```bash
git fetch origin claude/pc-hardware-seo-pages-i8ihjg
git checkout -B claude/daily-publish-$(date -u +%F) FETCH_HEAD
npm ci
```

## 2. Bing Webmaster API (required)

```bash
node scripts/search-report.mjs --days 30 --json /tmp/bing-$(date -u +%F).json
```

Key: `BING_WEBMASTER_API_KEY` or `apikey` (cloud environment variable). The report lists PC queries,
pages Bing shows with their live status, and two opportunity lists:

1. **URLs Bing still shows that are not live** (301 or 410). Rebuilding these is the cheapest win: Bing already
   ranks the URL. For a `/best-gpu-for-<cpu>/` slug, add it to `LIVE_GPU_FOR` in `middleware.js`
   (otherwise it keeps 301-ing to the bottleneck calculator).
2. **"GPU for <CPU>" clusters with NO PAGE**, and any other query cluster with impressions and no page.

## 3. Vercel Analytics (required)

Vercel MCP, project `prj_XCFBhyjih4BMrkPN3YiyAw1m4Ixo`, team `team_pAoikpyeUpvHszE2JvWQKq7c`:

- `aggregate_pageviews` by `["referrerHostname"]`, last 30 days: confirms the search-engine mix.
- `aggregate_pageviews` by `["requestPath"]`, filter
  `referrerHostname in ('duckduckgo.com','bing.com','search.yahoo.com','ecosia.org','google.com','search.brave.com')`,
  limit 60, for the last 30 days and again for the last 2 days.

The winners tell you which **format** to copy (27 Nov 2026: equivalents charts ~10 search visitors per page,
brand how-tos and fixes ~6 per page; comparisons ~1 per page outside two pairs; GPU-for-CPU and PSU/cooler
buyer guides ~0, see `docs/what-works.md`). Ignore `/best/` and `/guides/` paths: those are 410'd dehumidifier pages.

## 4. Pick 10 pages

**Read `docs/what-works.md` first.** Its STOP rules (R1-R7) override everything below: no new "best GPU for
<CPU>" pages, no new "best PSU/cooler/RAM/motherboard for <part>" guides, max 2 comparisons and only for a pair
Bing actually shows, CTR rewrites before new competing pages. If today's data changes a verdict, update that
file in the same PR and say why.

Order of priority, skipping any slug that already exists in `src/data/guides/` (or pair in `compares.json`):

1. **CTR rewrites (R5):** up to 3 pages with 300+ Bing impressions and CTR under 1%; they count toward the 10.
2. **Equivalents charts:** at least 3 (targets listed in `docs/what-works.md`).
3. **Brand how-tos and fixes:** at least 3, same task across the next brand, or a new task across the four big
   board brands.
4. Query clusters from the Bing report with no page, **only if** the format is not on the STOP list.
5. Up to 2 comparisons backed by an exact-pair Bing query.

Opportunity list 1 (URLs Bing shows that are not live) is used only for formats not on the STOP list: do not
rebuild `/best-gpu-for-<cpu>/` URLs from it.

PC hardware only. Write the 10 picks and the numbers behind each into the PR description.

## 5. Write

Follow `docs/content-schema.md` (house rules: no testing claims, no invented benchmarks, price bands) and
copy the structure of the closest existing page of the same kind:

| Kind | Model page |
|---|---|
| GPU for a CPU | `src/data/guides/best-gpu-for-ryzen-5-9600x.json` |
| Equivalents chart | `src/data/guides/intel-arc-gpu-equivalents.json` (slug must end in `-equivalents`) |
| How-to | `src/data/guides/how-to-update-asrock-bios.json` |
| Comparison | an entry in `src/data/compares.json` |
| Brand page | `src/data/guides/is-pny-a-good-gpu-brand.json` |

Only use product ids that exist in `src/data/products/`; only link pages that exist. Parallel subagents (one
or two pages each) are fine: give each the schema doc, the model page and the real Bing queries for its page.

## 6. Check

```bash
node scripts/validate-content.mjs
npm run build          # page dates, validate, astro build, Markdown twins
npm run audit:seo
```

Fix every error. Spot-check one built page in `dist/`.

## 7. Log, commit, PR

- Add a dated row to `docs/daily-log.md`: date, Bing impressions/clicks (last day and 30 days), top Vercel
  search landing pages, the 10 pages written.
- Push only when all 10 pages are written and validate, build and audit pass. Then commit, push the branch,
  open a PR into `claude/pc-hardware-seo-pages-i8ihjg` titled
  `Daily publish YYYY-MM-DD: 10 pages from Bing + Vercel data`, and merge it: the site owner asked (22 Nov
  2026) for the daily run to merge its own PR once everything passes. If any check fails and can't be fixed,
  push nothing and report why.
