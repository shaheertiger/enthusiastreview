import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best GPUs for Ryzen 9 3900X and 3950X in 2026 (1440p & 4K)",
  description: "Looking for the best Ryzen 9 3950X GPU pairing? We compare 7 top graphics cards for 1440p and 4K gaming and content creation with the 3900X and 3950X.",
  alternates: {
    canonical: "/best-gpu-for-ryzen-9-3900x-and-3950x/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
