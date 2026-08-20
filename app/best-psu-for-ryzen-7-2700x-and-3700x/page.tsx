import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best Power Supplies for Ryzen 7 2700X and 3700X in 2026 (PSU Guide)",
  description: "Find the best power supply for Ryzen 2700X and 3700X builds. We compare wattage, efficiency, and modularity across 7 top PSUs for 8-core AM4 rigs.",
  alternates: {
    canonical: "/best-psu-for-ryzen-7-2700x-and-3700x/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} category="Power Supplies" />;
}
