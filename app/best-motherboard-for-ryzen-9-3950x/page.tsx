import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best Motherboards for Ryzen 9 3950X (X570/B550)";
const description = "Compare the 7 best motherboards for the AMD Ryzen 9 3950X, from budget B550 boards to premium X570 picks with the VRM strength this 16-core CPU needs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-motherboard-for-ryzen-9-3950x/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-motherboard-for-ryzen-9-3950x/",
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
