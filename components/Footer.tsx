import Link from "next/link";
import { pages, categoryOrder } from "@/lib/pages";
import { IconChip } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center gap-2">
          <span className="brand-mark">
            <IconChip className="h-[16px] w-[16px]" />
          </span>
          <span className="brand-word text-sm">
            Enthusiast<span className="brand-accent">Review</span>
          </span>
        </div>
        <p className="mt-4 max-w-xl footer-text">
          EnthusiastReview helps PC builders pick the right part the first time. We compare specs,
          compatibility, and price so you don&apos;t have to dig through forum threads.
        </p>
        <p className="mt-3 max-w-xl footer-text-faint">
          Affiliate Disclosure: EnthusiastReview is reader-supported. When you buy through links on
          this site, we may earn an affiliate commission at no extra cost to you.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {categoryOrder.map((category) => (
            <div key={category}>
              <h3 className="footer-col-heading">{category}</h3>
              <ul className="mt-3 space-y-2">
                {pages
                  .filter((p) => p.category === category)
                  .map((p) => (
                    <li key={p.slug}>
                      <Link href={`/${p.slug}/`} className="footer-link">
                        {p.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t footer-copyright">
          &copy; {new Date().getFullYear()} EnthusiastReview. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
