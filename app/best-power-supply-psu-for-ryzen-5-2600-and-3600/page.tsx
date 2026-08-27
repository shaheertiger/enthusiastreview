import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best Power Supplies (PSU) for Ryzen 5 2600 and 3600 in 2026";
const description = "Find the best power supply for AMD Ryzen 5 2600 and 3600 builds. We compare 7 PSUs from 450W-650W on wattage, efficiency, and value for gaming rigs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-power-supply-psu-for-ryzen-5-2600-and-3600/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-power-supply-psu-for-ryzen-5-2600-and-3600/",
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
