import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Finder from "@/components/Finder";
import JsonLd from "@/components/JsonLd";
import { ArrowRight } from "@/components/Icons";
import { CPUS, SITE, affiliateUrl, cpuPath, cpuSlug, findCpuBySlug, ogImagePath } from "@/lib/data";
import { DEFAULTS, ceilingAt, recommend } from "@/lib/recommend";
import { buildContent, metaDescription } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return CPUS.map((c) => ({ slug: cpuSlug(c) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cpu = findCpuBySlug((await params).slug);
  if (!cpu) return {};
  const r = recommend(cpu, DEFAULTS);
  const title = `Best GPU for ${cpu.name} Without Bottleneck (${new Date(SITE.updated).getFullYear()})`;
  const description = metaDescription(cpu, r);
  const url = cpuPath(cpu);
  return {
    title: { absolute: `${title} | enthusiastreview` },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, modifiedTime: SITE.updated, images: [{ url: ogImagePath(cpu), width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImagePath(cpu)] },
  };
}

export default async function CpuPage({ params }: Props) {
  const cpu = findCpuBySlug((await params).slug);
  if (!cpu) notFound();

  const r = recommend(cpu, DEFAULTS);
  const c = buildContent(cpu, DEFAULTS, r);
  const url = `${SITE.url}${cpuPath(cpu)}`;
  const title = `Best GPU for ${cpu.name} Without Bottleneck`;

  const ceilings = (["1080p", "1440p", "4K"] as const).map((res) => ({
    res,
    hz60: ceilingAt(cpu, res, "60Hz"),
    hz144: ceilingAt(cpu, res, "144Hz"),
    hz240: ceilingAt(cpu, res, "240Hz"),
  }));

  const siblings = CPUS.filter((o) => o.id !== cpu.id)
    .sort((a, b) => (a.brand === cpu.brand ? 0 : 1) - (b.brand === cpu.brand ? 0 : 1) || Math.abs(a.cap - cpu.cap) - Math.abs(b.cap - cpu.cap))
    .slice(0, 10);

  const picks = [
    ["Best match", r.best],
    ["Budget pick", r.budgetPick],
    ["Max before bottleneck", r.max],
  ] as const;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: metaDescription(cpu, r),
      mainEntityOfPage: url,
      datePublished: "2026-11-01",
      dateModified: SITE.updated,
      image: `${SITE.url}${ogImagePath(cpu)}`,
      author: { "@type": "Organization", name: "enthusiastreview hardware desk", url: `${SITE.url}/about/` },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Bottleneck finder", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: `Best GPU for ${cpu.name}`, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Best GPUs for the ${cpu.name}`,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: picks.map(([label, g], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${label}: ${g.name}`,
        url: affiliateUrl(g),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Finder cpuId={cpu.id} updated={SITE.updated}>
        <section className="sec">
          <div className="kicker">Resolution vs refresh rate</div>
          <h2>How far the {cpu.name} can go at each setting</h2>
          <p>
            The strongest card the {cpu.name} keeps fully loaded, by resolution and refresh target (16GB RAM, gaming only).
            Read across to see how chasing higher refresh rates lowers the ceiling, and down to see how higher resolutions raise it.
          </p>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr><th scope="col">Resolution</th><th scope="col">60Hz</th><th scope="col">144Hz</th><th scope="col">240Hz</th></tr>
              </thead>
              <tbody>
                {ceilings.map((row) => (
                  <tr key={row.res}>
                    <th scope="row" className="strong">{row.res}</th>
                    <td>{row.hz60.name}</td>
                    <td>{row.hz144.name}</td>
                    <td>{row.hz240.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Finder>

      <div className="wrap other-cpus">
        <h2>Other CPUs</h2>
        <ul className="link-rows">
          {siblings.map((o) => (
            <li key={o.id}>
              <a href={cpuPath(o)}>
                <span>Best GPU for {o.name}</span>
                <ArrowRight />
              </a>
            </li>
          ))}
          <li>
            <a href="/#cpus">
              <span>All {CPUS.length} CPUs</span>
              <ArrowRight />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
