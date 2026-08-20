export interface Heading {
  id: string;
  text: string;
}

export function extractHeadings(html: string): Heading[] {
  const matches = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)];
  return matches.map((m) => ({
    id: m[1],
    text: m[2].replace(/<[^>]+>/g, ""),
  }));
}

export function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
