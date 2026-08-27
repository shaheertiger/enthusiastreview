import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml, meta } from "./article";

const title = "7 Best PC Cases Under $50 in 2026 (Budget Airflow & Value Picks)";
const description = "Looking for the best budget PC case? We compared 7 mesh-front and tempered-glass cases under $50 on airflow, GPU clearance, and build quality.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-pc-cases-under-50/" },
  openGraph: {
    type: "article",
    title,
    description,
    url: "/best-pc-cases-under-50/",
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
