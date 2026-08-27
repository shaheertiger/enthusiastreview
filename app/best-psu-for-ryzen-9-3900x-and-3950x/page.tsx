import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best Power Supplies for Ryzen 9 3900X and 3950X in 2026 (650W-850W)";
const description = "Find the best power supply for AMD Ryzen 9 3900X and 3950X builds. We compare 7 top 650W-850W PSUs for wattage, efficiency, and GPU headroom.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-psu-for-ryzen-9-3900x-and-3950x/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-psu-for-ryzen-9-3900x-and-3950x/",
    publishedTime: meta.published,
    modifiedTime: meta.modified,
    authors: [meta.author],
    section: meta.category,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <ArticleLayout meta={meta} html={articleHtml} title={title} />;
}
