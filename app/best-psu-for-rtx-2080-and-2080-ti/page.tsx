import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best Power Supplies for RTX 2080 and 2080 Ti in 2026 (Wattage Guide)";
const description = "Find the right 2080 Ti power supply. We compare 7 PSUs from 650W-850W for RTX 2080 and 2080 Ti builds, covering wattage, PCIe connectors, and transient spikes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-psu-for-rtx-2080-and-2080-ti/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-psu-for-rtx-2080-and-2080-ti/",
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
