import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best Graphics Cards Under $100 in 2026",
  description: "Looking for the best graphics card under $100? We compared 7 new and used GPUs for 1080p esports and HTPC builds, covering VRAM, TDP, and real prices.",
  alternates: {
    canonical: "/best-graphics-card-under-100/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} category="Graphics Cards" />;
}
