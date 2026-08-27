import Link from "next/link";
import TrustBadge from "@/components/TrustBadge";
import type { ArticleMeta } from "@/lib/article";

function highlight(heading: string, phrase: string) {
  const at = heading.indexOf(phrase);
  if (at === -1) return heading;
  return (
    <>
      {heading.slice(0, at)}
      <span className="hero-highlight">{phrase}</span>
      {heading.slice(at + phrase.length)}
    </>
  );
}

export default function ArticleHero({ meta }: { meta: ArticleMeta }) {
  const [primary, secondary] = meta.ctas;
  return (
    <div className="article-hero">
      <div className="article-hero-inner">
        <TrustBadge />
        <div className="hero-pills">
          <span className="pill pill-kind">{meta.kind}</span>
          <span className="pill pill-updated">Updated {meta.updated}</span>
        </div>
        <h1 className="article-hero-title">{highlight(meta.heading, meta.highlight)}</h1>
        <p className="article-hero-standfirst">{meta.standfirst}</p>
        <div className="hero-ctas">
          <Link href={primary.href} className="hero-cta hero-cta-primary">
            {primary.text}
          </Link>
          <Link href={secondary.href} className="hero-cta hero-cta-secondary">
            {secondary.text}
          </Link>
        </div>
      </div>
    </div>
  );
}
