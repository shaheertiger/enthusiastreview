import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best RAM Kits for Ryzen 9 3900X and 3950X in 2026 (AM4)",
  description: "Find the best RAM for Ryzen 3900X and 3950X builds. We compare 7 DDR4 kits for Zen 2's Infinity Fabric sweet spot, from 16GB budget picks to 64GB workstation kits.",
  alternates: {
    canonical: "/best-ram-for-ryzen-9-3900x-and-3950x/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
