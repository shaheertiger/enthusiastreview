import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best RAM Kits for Ryzen 9 3900X and 3950X in 2026 (AM4)";
const description = "Find the best RAM for Ryzen 3900X and 3950X builds. We compare 7 DDR4 kits for Zen 2's Infinity Fabric sweet spot, from 16GB budget picks to 64GB workstation kits.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-ram-for-ryzen-9-3900x-and-3950x/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-ram-for-ryzen-9-3900x-and-3950x/",
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
