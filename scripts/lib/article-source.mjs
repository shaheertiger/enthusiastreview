import fs from "node:fs";
import path from "node:path";

const APP = "app";

/** Every article page: its slug, raw sources, and the decoded article HTML. */
export function readArticles() {
  return fs
    .readdirSync(APP)
    .sort()
    .filter((slug) => fs.existsSync(path.join(APP, slug, "article.ts")))
    .map((slug) => {
      const articleSource = fs.readFileSync(path.join(APP, slug, "article.ts"), "utf8");
      const pageSource = fs.readFileSync(path.join(APP, slug, "page.tsx"), "utf8");
      const literal = articleSource.split("export const articleHtml = ")[1];
      if (!literal) throw new Error(`${slug}/article.ts does not export articleHtml`);
      return {
        slug,
        articleSource,
        pageSource,
        html: JSON.parse(literal.replace(/;\s*$/, "")),
      };
    });
}

/** Routes that exist, as "/slug/". */
export function routes() {
  const slugs = fs
    .readdirSync(APP)
    .filter((slug) => fs.existsSync(path.join(APP, slug, "page.tsx")));
  return new Set(["/", ...slugs.map((s) => `/${s}/`)]);
}

export function wordCount(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function report(name, failures) {
  if (failures.length) {
    console.error(`\n✗ ${name}: ${failures.length} problem(s)\n`);
    for (const line of failures) console.error(`  ${line}`);
    console.error("");
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}
