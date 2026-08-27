import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best PSUs Under $100 in 2026 (Budget Gaming Builds)";
const description = "Looking for the best gaming PSU under $100? We compared 7 budget 500W-650W power supplies on efficiency, protections, and price so your build stays safe.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-psu-under-100/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-psu-under-100/",
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
