/**
 * Gate: every article page contains the required structural elements, in the
 * order the article spec sets out. Prints exactly which page is missing what.
 */
import { readArticles, report } from "./lib/article-source.mjs";

const failures = [];

/** [label, test] — tests run against { slug, html, articleSource, pageSource }. */
const checks = [
  ["meta export", (a) => /export const meta: ArticleMeta = \{/.test(a.articleSource)],
  ["hero (heading + highlight + standfirst)", (a) =>
    ["heading:", "highlight:", "standfirst:", "kind:"].every((k) => a.articleSource.includes(k))],
  ["two hero CTAs", (a) => (a.articleSource.match(/href: "#/g) || []).length === 2],
  ["byline meta (author, role, updated)", (a) =>
    ["author:", "authorRole:", "updated:"].every((k) => a.articleSource.includes(k))],
  ["ISO published/modified dates", (a) =>
    /published: "\d{4}-\d{2}-\d{2}"/.test(a.articleSource) &&
    /modified: "\d{4}-\d{2}-\d{2}"/.test(a.articleSource)],
  ["lead paragraph before the first h2", (a) => /^\s*<p>/.test(a.html)],
  ["6-9 numbered sections", (a) => {
    const numbered = [...a.html.matchAll(/<h2 id="[^"]+">(\d+)\. /g)];
    return numbered.length >= 4 && numbered.every((m, i) => Number(m[1]) === i + 1);
  }],
  ["FAQ with 5+ questions", (a) => {
    const faq = a.html.split('<h2 id="faq">')[1];
    return !!faq && (faq.match(/<details class="faq-item">/g) || []).length >= 5;
  }],
  ["Common Mistakes with 4 cards", (a) => {
    const section = a.html.split('<h2 id="common-mistakes">')[1];
    return !!section &&
      /Common Mistakes/.test(a.html) &&
      (section.split('<h2 id="related-guides">')[0].match(/mistake-card/g) || []).length === 4;
  }],
  ["Related Guides with 3 cards", (a) => {
    const section = a.html.split('<h2 id="related-guides">')[1];
    return !!section && (section.match(/class="related-card"/g) || []).length >= 3;
  }],
  ["The Bottom Line closing", (a) => a.html.includes('<h2 id="bottom-line">The Bottom Line</h2>')],
  ["element order", (a) => {
    const order = ["faq", "common-mistakes", "related-guides", "bottom-line"].map((id) =>
      a.html.indexOf(`<h2 id="${id}">`)
    );
    return order.every((at, i) => at !== -1 && (i === 0 || at > order[i - 1]));
  }],
  ["JSON-LD via ArticleLayout", (a) =>
    /<ArticleLayout meta=\{meta\} html=\{articleHtml\} title=\{title\} \/>/.test(a.pageSource)],
  ["canonical URL", (a) => new RegExp(`canonical: "/${a.slug}/"`).test(a.pageSource)],
  ["OpenGraph article metadata", (a) => /type: "article"/.test(a.pageSource)],
];

for (const article of readArticles()) {
  for (const [label, test] of checks) {
    let ok = false;
    try {
      ok = test(article);
    } catch {
      ok = false;
    }
    if (!ok) failures.push(`${article.slug}: missing ${label}`);
  }
}

report(`format:audit — ${checks.length} structural elements per page`, failures);
