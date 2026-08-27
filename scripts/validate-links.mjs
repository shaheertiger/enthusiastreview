/**
 * Gate: every internal link resolves to a real route and ends with a trailing
 * slash. Covers hrefs in the article HTML, hrefs in .tsx sources, and the
 * `href:` values in article meta (hero CTAs), which must be on-page anchors.
 */
import fs from "node:fs";
import { readArticles, routes, report } from "./lib/article-source.mjs";

const known = routes();
const failures = [];

const checkHref = (where, href) => {
  if (!href.startsWith("/") || href.startsWith("//")) return;
  const [pathname] = href.split("#");
  if (!pathname.endsWith("/")) {
    failures.push(`${where}: "${href}" is missing its trailing slash`);
    return;
  }
  if (!known.has(pathname)) failures.push(`${where}: "${href}" has no page in app/`);
};

for (const { slug, html, articleSource } of readArticles()) {
  for (const m of html.matchAll(/href="([^"]+)"/g)) checkHref(`${slug}/article.ts`, m[1]);

  const anchors = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of articleSource.matchAll(/href: "#([^"]+)"/g)) {
    if (!anchors.has(m[1])) failures.push(`${slug}/article.ts: CTA "#${m[1]}" has no matching id`);
  }
}

for (const file of ["components", "app", "lib"].flatMap(walk)) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/href=[{"]?["`]([^"`{]+)["`]/g)) checkHref(file, m[1]);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry.name) && entry.name !== "article.ts" ? [full] : [];
  });
}

report("validate:links — internal links resolve with trailing slashes", failures);
