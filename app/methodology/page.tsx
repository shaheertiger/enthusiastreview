import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "How We Test CPU and GPU Pairings",
  description: "How enthusiastreview estimates each CPU's GPU ceiling, adjusts it for resolution, refresh rate, RAM and streaming, and picks the best match.",
  alternates: { canonical: "/methodology/" },
};

export default function Methodology() {
  return (
    <Prose kicker="Methodology" title="How we test">
      <section className="sec sec-first">
        <h2>One scale for every part</h2>
        <p>Every graphics card gets a performance score on a single scale, where 60 is roughly an RTX 4060 at 1080p high settings. Every CPU gets a ceiling on the same scale: the strongest GPU it can keep fully loaded at 1080p and 144Hz in CPU-heavy games. Both come from our own testing and published benchmark data across a fixed set of games.</p>
      </section>
      <section className="sec">
        <h2>Adjusting for your settings</h2>
        <p>The CPU ceiling moves with your settings. Higher resolutions raise it (×1.3 at 1440p, ×1.7 at 4K) because the GPU does more work per frame. Higher refresh targets lower it (×0.85 at 240Hz) and lower targets raise it (×1.25 at 60Hz). 8GB of RAM lowers it by 10%, and streaming while you play lowers it by about 8%.</p>
      </section>
      <section className="sec">
        <h2>Choosing the three picks</h2>
        <p><strong>Max before bottleneck</strong> is the strongest card within 5% of the adjusted ceiling. <strong>Best match</strong> is the strongest card at or under your budget that still fits. <strong>Budget pick</strong> is the best performance per dollar among cheaper cards that keep at least 70% of the best match&apos;s performance.</p>
        <p>A pairing counts as balanced when the GPU would stay above roughly 95% load in most games. FPS figures are rounded estimates, and each game is marked CPU- or GPU-limited depending on which side runs out first.</p>
      </section>
      <section className="sec">
        <h2>Prices and updates</h2>
        <p>Prices are approximate US street prices for new cards and are reviewed when they move by more than 10%, when a new GPU launches or when a driver noticeably changes results. Data last reviewed <time dateTime={SITE.updated}>{SITE.updated}</time>.</p>
      </section>
    </Prose>
  );
}
