interface SocialProofProps {
  /** Read time in minutes — a figure derived from the article itself. */
  readTime: number;
  updated: string;
}

/**
 * Required in the byline strip. This deliberately shows facts about the page
 * (length, last update) rather than an invented "join 12.4k readers" count —
 * see the caveat in the article spec. Swap in a measured figure if analytics
 * ever back one.
 */
export default function SocialProof({ readTime, updated }: SocialProofProps) {
  return (
    <div className="social-proof">
      <span className="social-proof-figure">{readTime} min read</span>
      <span aria-hidden="true">&middot;</span>
      <span>Updated {updated}</span>
    </div>
  );
}
