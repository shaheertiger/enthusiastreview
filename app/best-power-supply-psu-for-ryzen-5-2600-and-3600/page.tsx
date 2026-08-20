import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best Power Supplies (PSU) for Ryzen 5 2600 and 3600 in 2026",
  description: "Find the best power supply for AMD Ryzen 5 2600 and 3600 builds. We compare 7 PSUs from 450W-650W on wattage, efficiency, and value for gaming rigs.",
  alternates: {
    canonical: "/best-power-supply-psu-for-ryzen-5-2600-and-3600/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} category="Power Supplies" />;
}
