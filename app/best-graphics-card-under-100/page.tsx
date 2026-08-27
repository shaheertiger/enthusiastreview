import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best Graphics Cards Under $100 in 2026";
const description = "Looking for the best graphics card under $100? We compared 7 new and used GPUs for 1080p esports and HTPC builds, covering VRAM, TDP, and real prices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-graphics-card-under-100/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-graphics-card-under-100/",
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
