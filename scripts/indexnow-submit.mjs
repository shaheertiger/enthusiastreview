// Submits every page URL to Bing's IndexNow API so it can be crawled immediately
// instead of waiting for a regular crawl cycle. Run this AFTER the site is live at
// https://enthusiastreview.com, since IndexNow verifies the key by fetching
// https://enthusiastreview.com/<key>.txt.
//
// Usage:
//   node scripts/indexnow-submit.mjs                 # uses the default key below
//   INDEXNOW_KEY=<key> node scripts/indexnow-submit.mjs   # override the key

// Slugs kept in sync with lib/pages.ts (duplicated here so this script has zero
// dependencies and runs with plain `node`, no TS loader required).
const slugs = [
  "best-cpu-cooler-for-ryzen-9-3900x-and-3950x",
  "best-gpu-for-ryzen-5-2600-and-3600",
  "best-gpu-for-ryzen-9-3900x-and-3950x",
  "best-graphics-card-under-100",
  "best-power-supply-psu-for-ryzen-5-2600-and-3600",
  "best-psu-for-rtx-2080-and-2080-ti",
  "best-psu-for-ryzen-9-3900x-and-3950x",
  "best-psu-for-ryzen-7-2700x-and-3700x",
  "best-psu-under-100",
  "best-pc-cases-under-50",
  "best-pc-cases-for-ryzen-3000-series",
  "best-ram-for-ryzen-9-3900x-and-3950x",
  "best-motherboard-for-ryzen-9-3950x",
  "how-to-overclock-a-gpu",
];

const HOST = "enthusiastreview.com";
const DEFAULT_KEY = "7536e59e5b7e4ddbaea97af125d04122";
const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;

const urlList = [
  `https://${HOST}/`,
  ...slugs.map((slug) => `https://${HOST}/${slug}/`),
];

const body = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/${key}.txt`,
  urlList,
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`IndexNow submit: ${res.status} ${res.statusText}`);
console.log(`Submitted ${urlList.length} URLs using key ${key}`);
if (!res.ok) {
  const text = await res.text().catch(() => "");
  console.error(text);
  process.exit(1);
}
