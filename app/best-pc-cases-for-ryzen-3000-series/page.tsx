import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best PC Cases for Ryzen 3000 Builds in 2026";
const description = "We compared the best PC cases for AMD Ryzen 3000 series builds, weighing airflow, CPU cooler clearance, GPU length, and price for 3600 to 3950X systems.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-pc-cases-for-ryzen-3000-series/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-pc-cases-for-ryzen-3000-series/",
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
