import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best PC Cases Under $50 in 2026 (Budget Airflow & Value Picks)",
  description: "Looking for the best budget PC case? We compared 7 mesh-front and tempered-glass cases under $50 on airflow, GPU clearance, and build quality.",
  alternates: {
    canonical: "/best-pc-cases-under-50/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} category="Cases" />;
}
