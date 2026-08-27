/** Gate: every article page carries at least 2,500 words of real prose. */
import { readArticles, wordCount, report } from "./lib/article-source.mjs";

const MIN = 2500;
const failures = [];

for (const { slug, html } of readArticles()) {
  const words = wordCount(html);
  if (words < MIN) failures.push(`${slug}: ${words} words (minimum ${MIN})`);
}

report(`validate:words — ${MIN}+ words per page`, failures);
