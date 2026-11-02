import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CpuJump from "@/components/CpuJump";
import { ArrowRight } from "@/components/Icons";
import { CPUS, SITE, cpuPath } from "@/lib/data";
import { DEFAULTS, recommend } from "@/lib/recommend";

export const metadata: Metadata = {
  title: { absolute: "GPU Bottleneck Finder: Best GPU for Your CPU (2026) | enthusiastreview" },
  alternates: { canonical: "/" },
};

const FAQS = [
  {
    q: "What is a CPU bottleneck?",
    a: "A CPU bottleneck happens when the processor cannot prepare frames as fast as the graphics card can draw them. The GPU sits partly idle, so a faster card does not raise your frame rate.",
  },
  {
    q: "How do I know which GPU my CPU can handle?",
    a: "Pick your CPU above, then set your resolution, refresh rate, RAM, use and budget. We show the strongest GPU your CPU can keep fully loaded at those settings, plus a budget pick and the maximum before the CPU becomes the limit.",
  },
  {
    q: "Does resolution affect bottlenecks?",
    a: "Yes. At 1080p the CPU does more work per frame relative to the GPU, so bottlenecks show up sooner. At 1440p and 4K the GPU carries more of the load, which lets an older CPU feed a faster card.",
  },
  {
    q: "Are bottleneck calculators accurate?",
    a: "Percent-based calculators that output a single number are not. Bottlenecks depend on the game, resolution and refresh target. We estimate a GPU ceiling for each CPU from benchmark data and adjust it for your settings, and we show which games stay CPU-limited.",
  },
];

export default function Home() {
  const brands = (["AMD", "Intel"] as const).map((b) => ({ brand: b, cpus: CPUS.filter((c) => c.brand === b) }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon.svg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "GPU Bottleneck Finder",
      url: SITE.url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="hero">
        <h1 className="hero-title">
          <span>GPU bottleneck finder</span>
        </h1>
        <p className="hero-lead">Pick your CPU. Get the strongest graphics card it can actually feed — no wasted money, no idle GPU.</p>
        <CpuJump />
      </section>

      <div className="wrap">
        <section className="sec sec-first" id="cpus">
          <div className="kicker">Choose your processor</div>
          <h2>Best GPU for every CPU</h2>
          {brands.map(({ brand, cpus }) => (
            <div key={brand} className="brand-group">
              <h3>{brand}</h3>
              <ul className="link-rows">
                {cpus.map((c) => (
                  <li key={c.id}>
                    <a href={cpuPath(c)}>
                      <span>
                        Best GPU for {c.name}
                        <span className="row-sub">Best match: {recommend(c, DEFAULTS).best.name}</span>
                      </span>
                      <ArrowRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="sec">
          <div className="kicker">How it works</div>
          <h2>Matched to your setup, not a single percentage</h2>
          <p>
            Most bottleneck calculators give you one percentage and stop. That number changes with every game and every
            setting, so it rarely helps you buy the right card. We do it the other way round: for each CPU we work out the
            most GPU it can keep busy at 1080p and 144Hz, then adjust for your resolution, refresh rate, RAM and whether
            you stream.
          </p>
          <ol className="checks">
            <li><span className="check-n">01</span><div><div className="check-title">Pick your CPU</div><div className="small">Every page is built for one processor, with its cores, socket, PCIe version and memory support.</div></div></li>
            <li><span className="check-n">02</span><div><div className="check-title">Tap through your settings</div><div className="small">Resolution, refresh rate, RAM, use and budget. Each tap updates the picks instantly.</div></div></li>
            <li><span className="check-n">03</span><div><div className="check-title">Get three picks</div><div className="small">A budget pick, the best match for your budget and the maximum before the CPU holds the card back.</div></div></li>
            <li><span className="check-n">04</span><div><div className="check-title">Check FPS and the upgrade path</div><div className="small">Estimated FPS in six popular games, a buying checklist and the drop-in CPU upgrade for your socket.</div></div></li>
          </ol>
        </section>

        <section className="sec">
          <div className="kicker">Rules of thumb</div>
          <h2>Three things that matter more than the spec sheet</h2>
          <p><strong>Resolution sets the balance.</strong> At 1080p the CPU does more of the work per frame. Moving to 1440p shifts load onto the GPU, which is why an older CPU can run a faster card at a higher resolution.</p>
          <p><strong>Refresh rate raises the bar.</strong> Hitting 144Hz or 240Hz means the CPU must prepare frames two to four times as fast as at 60Hz. High-refresh esports gaming is where CPU limits bite hardest.</p>
          <p><strong>Memory is part of the CPU.</strong> Single-channel RAM or memory left at its slow default speed looks exactly like a CPU bottleneck. Two matched sticks with XMP or EXPO turned on is free performance.</p>
        </section>

        <section className="sec">
          <h2>FAQ</h2>
          <div className="faq">
            {FAQS.map((f, i) => (
              <details key={f.q} name="faq" open={i === 0}>
                <summary><span>{f.q}</span><span className="faq-sign" aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
