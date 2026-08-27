import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best Power Supplies for Ryzen 7 2700X and 3700X in 2026 (PSU Guide)";
const description = "Find the best power supply for Ryzen 2700X and 3700X builds. We compare wattage, efficiency, and modularity across 7 top PSUs for 8-core AM4 rigs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-psu-for-ryzen-7-2700x-and-3700x/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-psu-for-ryzen-7-2700x-and-3700x/",
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
