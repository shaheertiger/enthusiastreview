interface ArticleLayoutProps {
  html: string;
}

export default function ArticleLayout({ html }: ArticleLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div
        className="prose prose-slate prose-a:text-brand-600 prose-headings:font-bold max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
