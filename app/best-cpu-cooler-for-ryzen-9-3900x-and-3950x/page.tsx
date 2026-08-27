import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best CPU Coolers for Ryzen 9 3900X & 3950X (AM4) in 2026";
const description = "Looking for the best cooler for 3900X or 3950X? We compared 7 air and AIO coolers for AM4, 105W/140W TDP, and boost headroom to find the top picks.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-cpu-cooler-for-ryzen-9-3900x-and-3950x/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-cpu-cooler-for-ryzen-9-3900x-and-3950x/",
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
