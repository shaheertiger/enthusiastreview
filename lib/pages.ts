export type Category = "CPU Coolers" | "Graphics Cards" | "Power Supplies" | "Cases" | "RAM" | "Motherboards" | "Guides";

export interface PageInfo {
  slug: string;
  title: string;
  description: string;
  category: Category;
}

export const pages: PageInfo[] = [
  {
    slug: "best-cpu-cooler-for-ryzen-9-3900x-and-3950x",
    title: "Best CPU Coolers for Ryzen 9 3900X & 3950X",
    description: "Air and AIO coolers that keep the 12-core 3900X and 16-core 3950X cool under full load.",
    category: "CPU Coolers",
  },
  {
    slug: "best-gpu-for-ryzen-5-2600-and-3600",
    title: "Best GPUs for Ryzen 5 2600 & 3600",
    description: "Graphics cards that match these mid-range CPUs without bottlenecking your build.",
    category: "Graphics Cards",
  },
  {
    slug: "best-gpu-for-ryzen-9-3900x-and-3950x",
    title: "Best GPUs for Ryzen 9 3900X & 3950X",
    description: "High-end graphics cards for 1440p and 4K builds built around the 3900X and 3950X.",
    category: "Graphics Cards",
  },
  {
    slug: "best-graphics-card-under-100",
    title: "Best Graphics Cards Under $100",
    description: "What's actually worth buying — new or used — at the sub-$100 price point.",
    category: "Graphics Cards",
  },
  {
    slug: "best-power-supply-psu-for-ryzen-5-2600-and-3600",
    title: "Best PSUs for Ryzen 5 2600 & 3600",
    description: "Right-sized power supplies for these efficient 6-core AM4 builds.",
    category: "Power Supplies",
  },
  {
    slug: "best-psu-for-rtx-2080-and-2080-ti",
    title: "Best PSUs for RTX 2080 & 2080 Ti",
    description: "PSUs with the wattage and connector headroom these power-hungry cards need.",
    category: "Power Supplies",
  },
  {
    slug: "best-psu-for-ryzen-9-3900x-and-3950x",
    title: "Best PSUs for Ryzen 9 3900X & 3950X",
    description: "PSUs sized to feed a 12/16-core CPU plus a high-end GPU with headroom to spare.",
    category: "Power Supplies",
  },
  {
    slug: "best-psu-for-ryzen-7-2700x-and-3700x",
    title: "Best PSUs for Ryzen 7 2700X & 3700X",
    description: "Reliable, efficient power supplies for 8-core AM4 gaming builds.",
    category: "Power Supplies",
  },
  {
    slug: "best-psu-under-100",
    title: "Best Gaming PSUs Under $100",
    description: "Budget power supplies that don't cut corners on safety and certification.",
    category: "Power Supplies",
  },
  {
    slug: "best-pc-cases-under-50",
    title: "Best PC Cases Under $50",
    description: "Airflow-friendly budget cases that don't feel cheap.",
    category: "Cases",
  },
  {
    slug: "best-pc-cases-for-ryzen-3000-series",
    title: "Best PC Cases for Ryzen 3000 Series",
    description: "Cases with the clearance and airflow a Ryzen 3000 build deserves.",
    category: "Cases",
  },
  {
    slug: "best-ram-for-ryzen-9-3900x-and-3950x",
    title: "Best RAM for Ryzen 9 3900X & 3950X",
    description: "Why 3600MHz CL16 is the Zen 2 sweet spot, plus the kits worth buying.",
    category: "RAM",
  },
  {
    slug: "best-motherboard-for-ryzen-9-3950x",
    title: "Best Motherboards for Ryzen 9 3950X",
    description: "B550 and X570 boards with VRMs strong enough for a 16-core CPU.",
    category: "Motherboards",
  },
  {
    slug: "how-to-overclock-a-gpu",
    title: "How to Overclock a GPU",
    description: "A complete, safe step-by-step walkthrough for NVIDIA and AMD cards.",
    category: "Guides",
  },
];

export function getPageBySlug(slug: string): PageInfo | undefined {
  return pages.find((p) => p.slug === slug);
}

export const categoryOrder: Category[] = [
  "CPU Coolers",
  "Graphics Cards",
  "Power Supplies",
  "Cases",
  "RAM",
  "Motherboards",
  "Guides",
];
