import type { MetadataRoute } from "next";
import { CPUS, SITE, cpuPath } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE.updated);
  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    ...CPUS.map((c) => ({ url: `${SITE.url}${cpuPath(c)}`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...["/methodology/", "/about/", "/affiliate-disclosure/", "/privacy/"].map((p) => ({
      url: `${SITE.url}${p}`, lastModified, changeFrequency: "yearly" as const, priority: 0.3,
    })),
  ];
}
