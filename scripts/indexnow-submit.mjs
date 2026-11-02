// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver…)
// so new/updated pages are crawled right away. Run AFTER deploying:
//
//   npm run indexnow
//   INDEXNOW_KEY=<key> SITE_URL=https://www.enthusiastreview.com npm run indexnow
//
// IndexNow verifies ownership by fetching https://<host>/<key>.txt, which lives in /public.

const SITE_URL = (process.env.SITE_URL || "https://www.enthusiastreview.com").replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY || "7536e59e5b7e4ddbaea97af125d04122";
const host = new URL(SITE_URL).host;

const xml = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) {
  console.error("No URLs found in sitemap.xml — is the site deployed?");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
if (!res.ok) {
  console.error(await res.text().catch(() => ""));
  process.exit(1);
}
