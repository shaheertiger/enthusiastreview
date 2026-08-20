import type { MetadataRoute } from "next";
import { pages } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://enthusiastreview.com";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...pages.map((p) => ({
      url: `${base}/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
