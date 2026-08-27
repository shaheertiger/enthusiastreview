export interface Heading {
  id: string;
  text: string;
}

const entities: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&bull;": "\u2022",
  "&mdash;": "\u2014",
  "&lt;": "<",
  "&gt;": ">",
};

export function extractHeadings(html: string): Heading[] {
  const matches = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)];
  return matches.map((m) => ({
    id: m[1],
    text: m[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;|&quot;|&#39;|&bull;|&mdash;|&lt;|&gt;/g, (e) => entities[e]),
  }));
}

export function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
