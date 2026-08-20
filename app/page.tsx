import Link from "next/link";
import { pages, categoryOrder } from "@/lib/pages";
import { IconArrowRight, IconFan, IconGpu, IconBolt, IconBox, IconMemory, IconChip, IconBook } from "@/components/icons";

const categoryIcon: Record<string, (props: { className?: string }) => React.ReactElement> = {
  "CPU Coolers": IconFan,
  "Graphics Cards": IconGpu,
  "Power Supplies": IconBolt,
  Cases: IconBox,
  RAM: IconMemory,
  Motherboards: IconChip,
  Guides: IconBook,
};

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:pt-20">
          <span className="eyebrow-pill">14 guides &middot; updated August 2026</span>
          <h1 className="hero-title">
            PC hardware buying guides that don&apos;t waste your time
          </h1>
          <p className="hero-sub">
            Compatibility-first picks for CPU coolers, GPUs, power supplies, cases, RAM, and
            motherboards — built around the CPUs and price points people are actually shopping
            for, not generic top-10 lists.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="space-y-16">
          {categoryOrder.map((category) => {
            const items = pages.filter((p) => p.category === category);
            if (items.length === 0) return null;
            const Icon = categoryIcon[category];
            return (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, "-")}>
                <div className="mb-5 flex items-center gap-2.5">
                  <span className="category-icon">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h2 className="category-heading">{category}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((p) => (
                    <Link key={p.slug} href={`/${p.slug}/`} className="guide-card">
                      <div>
                        <h3 className="guide-card-title">{p.title}</h3>
                        <p className="guide-card-desc">{p.description}</p>
                      </div>
                      <IconArrowRight className="guide-card-arrow h-[18px] w-[18px]" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
