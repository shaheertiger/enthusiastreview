import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best Motherboards for Ryzen 9 3950X (X570/B550)",
  description: "Compare the 7 best motherboards for the AMD Ryzen 9 3950X, from budget B550 boards to premium X570 picks with the VRM strength this 16-core CPU needs.",
  alternates: {
    canonical: "/best-motherboard-for-ryzen-9-3950x/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
