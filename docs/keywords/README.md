# Keyword research exports

Raw Semrush exports for picking new pages. Nothing in the build reads these files.

All files: Semrush broad match, US database, exported 24 Nov 2026. Columns: Keyword, Intent, Volume, Keyword
Difficulty, CPC (USD), SERP Features.

| File | Seed | Rows |
|---|---|---|
| `semrush-gpu-broad-match-us-2026-11-24.csv` | gpu | 30,003 |
| `semrush-best-gpu-broad-match-us-2026-11-24.csv` | best gpu | 919 |
| `semrush-best-cpu-broad-match-us-2026-11-24.csv` | best cpu | 1,335 |
| `semrush-best-graphics-card-broad-match-us-2026-11-24.csv` | best graphics card | 1,219 |

How to use them: combine with the daily Bing Webmaster report (`scripts/search-report.mjs`), which shows what
Bing already ranks. Filter for KD under 30, check that no page in `src/data/guides/` or pair in `compares.json`
covers the keyword, and prefer formats that already win (equivalents charts, GPU-for-CPU, comparisons,
brand how-tos). Rows with an empty KD are long-tail queries Semrush didn't score. Many "what is the best gpu
for <cpu>" rows map straight onto `/best-gpu-for-<cpu>/` pages.

```bash
python3 -c "import csv,sys;r=[x for x in csv.DictReader(open(sys.argv[1])) if x['Keyword Difficulty'] and int(x['Keyword Difficulty'])<30];r.sort(key=lambda x:-int(x['Volume']));[print(x['Volume'],x['Keyword Difficulty'],x['Keyword']) for x in r[:50]]" docs/keywords/semrush-gpu-broad-match-us-2026-11-24.csv
```
