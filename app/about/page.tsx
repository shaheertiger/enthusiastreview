import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = {
  title: "About",
  description: "Who runs enthusiastreview and how we decide which graphics card fits each CPU.",
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <Prose kicker="About" title="About enthusiastreview">
      <section className="sec sec-first">
        <h2>What we do</h2>
        <p>enthusiastreview is a small, independent PC hardware site. We answer one question well: which graphics card should you buy for the processor you already own, so you get every frame you pay for?</p>
        <p>Instead of ranked lists, every CPU gets its own page with an interactive picker. You set your resolution, refresh rate, RAM, use and budget, and the recommendation changes with them.</p>
      </section>
      <section className="sec">
        <h2>How we stay honest</h2>
        <p>We earn a commission when you buy through some links on this site. That never changes a recommendation: the picks come from the same performance model for every CPU, and the model often tells you to spend less. There are no sponsored placements, pop-ups with timers or fake urgency.</p>
        <p>See <a href="/methodology/">how we test</a> and our <a href="/affiliate-disclosure/">affiliate disclosure</a> for details.</p>
      </section>
      <section className="sec">
        <h2>Contact</h2>
        <p>Spotted a wrong number or want a CPU added? Email <a href="mailto:hello@enthusiastreview.com">hello@enthusiastreview.com</a>.</p>
      </section>
    </Prose>
  );
}
