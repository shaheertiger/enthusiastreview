/**
 * The article page contract.
 *
 * Every page under app/<slug>/ exports `meta` (this shape) and `articleHtml`
 * from its article.ts, and renders them through <ArticleLayout />. The layout
 * owns the shared chrome — hero, byline strip, contents card, JSON-LD — so the
 * 13 required structural elements are guaranteed on every page rather than
 * hand-written 14 times. `npm run validate:format` enforces the rest.
 */

export const SITE_URL = "https://enthusiastreview.com";
export const SITE_NAME = "EnthusiastReview";

/** Orange pill in the hero. Also picks the breadcrumb label. */
export type GuideKind = "Buyer's Guide" | "Comparison" | "How-To";

/** Breadcrumb position 2 always points at the hub; only the label changes. */
export const breadcrumbLabel: Record<GuideKind, string> = {
  "Buyer's Guide": "Buying Guides",
  Comparison: "Comparisons",
  "How-To": "How-To Guides",
};

export interface Cta {
  text: string;
  /** On-page anchor, e.g. "#top-picks". Must resolve to a real section id. */
  href: string;
}

export interface ArticleMeta {
  slug: string;
  /** The <h1>. Front-loads the keyword and carries the year. */
  heading: string;
  /** Substring of `heading` rendered in the accent colour. */
  highlight: string;
  /** One-sentence standfirst under the h1. */
  standfirst: string;
  kind: GuideKind;
  /** Section label, matches lib/pages.ts categories. */
  category: string;
  author: string;
  authorRole: string;
  /** Human-readable, e.g. "August 2026". */
  updated: string;
  /** ISO dates for article:* meta and the Article node. */
  published: string;
  modified: string;
  /** Readers who used this guide. See the caveat in README — decorative. */
  socialProof?: string;
  ctas: [Cta, Cta];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Section {
  id: string;
  text: string;
}

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&bull;/g, "•")
    .replace(/&mdash;/g, "—")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

/** Sections for the "In This Guide" card: everything up to and including the FAQ. */
export function extractSections(html: string): Section[] {
  const all = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({
    id: m[1],
    text: decode(m[2]),
  }));
  const faq = all.findIndex((s) => s.id === "faq");
  return faq === -1 ? all : all.slice(0, faq + 1);
}

/**
 * Reads the FAQ straight out of the rendered HTML so the FAQPage JSON-LD can
 * never drift from the on-page copy — the failure mode called out in the spec.
 */
export function extractFaqs(html: string): Faq[] {
  const faqSection = html.split('<h2 id="faq">')[1];
  if (!faqSection) return [];
  return [
    ...faqSection.matchAll(
      /<details class="faq-item"><summary>([\s\S]*?)<\/summary><div class="faq-answer">([\s\S]*?)<\/div><\/details>/g
    ),
  ].map((m) => ({ question: decode(m[1]), answer: decode(m[2]) }));
}

/**
 * One @graph object: BreadcrumbList + FAQPage + Article, plus a HowTo node for
 * how-to pages. Organization and WebSite are emitted once in the root layout,
 * so they are deliberately absent here.
 */
export function buildSchema(meta: ArticleMeta, html: string, title: string) {
  const url = `${SITE_URL}/${meta.slug}/`;
  const faqs = extractFaqs(html);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: breadcrumbLabel[meta.kind],
          item: `${SITE_URL}/#guides`,
        },
        { "@type": "ListItem", position: 3, name: meta.heading, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "Article",
      headline: title,
      description: meta.standfirst,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: meta.author, jobTitle: meta.authorRole },
      datePublished: meta.published,
      dateModified: meta.modified,
      articleSection: meta.category,
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
  ];

  if (meta.kind === "How-To") {
    const steps = [...html.matchAll(/<h3 class="step-title">([\s\S]*?)<\/h3>/g)].map((m) => ({
      "@type": "HowToStep",
      name: decode(m[1]),
    }));
    if (steps.length) {
      graph.push({ "@type": "HowTo", name: meta.heading, step: steps });
    }
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
