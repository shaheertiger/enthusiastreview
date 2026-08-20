import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best PSUs Under $100 in 2026 (Budget Gaming Builds)",
  description: "Looking for the best gaming PSU under $100? We compared 7 budget 500W-650W power supplies on efficiency, protections, and price so your build stays safe.",
  alternates: {
    canonical: "/best-psu-under-100/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
