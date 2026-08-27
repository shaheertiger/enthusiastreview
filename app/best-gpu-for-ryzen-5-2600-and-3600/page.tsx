import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best GPUs for Ryzen 5 2600 and 3600 in 2026 (No Bottleneck)";
const description = "Find the best GPU for your Ryzen 5 2600 or 3600 without bottlenecking. We compare 7 graphics cards for 1080p and 1440p gaming builds in 2026.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-gpu-for-ryzen-5-2600-and-3600/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-gpu-for-ryzen-5-2600-and-3600/",
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
