import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data enthusiastreview collects and how it is used.",
  alternates: { canonical: "/privacy/" },
};

export default function Privacy() {
  return (
    <Prose kicker="Privacy" title="Privacy policy">
      <section className="sec sec-first">
        <p>We use Vercel Web Analytics to count page views. It does not use cookies and does not collect personal information that identifies you.</p>
        <p>The bottleneck finder stores your settings in the page URL and remembers, for the current browser session only, whether you closed the price bar. Nothing is sent to us.</p>
        <p>When you click a price button you leave this site for a retailer such as Amazon, whose own privacy policy and cookies then apply.</p>
        <p>Questions: <a href="mailto:hello@enthusiastreview.com">hello@enthusiastreview.com</a>.</p>
      </section>
    </Prose>
  );
}
