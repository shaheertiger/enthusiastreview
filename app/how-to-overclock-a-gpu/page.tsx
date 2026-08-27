import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "How to Overclock a GPU: Complete 2026 Guide";
const description = "Learn how to overclock a GPU safely in 2026, with step-by-step instructions for both NVIDIA and AMD cards, software picks, and stability testing tips.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/how-to-overclock-a-gpu/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/how-to-overclock-a-gpu/",
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
