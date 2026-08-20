import Link from "next/link";
import { extractHeadings, estimateReadTime } from "@/lib/extractHeadings";
import TableOfContents from "@/components/TableOfContents";

interface ArticleLayoutProps {
  html: string;
  category: string;
}

export default function ArticleLayout({ html, category }: ArticleLayoutProps) {
  const headings = extractHeadings(html);
  const readTime = estimateReadTime(html);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>{category}</span>
        <span className="read-time-badge">{readTime} min read</span>
      </nav>

      <div className="article-grid">
        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
        {headings.length > 0 && (
          <aside className="article-aside">
            <div className="toc-sticky">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
