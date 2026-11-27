# What works and what doesn't (read before picking pages)

Built 27 Nov 2026 from the Bing Webmaster API (`apikey`, site `https://enthusiastreview.com/`) and Vercel
Analytics (project `enthusiastreview`, search referrers only: DuckDuckGo, Bing, Brave, Yahoo, Ecosia; Google
ignored on purpose, it sends ~4% of search visits). Window: 28 Oct to 27 Nov 2026. Re-run the numbers and
update this file when a verdict changes; the daily-publish skill (`.claude/skills/daily-publish/SKILL.md`) obeys it.

## Scoreboard by page type (30 days, search visitors from non-Google engines)

| Type | Live pages | Search visitors | Per page | Verdict |
|---|---:|---:|---:|---|
| Equivalents chart (`*-gpu-equivalents`, `*-cpu-equivalents`, `<device>-gpu-equivalent`) | 15 | ~145 | **~9.7** | **DOUBLE DOWN** |
| Brand how-to / RGB software / fix (`how-to-update-<brand>-bios`, `<brand>-rgb-software`, `how-to-turn-off-nvidia-overlay`, `nvidia-green-lines-on-screen`) | 16 | ~95 | **~6** | **DOUBLE DOWN** |
| Broad "best" pages (`best-budget-gaming-pc`, `best-nvidia-graphics-card`) | 22 | ~30 | ~1.4 | Hold: improve existing, few new |
| Comparisons (`/compare/…`) | 76 | ~85 | ~1.1 | **Only with proof** (2 pairs = 30% of it) |
| Buyer guides "best PSU / cooler / RAM / motherboard for <part>" | 18 | ~1 | ~0.05 | **STOP** |
| "Best GPU for <CPU>" | 31 | 2 | ~0.06 | **STOP** |

Top landing pages: `/amd-vs-nvidia-gpu-equivalents` 46, `/laptop-gpu-equivalents` 25, `/console-gpu-equivalents` 23,
`/asrock-polychrome-rgb-software` 22, `/how-to-update-asrock-bios` 20, `/intel-arc-gpu-equivalents` 17,
`/compare/rx-9070-xt-vs-rtx-5080` 15, `/how-to-turn-off-nvidia-overlay` 14, `/how-to-update-gigabyte-bios` 13,
`/best-budget-gaming-pc` 11, `/compare/samsung-990-pro-vs-samsung-9100-pro` 10, `/how-to-update-asus-bios` 10,
`/steam-machine-gpu-equivalent` 10.

Bing trend: impressions went from ~60/day (mid Nov) to ~3,200/day (23-25 Nov), but clicks only to ~25/day.
**Site CTR is ~0.8%.** The traffic is now limited by clicks per impression, not by page count.

## Double down (what the daily run writes)

1. **Equivalents charts.** Every new run should include at least 3. Next targets: per-device single pages
   (ROG Ally / Legion Go / MSI Claw GPU equivalent, Switch 2 GPU equivalent, Xbox Series S, PS4 / PS4 Pro),
   per-generation charts (NVIDIA old GPU equivalents, Radeon RX 7000 equivalents, mobile RTX 50 equivalents,
   Intel iGPU equivalents, Snapdragon X GPU equivalent), CPU charts (Ryzen vs Intel by generation, laptop
   CPU series). Format: copy `amd-vs-nvidia-gpu-equivalents` (chart first, one "What is the X equivalent?" H2
   per row family, reverse lookup table at the end).
2. **Brand how-tos and fixes, one brand at a time across the same task.** BIOS update / enter BIOS / RGB
   software already work for ASRock, Gigabyte, ASUS, MSI. Next: the same task for the brands not done yet
   (Biostar, NZXT, EVGA, Colorful), then new tasks for all four big brands: how to reset <brand> BIOS /
   clear CMOS, how to enable XMP/EXPO on <brand>, <brand> boot menu key, how to flash <brand> BIOS without
   CPU (BIOS Flashback), <brand> motherboard software (Armoury Crate, MSI Center, Gigabyte Control Center,
   ASRock Motherboard Utility). NVIDIA/AMD software fixes like the overlay page: turn off AMD overlay, NVIDIA
   app vs GeForce Experience, fix "NVIDIA installer failed", GPU fans not spinning.
3. **Comparisons only when Bing shows the exact pair.** A comparison is written only if the Bing query report
   has impressions for that exact "X vs Y" (either order) or a Vercel search landing on a page naming both.
   No sibling-guessing.

## Stop (rules so these mistakes are not repeated)

- **R1. No new "best GPU for <CPU>" pages.** 31 pages, 2 search visitors in 30 days; the older ones sit at
  Bing position 5-8 with 0 clicks (`/best-gpu-for-ryzen-5-5600/` 40 impr 0 clicks, `7800x3d` 23 / 0,
  `7700x` 18 / 0). "Bing still shows the old URL" is **not** enough reason to rebuild one: the step-2
  opportunity list in the skill is for other formats only. Revisit only if, after 14 days, 3+ of the
  existing pages each get 5+ search visitors.
- **R2. No new "best PSU / cooler / RAM / motherboard for <part>" buyer guides.** 18 pages, ~1 visitor.
  Same revisit test as R1.
- **R3. No batch of sibling comparisons.** 25 Nov added 16 pairs from guesses; the 30-day data shows 2 pairs
  get most compare traffic and ~45 pairs get 0-1 visitors. Max 2 comparisons per run, each backed by an
  exact-pair query (see Double down 3).
- **R4. A page type needs 14 days and 5+ live pages before it is called a winner.** Do not clone a format
  off one click (the 22 Nov GPU-for-CPU push copied a single click on the i5-11400F page into 20+ pages).
- **R5. Fix CTR before adding pages that compete.** Pages with 300+ Bing impressions and CTR under 1% get a
  title and description rewrite first (answer + number in the description, the exact query first in the
  title): `/console-gpu-equivalents` 814 impr 0 clicks, `/how-to-turn-off-nvidia-overlay` 597 / 0,
  `/asrock-polychrome-rgb-software` 1,051 / 6, `/amd-vs-nvidia-gpu-equivalents` 359. Max 3 rewrites per run,
  then wait 7 days for the next data.
- **R6. Off-topic never.** The old dehumidifier `/best/` and `/guides/` URLs are 410'd and still collect a
  handful of Bing clicks; do not bring any of them back. PC hardware only.
- **R7. Ignore Google.** Do not spend a run on Google-only keyword lists (Semrush volumes are a Google
  measure); a target needs a Bing query, a Vercel landing on a sibling, or a proven format above.
