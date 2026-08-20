import Link from "next/link";
import { pages, categoryOrder } from "@/lib/pages";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-slate-600">
        <p className="max-w-2xl">
          EnthusiastReview helps PC builders pick the right part the first time. We compare specs,
          compatibility, and price so you don&apos;t have to dig through forum threads.
        </p>
        <p className="mt-3 max-w-2xl text-xs text-slate-500">
          Affiliate Disclosure: EnthusiastReview is reader-supported. When you buy through links on
          this site, we may earn an affiliate commission at no extra cost to you.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {categoryOrder.map((category) => (
            <div key={category}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {category}
              </h3>
              <ul className="space-y-1.5">
                {pages
                  .filter((p) => p.category === category)
                  .map((p) => (
                    <li key={p.slug}>
                      <Link href={`/${p.slug}/`} className="hover:text-brand-600">
                        {p.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} EnthusiastReview. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
