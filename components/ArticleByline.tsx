import SocialProof from "@/components/SocialProof";
import type { ArticleMeta } from "@/lib/article";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ArticleByline({
  meta,
  readTime,
}: {
  meta: ArticleMeta;
  readTime: number;
}) {
  return (
    <div className="byline-strip">
      <span className="byline-avatar" aria-hidden="true">
        {initials(meta.author)}
      </span>
      <div>
        <p className="byline-name">{meta.author}</p>
        <p className="byline-role">
          {meta.authorRole} &middot; Last updated {meta.updated}
        </p>
      </div>
      <SocialProof readTime={readTime} updated={meta.updated} />
    </div>
  );
}
