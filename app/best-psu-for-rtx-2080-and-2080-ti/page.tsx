import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import { articleHtml } from "./article";

export const metadata: Metadata = {
  title: "7 Best Power Supplies for RTX 2080 and 2080 Ti in 2026 (Wattage Guide)",
  description: "Find the right 2080 Ti power supply. We compare 7 PSUs from 650W-850W for RTX 2080 and 2080 Ti builds, covering wattage, PCIe connectors, and transient spikes.",
  alternates: {
    canonical: "/best-psu-for-rtx-2080-and-2080-ti/",
  },
};

export default function Page() {
  return <ArticleLayout html={articleHtml} />;
}
