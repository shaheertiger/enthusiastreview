import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How enthusiastreview earns money through affiliate links, and why it doesn't affect our picks.",
  alternates: { canonical: "/affiliate-disclosure/" },
};

export default function Disclosure() {
  return (
    <Prose kicker="Disclosure" title="Affiliate disclosure">
      <section className="sec sec-first">
        <p>enthusiastreview is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate we earn from qualifying purchases.</p>
        <p>Price buttons on this site are affiliate links and are marked <code>rel=&quot;sponsored&quot;</code>. Buying through them costs you nothing extra. Recommendations come from the same performance model for every CPU and are never paid for.</p>
        <p>Prices shown are approximate and can change at any time; the retailer&apos;s price at checkout is the one that applies.</p>
      </section>
    </Prose>
  );
}
