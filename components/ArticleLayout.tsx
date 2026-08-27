import Link from "next/link";
import { extractHeadings, estimateReadTime } from "@/lib/extractHeadings";
import { buildSchema, extractSections, breadcrumbLabel, type ArticleMeta } from "@/lib/article";
import ArticleHero from "@/components/ArticleHero";
import ArticleByline from "@/components/ArticleByline";
import InThisGuide from "@/components/InThisGuide";
import TableOfContents from "@/components/TableOfContents";

interface ArticleLayoutProps {
  meta: ArticleMeta;
  html: string;
  /** The <title> tag, used verbatim as the Article headline. */
  title: string;
}

export default function ArticleLayout({ meta, html, title }: ArticleLayoutProps) {
  const headings = extractHeadings(html);
  const readTime = estimateReadTime(html);
  const sections = extractSections(html);
  const schema = buildSchema(meta, html, title);

  return (
    <article className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ArticleHero meta={meta} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{breadcrumbLabel[meta.kind]}</span>
          <span aria-hidden="true">/</span>
          <span>{meta.category}</span>
        </nav>

        <ArticleByline meta={meta} readTime={readTime} />

        <div className="article-grid">
          <div>
            <InThisGuide sections={sections} />
            <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          {headings.length > 0 && (
            <aside className="article-aside">
              <div className="toc-sticky">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
