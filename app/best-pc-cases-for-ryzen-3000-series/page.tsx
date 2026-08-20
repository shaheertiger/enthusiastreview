import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best PC Cases for Ryzen 3000 Builds in 2026",
  description: "We compared the best PC cases for AMD Ryzen 3000 series builds, weighing airflow, CPU cooler clearance, GPU length, and price for 3600 to 3950X systems.",
  alternates: {
    canonical: "/best-pc-cases-for-ryzen-3000-series/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
