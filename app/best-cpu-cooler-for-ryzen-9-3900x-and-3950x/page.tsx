import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best CPU Coolers for Ryzen 9 3900X & 3950X (AM4) in 2026",
  description: "Looking for the best cooler for 3900X or 3950X? We compared 7 air and AIO coolers for AM4, 105W/140W TDP, and boost headroom to find the top picks.",
  alternates: {
    canonical: "/best-cpu-cooler-for-ryzen-9-3900x-and-3950x/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} category="CPU Coolers" />;
}
