// Everything that makes this site about PC hardware rather than another niche.
// The template code (src/components, src/layouts, src/lib, src/pages except the prose pages and
// tools) is byte-identical across the sister sites; only this file, site.config.json,
// categories.ts, nav.ts, authors.ts and the JSON content differ.
import type { Product } from '../lib/data';

/* ------------------------------- header / footer ------------------------------- */

/** Links in the strip under the logo, after the "Best Lists" mega menu. */
export const QUICK_NAV = [
  { label: 'Graphics Cards', href: '/best-graphics-card/' },
  { label: 'CPUs', href: '/best-cpu-for-gaming/' },
  { label: 'Coolers', href: '/best-cpu-cooler/' },
  { label: 'Power Supplies', href: '/best-power-supply/' },
  { label: 'Cases', href: '/best-pc-case/' },
  { label: 'All Gear', href: '/gear/' },
  { label: 'Compare', href: '/compare/' },
  { label: 'Tools', href: '/tools/' },
];

/** The free calculators: footer "Database" column, /tools/ hub. */
export const TOOLS = [
  { href: '/tools/bottleneck-calculator/', label: 'Bottleneck Calculator', name: 'PC Bottleneck Calculator', text: 'Will your CPU hold back your GPU at 1080p, 1440p or 4K? Pick the parts and see which one sets the ceiling.' },
  { href: '/tools/psu-calculator/', label: 'PSU Calculator', name: 'PSU Wattage Calculator', text: 'How many watts your build needs, with 30% headroom for GPU spikes, and the power supplies that fit.' },
];

/** The niche in a few words, for hub titles and schema names. */
export const NICHE = {
  /** "PC Hardware Glossary", "PC Hardware Brands" */
  title: 'PC Hardware',
  /** "Best PC hardware lists" */
  lower: 'PC hardware',
  /** "All PC Gear" (footer), "Every PC part we track" */
  gear: 'PC Gear',
  part: 'part',
  parts: 'parts',
  partLower: 'PC part',
  /** "the right pick depends on the build" */
  use: 'build',
  /** What every score and pick is researched against (gear pages). */
  scoreBasis: 'the spec sheet, platform requirements, widely published independent measurements and owner reports',
  /** Same, for guide disclosures. */
  pickBasis: 'spec sheets, platform documentation, widely published independent measurements and owner reports',
  /** Freshness note under an article's sources. */
  articleChecked: "Steps and menu names checked against the vendors' current software and support pages as of",
  footerAbout: 'Every part is matched to the build it suits, scored against the spec sheet, platform requirements, independent measurements and owner reports.',
};

/* ----------------------------------- hubs ----------------------------------- */

export const HUBS = {
  bestOf: {
    title: (n: number) => `Best PC Hardware (2026): ${n} Buying Guides by Part`,
    description: (n: number) => `${n} PC buying guides with ranked picks: the best graphics card, CPU for gaming, CPU cooler, power supply, PC case, RAM, AM5 motherboard and gaming SSD.`,
    h1: 'Best PC Hardware: Every Best List',
    dek: 'Ranked shortlists for every part in a build, matched to resolution, platform and budget.',
  },
  gear: {
    title: (n: number, score: string) => `All PC Gear We Track: ${n} Parts Rated by ${score}`,
    description: (n: number, score: string) => `Every one of the ${n} PC parts we track, ranked by ${score} within its category: GPUs, CPUs, coolers, power supplies, cases, RAM, motherboards and SSDs.`,
  },
  brands: {
    description: (score: string) => `Every PC hardware brand we track, from NVIDIA, AMD and Intel to Corsair, Noctua, Thermalright and Lian Li: each brand's lineup, average ${score} and best model.`,
  },
  compare: {
    description: (n: number) => `${n} head-to-head PC part comparisons: RTX 5070 vs RX 9070 XT, 9800X3D vs 7800X3D, Peerless Assassin vs NH-D15 G2 and more, with specs, scores and a verdict.`,
  },
  glossary: {
    description: (n: number) => `${n} PC hardware terms explained with worked numbers: TDP, VRAM, CAS latency, ATX 3.1, 12V-2x6, EXPO, PCIe 5.0, 3D V-Cache and more, for your next build.`,
    dek: 'The spec-sheet words that decide whether parts fit, run cool and perform, each with a worked example.',
  },
  tools: {
    title: 'Free PC Building Tools: Bottleneck and PSU Calculators',
    description: 'Two free PC building calculators: check whether your CPU bottlenecks your GPU at 1080p to 4K, and work out how many watts of power supply your build needs.',
    h1: 'PC Building Tools',
    dek: 'Quick calculators for the two questions every build raises.',
  },
  notFound: 'This page does not exist. Browse every PC hardware best list, the parts we track, comparisons and calculators on Enthusiast Review.',
};

/* --------------------------------- home page --------------------------------- */

export const HOME = {
  /** Guide whose #1 pick is the home page's quick answer. */
  hero: 'best-graphics-card',
  title: (name: string) => `${name}: Independent PC Hardware Reviews and Guides`,
  description: (n: number) => `Independent PC hardware reviews: ${n} GPUs, CPUs, coolers, PSUs, cases, RAM kits, motherboards and SSDs checked against the spec sheet. No paid placements.`,
  kicker: 'PC hardware, researched',
  h1: 'Read the Spec Sheet. Build the Right PC.',
  dek: (n: number, brands: number) => `We match every graphics card, CPU, cooler and power supply to the build it suits: resolution, platform, case and budget. ${n} parts from ${brands} brands, scored.`,
  ctas: [
    { href: '/best-graphics-card/', label: 'Best Graphics Cards' },
    { href: '/best-cpu-for-gaming/', label: 'Best CPUs for Gaming' },
  ],
  answerH2: 'What Is the Best Graphics Card Right Now?',
  answerLink: (n: number) => `See all ${n} picks in our best graphics card guide →`,
  featuredH2: 'Best PC Hardware: Picks by Part and Budget',
  promiseH2: 'Built on the Spec Sheet, Not the Marketing',
  promise: (score: string) => `Every part on this site has a page with its full spec sheet, a research-based ${score} out of 100 and a plain verdict: who it suits, who should skip it and what to buy instead. The score weighs specs against the price band and what owners report after months of use. We do not run a test lab, and we say so on every page. Where performance matters we lean on the broad pattern of independent reviews, never a single cherry-picked chart.`,
  /** "How we're different": [heading, HTML]. */
  different: [
    ['We Do the Platform Maths', 'PCIe lanes on older boards, BIOS versions for new CPUs, cooler height against case clearance, connector types on power supplies: the things that stop a build from booting. Our <a href="/tools/bottleneck-calculator/">bottleneck</a> and <a href="/tools/psu-calculator/">PSU</a> calculators do the sums for you.'],
    ['Build First, Product Second', 'We pick for the resolution, case and budget you actually have, so the best card for a Ryzen 5 3600 is not the best card for a 9800X3D.'],
    ['No Paid Placements', 'Manufacturers never see a guide before it is published, and affiliate commissions never change a ranking. <a href="/how-we-review/">How we score</a>.'],
  ] as [string, string][],
  about: (name: string, founded: string) => `${name} has covered PC hardware since ${founded}. We help you buy the right graphics card, CPU, cooler, power supply, case, RAM, motherboard and SSD for the build you actually have, and we tell you plainly when a cheaper part will do.`,
};

/* ------------------------------ text and titles ------------------------------ */

/** Acronyms upper-cased in "<query>: The Short Answer" headings. */
export const ACRONYMS = /\b(cpu|gpu|psu|ssd|ram|am5|am4|aio|ddr5|ddr4|rtx|rx)\b/gi;
/** Words that already name the product type, so "<name> <singular>" is not appended in titles. */
export const PRODUCT_NOUNS = 'SSD|GPU|CPU|RAM|DDR[45]|Graphics|Processor|Cooler|Case|Motherboard';

/** Caption suffix under a product photo, when the listing is one of several versions. */
export const listingNote = (p: Product) => (p.category === 'graphics-cards' ? ' (one of several partner cards)' : '');

/* ------------------------ answer-first compare headings ------------------------ */

export type DiffRule = { label: string; topic?: string; more?: string; less?: string; dp?: number; kind?: 'lanes' | 'gen' };
export const DIFF_RULES: Record<string, DiffRule[]> = {
  'graphics-cards': [
    { label: 'VRAM', more: 'has {d} GB more VRAM' },
    { label: 'Board power', less: 'is rated {d} W lower' },
    { label: 'PCIe interface', more: 'uses a full x16 link', kind: 'lanes' },
  ],
  processors: [
    { label: 'Cores / threads', topic: 'Cores', more: 'has {d} more core{s}' },
    { label: 'Boost clock', more: 'boosts {d} GHz higher', dp: 1 },
    { label: 'L3 cache', more: 'has {d} MB more L3 cache' },
    { label: 'TDP', less: 'is rated {d} W lower' },
  ],
  'cpu-coolers': [
    { label: 'Height', less: 'is {d} mm shorter, so it fits more cases' },
    { label: 'Heat pipes', more: 'has {d} more heat pipe{s}' },
  ],
  'power-supplies': [
    { label: 'Wattage', more: 'delivers {d} W more' },
    { label: 'Warranty', more: 'has a {d}-year longer warranty' },
  ],
  memory: [
    { label: 'Capacity', more: 'has {d} GB more' },
    { label: 'CAS latency', less: 'has {d} lower CAS latency' },
  ],
  motherboards: [{ label: 'PCIe x16 slot', more: 'has a PCIe {v} graphics slot', kind: 'gen' }],
  storage: [
    { label: 'Sequential read', more: 'reads up to {d} MB/s faster' },
    { label: 'Endurance', more: 'is rated for {d} TBW more endurance' },
  ],
  'pc-cases': [{ label: 'Max GPU length', more: 'fits a graphics card {d} mm longer' }],
};

/* ---------------------------------- interlinking ---------------------------------- */

export interface Series {
  key: string;
  heading: string;
  re: RegExp;
  hub?: { href: string; text: string };
}
/** Page families: every member links every sibling (first match wins). */
export const SERIES: Series[] = [
  { key: 'equivalents', heading: 'More Equivalents Charts', re: /-equivalents?$/, hub: { href: '/equivalents/', text: 'Every GPU and CPU equivalents chart' } },
  { key: 'gpu-for', heading: 'Best GPU for Other CPUs', re: /^best-gpu-for-(?!ai$)/, hub: { href: '/tools/bottleneck-calculator/', text: 'Bottleneck calculator: check any CPU and GPU pair' } },
  { key: 'psu-for', heading: 'Best PSU for Other Graphics Cards', re: /^best-psu-for-/, hub: { href: '/tools/psu-calculator/', text: 'PSU calculator: wattage for any build' } },
  { key: 'cooler-for', heading: 'Best CPU Cooler for Other CPUs', re: /^best-cpu-cooler-for-/, hub: { href: '/best-cpu-cooler/', text: 'Best CPU cooler for any build' } },
  { key: 'board-for', heading: 'Best Motherboard for Other CPUs', re: /^best-motherboard-for-/, hub: { href: '/best-am5-motherboard/', text: 'Best AM5 motherboard' } },
  { key: 'ram-for', heading: 'Best RAM for Other CPUs', re: /^best-ram-for-(?!gaming$)/, hub: { href: '/best-ram-for-gaming/', text: 'Best RAM for gaming' } },
  { key: 'bios', heading: 'More BIOS Guides by Brand', re: /^how-to-(update|enter)-[a-z]+-bios$|^asrock-secure-boot$/ },
  { key: 'rgb', heading: 'RGB Software for Other Brands', re: /-rgb-(fusion-)?software$/ },
  { key: 'drivers', heading: 'More Driver and GPU Software Guides', re: /^how-to-update-[a-z-]+-drivers$|^how-to-turn-off-nvidia-overlay$|^nvidia-(?!vs-)|^amd-software-|^how-to-check-what-graphics-card|^zotac-firestorm$/ },
  { key: 'gpu-buying', heading: 'Graphics Cards by Budget and Brand', re: /^best-(graphics-card(-under-\d+|-for-1440p)?|budget-graphics-card|nvidia-graphics-card|amd-graphics-card)$|^how-much-does-a-graphics-card-cost$|^black-friday-gpu-deals$|^nvidia-vs-amd$|^best-gpu-for-ai$/ },
  { key: 'gaming-pc', heading: 'More Gaming PC Buying Guides', re: /gaming-pc|prebuilt|^is-(cyberpowerpc|ibuypower)-good$|^cyberpowerpc-vs-ibuypower$/ },
  { key: 'brands', heading: 'Is It a Good Brand? More Brand Reviews', re: /^is-[a-z]+-a-good(-gpu)?-brand$|-review$|^best-graphics-card-brands$|^graphics-card-warranty-by-brand$/ },
  { key: 'cpu-buying', heading: 'More CPU Buying Guides', re: /^best-(cpu-for-gaming|amd-cpu-for-gaming|am5-motherboard)$|^amd-vs-intel$/ },
  // Category best lists for the other parts of a build (last, so the series above keep their pages).
  { key: 'build-parts', heading: 'Best Parts for the Rest of the Build', re: /^best-(cpu-cooler|pc-case|pc-cases-under-\d+|power-supply|psu-under-\d+|ram-for-gaming|ssd-for-gaming)$/, hub: { href: '/best-of/', text: 'Every best list on the site' } },
];

/** "best <x> for <part>" guides: the part slug is group 1. Slugs in SUBJECT_SKIP are not parts. */
export const SUBJECT_RE = /^best-(?:gpu|psu|cpu-cooler|motherboard|ram)-for-(.+)$/;
export const SUBJECT_SKIP = ['ai'];

/** Chart pages that map one brand's models to another's (hub at /equivalents/). */
export const EQUIVALENTS_RE = /-equivalents?$/;

/** The equivalents chart that maps this product to its rivals. */
export function equivalentsSlug(p: Product): string | undefined {
  return p.category === 'graphics-cards' ? (p.brand === 'intel' ? 'intel-arc-gpu-equivalents' : 'amd-vs-nvidia-gpu-equivalents')
    : p.category === 'processors' ? 'intel-vs-amd-cpu-equivalents' : undefined;
}

/** Charts linked first on a cross-brand compare page. */
export function compareEquivalents(a: Product, b: Product): string[] {
  const brands = new Set([a.brand, b.brand]);
  return brands.size < 2 ? [] : a.category === 'graphics-cards'
    ? [...(brands.has('amd') && brands.has('nvidia') ? ['amd-vs-nvidia-gpu-equivalents'] : []), ...(brands.has('intel') ? ['intel-arc-gpu-equivalents'] : [])]
    : a.category === 'processors' ? ['intel-vs-amd-cpu-equivalents'] : [];
}
