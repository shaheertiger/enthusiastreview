# Daily publish log

One row per run of the daily-publish skill (`.claude/skills/daily-publish/SKILL.md`). Bing numbers from the
Bing Webmaster API (`scripts/search-report.mjs`), search landing pages from Vercel Analytics.

| Date | Bing (last day / 30 days) | Top search landing pages (Vercel, 30 days) | Pages written |
|---|---|---|---|
| 2026-11-22 | 1,826 impr / 12 clicks on 21 Nov (Bing's best day so far; 496 the day before) · 16 old `/best-gpu-for-<cpu>/` URLs still shown while 301'd | Vercel 30 days: DuckDuckGo 86, Bing 57, Yahoo 8, Ecosia 6, Google 6 visitors. Top: `/compare/rx-9070-xt-vs-rtx-5080` 7, `/amd-vs-nvidia-gpu-equivalents` 6, `/console-gpu-equivalents` 5, `/how-to-update-asrock-bios` 5, `/intel-arc-gpu-equivalents` 4 | Rebuilt from Bing: best GPU for Ryzen 5 5600 (40 impr), 7800X3D (23), 7700X (18), i5-11400F (10, 1 click), 7600 (5), 5500 (5), i5-13400F (4). From Vercel winners: how to update MSI BIOS, how to update Gigabyte BIOS, Apple M-series GPU equivalents |
| 2026-11-22 (run 2) | 1,826 impr / 12 clicks on 20 Nov · 30 days: 3,792 impr / 45 clicks. 9 `/best-gpu-for-<cpu>/` URLs still shown by Bing while 301'd | Vercel 30 days: DuckDuckGo 102, Bing 71, Yahoo 9, Ecosia 8, Google 6 visitors. Last 2 days: `/asrock-polychrome-rgb-software` 8, `/compare/rx-9070-xt-vs-rtx-5080` 6, `/console-gpu-equivalents` 6, `/how-to-update-asrock-bios` 5, `/amd-vs-nvidia-gpu-equivalents` 5 | Rebuilt from Bing (added to `LIVE_GPU_FOR`): best GPU for Core Ultra 7 265K (6 impr), Ryzen 7 5800X3D (6), Ryzen 9 3900X (3), Ryzen 7 2700X (2 + 3-impr cluster), i5-14600K (1 + 3-impr cluster), Ryzen 7 9800X3D (1), i5-12400F (1). New from Bing cluster: Ryzen 5 5600G (3 impr). From Vercel winners: how to update ASUS BIOS, MSI Mystic Light RGB software |
