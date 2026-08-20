import Link from "next/link";
import { pages, categoryOrder } from "@/lib/pages";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          PC hardware buying guides that don&apos;t waste your time
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Compatibility-first picks for CPU coolers, GPUs, power supplies, cases, RAM, and
          motherboards — built around the CPUs and price points people are actually shopping for.
        </p>
      </div>

      <div className="mt-14 space-y-12">
        {categoryOrder.map((category) => {
          const items = pages.filter((p) => p.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} id={category.toLowerCase().replace(/\s+/g, "-")}>
              <h2 className="mb-4 text-xl font-bold text-slate-900">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}/`}
                    className="rounded-lg border border-slate-200 p-5 transition hover:border-brand-500 hover:shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600">{p.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
