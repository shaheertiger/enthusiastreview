import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "How to Overclock a GPU: Complete 2026 Guide",
  description: "Learn how to overclock a GPU safely in 2026, with step-by-step instructions for both NVIDIA and AMD cards, software picks, and stability testing tips.",
  alternates: {
    canonical: "/how-to-overclock-a-gpu/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
