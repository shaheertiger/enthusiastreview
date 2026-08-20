import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best GPUs for Ryzen 5 2600 and 3600 in 2026 (No Bottleneck)",
  description: "Find the best GPU for your Ryzen 5 2600 or 3600 without bottlenecking. We compare 7 graphics cards for 1080p and 1440p gaming builds in 2026.",
  alternates: {
    canonical: "/best-gpu-for-ryzen-5-2600-and-3600/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
