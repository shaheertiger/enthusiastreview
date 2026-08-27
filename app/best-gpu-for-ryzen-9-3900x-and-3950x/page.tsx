import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best GPUs for Ryzen 9 3900X and 3950X in 2026 (1440p & 4K)";
const description = "Looking for the best Ryzen 9 3950X GPU pairing? We compare 7 top graphics cards for 1440p and 4K gaming and content creation with the 3900X and 3950X.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-gpu-for-ryzen-9-3900x-and-3950x/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-gpu-for-ryzen-9-3900x-and-3950x/",
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
