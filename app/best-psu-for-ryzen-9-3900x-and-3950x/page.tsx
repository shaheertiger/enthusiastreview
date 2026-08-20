import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best Power Supplies for Ryzen 9 3900X and 3950X in 2026 (650W-850W)",
  description: "Find the best power supply for AMD Ryzen 9 3900X and 3950X builds. We compare 7 top 650W-850W PSUs for wattage, efficiency, and GPU headroom.",
  alternates: {
    canonical: "/best-psu-for-ryzen-9-3900x-and-3950x/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} category="Power Supplies" />;
}
