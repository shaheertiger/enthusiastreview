// Hardware data that drives every page.
//
// IMPORTANT: scores, caps and prices are editorial estimates on one shared scale,
// not live data. Update them here (and bump SITE.updated) when prices move or
// new benchmarks land — every page regenerates from this file.
//
// Scale: a GPU "score" of 60 ≈ RTX 4060 raster performance at 1080p high.
// A CPU "cap" is the GPU score that CPU can keep fully busy at 1080p / 144 Hz
// in CPU-heavy games. A GPU above ~1.05× the cap starts waiting on the CPU.

export type Socket = "AM4" | "AM5" | "LGA1200" | "LGA1700" | "LGA1851";

export type Cpu = {
  id: string; // URL slug fragment: /best-gpu-for-{id}/
  name: string;
  brand: "AMD" | "Intel";
  cap: number;
  socket: Socket;
  cores: number;
  threads: number;
  arch: string;
  year: number;
  pcie: 3 | 4 | 5;
  memory: string; // e.g. "DDR4-3200"
  boost: string; // e.g. "4.2 GHz"
  blurb: string; // CPU-specific editorial paragraph
};

export type Gpu = {
  id: string;
  name: string;
  score: number;
  price: number; // approx. new street price, USD
  vram: number; // GB
  lanes: 8 | 16; // PCIe lanes wired on the card
  watts: number; // board power
  highOverhead?: boolean; // driver needs a fast CPU (Intel Arc) — skipped for slower CPUs
};

export const SITE = {
  name: "enthusiastreview",
  url: "https://enthusiastreview.com",
  updated: "2026-11-01",
  amazonTag: "sktiger-20",
};

export const CPUS: Cpu[] = [
  // ── AMD AM4 ───────────────────────────────────────────────
  {
    id: "ryzen-5-1600", name: "Ryzen 5 1600", brand: "AMD", cap: 52, socket: "AM4",
    cores: 6, threads: 12, arch: "Zen (14nm)", year: 2017, pcie: 3, memory: "DDR4-2933", boost: "3.6 GHz",
    blurb: "The original Ryzen 5 1600 started the six-core-for-everyone era, but first-generation Zen has high memory latency and modest clocks. In modern games it runs out of steam well before current mid-range cards do, so this is a platform where a sensible GPU and a cheap CPU drop-in upgrade beat one big graphics card purchase.",
  },
  {
    id: "ryzen-5-2600", name: "Ryzen 5 2600", brand: "AMD", cap: 60, socket: "AM4",
    cores: 6, threads: 12, arch: "Zen+ (12nm)", year: 2018, pcie: 3, memory: "DDR4-2933", boost: "3.9 GHz",
    blurb: "The Ryzen 5 2600 is a six-core, twelve-thread Zen+ chip that still games well, but it has a clear ceiling. Its instructions-per-clock trail newer chips, and CPU-heavy titles at 1080p expose that quickly: CPU usage climbs while an overpowered GPU sits at 60–70% load. Most 2600 owners are on B450 or X470 boards, which run the graphics slot at PCIe 3.0.",
  },
  {
    id: "ryzen-7-2700x", name: "Ryzen 7 2700X", brand: "AMD", cap: 64, socket: "AM4",
    cores: 8, threads: 16, arch: "Zen+ (12nm)", year: 2018, pcie: 3, memory: "DDR4-2933", boost: "4.3 GHz",
    blurb: "The Ryzen 7 2700X adds two cores and higher clocks over the 2600, but games rarely use all sixteen threads. Per-core speed decides frame rate, so its GPU ceiling is only a little higher than the 2600's. The extra cores do help if you stream or run background apps while you play.",
  },
  {
    id: "ryzen-5-3600", name: "Ryzen 5 3600", brand: "AMD", cap: 72, socket: "AM4",
    cores: 6, threads: 12, arch: "Zen 2 (7nm)", year: 2019, pcie: 4, memory: "DDR4-3200", boost: "4.2 GHz",
    blurb: "The Ryzen 5 3600 was the default gaming CPU for years and is still common in used builds. Zen 2 brought a big IPC jump over Zen+, but its split L3 cache and memory latency still hold it back in simulation-heavy and esports games. On B550 or X570 boards it gets PCIe 4.0; on older B450 boards it runs at 3.0.",
  },
  {
    id: "ryzen-7-3700x", name: "Ryzen 7 3700X", brand: "AMD", cap: 76, socket: "AM4",
    cores: 8, threads: 16, arch: "Zen 2 (7nm)", year: 2019, pcie: 4, memory: "DDR4-3200", boost: "4.4 GHz",
    blurb: "The Ryzen 7 3700X games almost exactly like a Ryzen 5 3600 with a little more clock speed. Its eight cores make it a better streaming and multitasking chip, which matters if you pick the Gaming + Stream setting below.",
  },
  {
    id: "ryzen-9-3900x", name: "Ryzen 9 3900X", brand: "AMD", cap: 80, socket: "AM4",
    cores: 12, threads: 24, arch: "Zen 2 (7nm)", year: 2019, pcie: 4, memory: "DDR4-3200", boost: "4.6 GHz",
    blurb: "The Ryzen 9 3900X is a workstation-class twelve-core chip, but in games it behaves like a slightly faster 3700X. Its two chiplets add latency when a game's threads cross between them. It is excellent at streaming while gaming, yet a modern six-core Zen 3 chip still beats it on pure frame rate.",
  },
  {
    id: "ryzen-5-5500", name: "Ryzen 5 5500", brand: "AMD", cap: 78, socket: "AM4",
    cores: 6, threads: 12, arch: "Zen 3 (7nm, Cezanne)", year: 2022, pcie: 3, memory: "DDR4-3200", boost: "4.2 GHz",
    blurb: "The Ryzen 5 5500 uses Zen 3 cores but is built from the APU die: it has only 16MB of L3 cache (half of the 5600) and is limited to PCIe 3.0 even on B550 boards. That makes it faster than a 3600 in most games yet noticeably behind a 5600. The PCIe 3.0 limit matters most with x8 graphics cards that have 8GB of VRAM.",
  },
  {
    id: "ryzen-5-5600", name: "Ryzen 5 5600", brand: "AMD", cap: 88, socket: "AM4",
    cores: 6, threads: 12, arch: "Zen 3 (7nm)", year: 2022, pcie: 4, memory: "DDR4-3200", boost: "4.4 GHz",
    blurb: "The Ryzen 5 5600 is the value pick of the AM4 era: full Zen 3 with 32MB of unified L3 cache and PCIe 4.0 support on B550 and X570. It is within a few percent of the 5600X in games, so it can feed a genuinely strong mid-range card at 1080p.",
  },
  {
    id: "ryzen-5-5600x", name: "Ryzen 5 5600X", brand: "AMD", cap: 90, socket: "AM4",
    cores: 6, threads: 12, arch: "Zen 3 (7nm)", year: 2020, pcie: 4, memory: "DDR4-3200", boost: "4.6 GHz",
    blurb: "The Ryzen 5 5600X brought Zen 3's unified cache to six cores and was the first AMD chip to beat Intel in most games. It remains a capable gaming CPU, comfortably feeding upper mid-range GPUs at 1080p and almost anything sensible at 1440p.",
  },
  {
    id: "ryzen-7-5700x", name: "Ryzen 7 5700X", brand: "AMD", cap: 94, socket: "AM4",
    cores: 8, threads: 16, arch: "Zen 3 (7nm)", year: 2022, pcie: 4, memory: "DDR4-3200", boost: "4.6 GHz",
    blurb: "The Ryzen 7 5700X is an eight-core Zen 3 chip with a 65W rating. In games it lands just above the 5600X, and its extra cores give it more room when you stream, record or keep a lot open in the background.",
  },
  {
    id: "ryzen-7-5800x3d", name: "Ryzen 7 5800X3D", brand: "AMD", cap: 122, socket: "AM4",
    cores: 8, threads: 16, arch: "Zen 3 + 3D V-Cache", year: 2022, pcie: 4, memory: "DDR4-3200", boost: "4.5 GHz",
    blurb: "The Ryzen 7 5800X3D stacks 96MB of L3 cache on Zen 3, which transforms gaming performance in cache-sensitive titles. It is the best CPU any AM4 board can take and keeps pace with many newer DDR5 chips, so it can drive high-end GPUs that would choke every other AM4 processor.",
  },
  // ── AMD AM5 ───────────────────────────────────────────────
  {
    id: "ryzen-5-7600", name: "Ryzen 5 7600", brand: "AMD", cap: 118, socket: "AM5",
    cores: 6, threads: 12, arch: "Zen 4 (5nm)", year: 2023, pcie: 5, memory: "DDR5-5200", boost: "5.1 GHz",
    blurb: "The Ryzen 5 7600 is the entry point to AM5: Zen 4 cores, DDR5 and PCIe 5.0. In games it is a big step over any non-X3D AM4 chip, and the platform has a long upgrade path, which makes it a safe base for a high-end GPU.",
  },
  {
    id: "ryzen-5-9600x", name: "Ryzen 5 9600X", brand: "AMD", cap: 125, socket: "AM5",
    cores: 6, threads: 12, arch: "Zen 5 (4nm)", year: 2024, pcie: 5, memory: "DDR5-5600", boost: "5.4 GHz",
    blurb: "The Ryzen 5 9600X brings Zen 5 to six cores. Its gaming lead over the 7600 is modest, but it is fast enough to feed upper high-end cards at 1080p and nearly any card at 1440p.",
  },
  {
    id: "ryzen-7-7700x", name: "Ryzen 7 7700X", brand: "AMD", cap: 128, socket: "AM5",
    cores: 8, threads: 16, arch: "Zen 4 (5nm)", year: 2022, pcie: 5, memory: "DDR5-5200", boost: "5.4 GHz",
    blurb: "The Ryzen 7 7700X is an eight-core Zen 4 chip with high clocks. It games slightly ahead of the 7600 and handles streaming more comfortably thanks to its extra cores.",
  },
  {
    id: "ryzen-7-7800x3d", name: "Ryzen 7 7800X3D", brand: "AMD", cap: 160, socket: "AM5",
    cores: 8, threads: 16, arch: "Zen 4 + 3D V-Cache", year: 2023, pcie: 5, memory: "DDR5-5200", boost: "5.0 GHz",
    blurb: "The Ryzen 7 7800X3D pairs Zen 4 with 96MB of stacked L3 cache and is one of the fastest gaming CPUs ever made. It can keep flagship GPUs busy at 1440p and most of them at 1080p, so bottlenecks with this chip are rare.",
  },
  {
    id: "ryzen-7-9800x3d", name: "Ryzen 7 9800X3D", brand: "AMD", cap: 175, socket: "AM5",
    cores: 8, threads: 16, arch: "Zen 5 + 3D V-Cache", year: 2024, pcie: 5, memory: "DDR5-6000", boost: "5.2 GHz",
    blurb: "The Ryzen 7 9800X3D moves the cache die under the cores, which allows higher clocks than the 7800X3D. It is the fastest gaming CPU on the market, and with it the GPU is almost always the limit.",
  },
  // ── Intel LGA1200 ─────────────────────────────────────────
  {
    id: "core-i5-10400f", name: "Core i5-10400F", brand: "Intel", cap: 70, socket: "LGA1200",
    cores: 6, threads: 12, arch: "Comet Lake (14nm)", year: 2020, pcie: 3, memory: "DDR4-2666", boost: "4.3 GHz",
    blurb: "The Core i5-10400F is a six-core Skylake-derived chip that sold in huge numbers in budget builds. It is limited to PCIe 3.0, and on B460/H410 boards to DDR4-2666 memory, which caps how much GPU it can feed in CPU-heavy games.",
  },
  {
    id: "core-i5-11400f", name: "Core i5-11400F", brand: "Intel", cap: 80, socket: "LGA1200",
    cores: 6, threads: 12, arch: "Rocket Lake (14nm)", year: 2021, pcie: 4, memory: "DDR4-3200", boost: "4.4 GHz",
    blurb: "The Core i5-11400F gets Rocket Lake's newer cores and PCIe 4.0 on B560 and Z590 boards. It is a solid step over the 10400F, especially when B560 lets you run faster memory.",
  },
  // ── Intel LGA1700 ─────────────────────────────────────────
  {
    id: "core-i3-12100f", name: "Core i3-12100F", brand: "Intel", cap: 82, socket: "LGA1700",
    cores: 4, threads: 8, arch: "Alder Lake (Intel 7)", year: 2022, pcie: 5, memory: "DDR4-3200 / DDR5-4800", boost: "4.3 GHz",
    blurb: "The Core i3-12100F has only four cores, but its Golden Cove cores are fast enough to beat many older six-core chips in games. Four cores do show their limits in heavily threaded games and when streaming, so stay conservative with Gaming + Stream.",
  },
  {
    id: "core-i5-12400f", name: "Core i5-12400F", brand: "Intel", cap: 94, socket: "LGA1700",
    cores: 6, threads: 12, arch: "Alder Lake (Intel 7)", year: 2022, pcie: 5, memory: "DDR4-3200 / DDR5-4800", boost: "4.4 GHz",
    blurb: "The Core i5-12400F is six performance cores with no efficiency cores, and it remains one of the best-value gaming CPUs. It works with cheap DDR4 boards, supports PCIe 4.0 for graphics on B660/B760 boards, and can feed upper mid-range GPUs at 1080p.",
  },
  {
    id: "core-i5-13400f", name: "Core i5-13400F", brand: "Intel", cap: 100, socket: "LGA1700",
    cores: 10, threads: 16, arch: "Raptor Lake (Intel 7)", year: 2023, pcie: 5, memory: "DDR4-3200 / DDR5-4800", boost: "4.6 GHz",
    blurb: "The Core i5-13400F adds four efficiency cores and more cache to the 12400F's design. Gaming gains are moderate, but the extra cores help when a game is running alongside a stream or voice chat and browser tabs.",
  },
  {
    id: "core-i5-12600k", name: "Core i5-12600K", brand: "Intel", cap: 112, socket: "LGA1700",
    cores: 10, threads: 16, arch: "Alder Lake (Intel 7)", year: 2021, pcie: 5, memory: "DDR4-3200 / DDR5-4800", boost: "4.9 GHz",
    blurb: "The Core i5-12600K is an unlocked hybrid chip with high boost clocks. It handles high-refresh gaming well and can feed strong GPUs, especially with fast DDR5.",
  },
  {
    id: "core-i5-13600k", name: "Core i5-13600K", brand: "Intel", cap: 128, socket: "LGA1700",
    cores: 14, threads: 20, arch: "Raptor Lake (Intel 7)", year: 2022, pcie: 5, memory: "DDR4-3200 / DDR5-5600", boost: "5.1 GHz",
    blurb: "The Core i5-13600K is a fourteen-core chip with more cache and clock speed than the 12600K. It games close to far more expensive chips and is strong for streaming. Keep the BIOS updated for Intel's Raptor Lake stability microcode.",
  },
  {
    id: "core-i5-14600k", name: "Core i5-14600K", brand: "Intel", cap: 132, socket: "LGA1700",
    cores: 14, threads: 20, arch: "Raptor Lake Refresh (Intel 7)", year: 2023, pcie: 5, memory: "DDR4-3200 / DDR5-5600", boost: "5.3 GHz",
    blurb: "The Core i5-14600K is a clock-bumped 13600K. It is one of the fastest chips on LGA1700 for the money; update the BIOS to the latest microcode before installing a new GPU.",
  },
  {
    id: "core-i7-14700k", name: "Core i7-14700K", brand: "Intel", cap: 145, socket: "LGA1700",
    cores: 20, threads: 28, arch: "Raptor Lake Refresh (Intel 7)", year: 2023, pcie: 5, memory: "DDR4-3200 / DDR5-5600", boost: "5.6 GHz",
    blurb: "The Core i7-14700K is the strongest sensible gaming chip on LGA1700, with twenty cores and high clocks. It feeds high-end GPUs at 1440p and is excellent for gaming while streaming.",
  },
  // ── Intel LGA1851 ─────────────────────────────────────────
  {
    id: "core-ultra-5-245k", name: "Core Ultra 5 245K", brand: "Intel", cap: 122, socket: "LGA1851",
    cores: 14, threads: 14, arch: "Arrow Lake (TSMC N3B)", year: 2024, pcie: 5, memory: "DDR5-6400", boost: "5.2 GHz",
    blurb: "The Core Ultra 5 245K drops Hyper-Threading and moves the memory controller off the compute tile, which adds latency in games. It is efficient and fine for high-end GPUs at 1440p, but at 1080p high refresh it trails the 14600K.",
  },
  {
    id: "core-ultra-7-265k", name: "Core Ultra 7 265K", brand: "Intel", cap: 135, socket: "LGA1851",
    cores: 20, threads: 20, arch: "Arrow Lake (TSMC N3B)", year: 2024, pcie: 5, memory: "DDR5-6400", boost: "5.5 GHz",
    blurb: "The Core Ultra 7 265K is Intel's strongest mainstream Arrow Lake chip for games. Fast DDR5 and the latest BIOS matter more here than on older platforms; with both, it can drive high-end GPUs well.",
  },
];

// Sorted by score ascending — recommendation logic relies on this order.
export const GPUS: Gpu[] = [
  { id: "rx-6600", name: "RX 6600", score: 50, price: 199, vram: 8, lanes: 8, watts: 132 },
  { id: "rtx-3060", name: "RTX 3060 12GB", score: 51, price: 259, vram: 12, lanes: 16, watts: 170 },
  { id: "arc-b570", name: "Arc B570", score: 54, price: 219, vram: 10, lanes: 8, watts: 150, highOverhead: true },
  { id: "rtx-5050", name: "RTX 5050", score: 55, price: 249, vram: 8, lanes: 8, watts: 130 },
  { id: "rx-7600", name: "RX 7600", score: 56, price: 249, vram: 8, lanes: 8, watts: 165 },
  { id: "rtx-4060", name: "RTX 4060", score: 60, price: 289, vram: 8, lanes: 8, watts: 115 },
  { id: "arc-b580", name: "Arc B580", score: 62, price: 259, vram: 12, lanes: 8, watts: 190, highOverhead: true },
  { id: "rtx-5060", name: "RTX 5060", score: 72, price: 299, vram: 8, lanes: 8, watts: 145 },
  { id: "rx-9060-xt", name: "RX 9060 XT 16GB", score: 78, price: 349, vram: 16, lanes: 16, watts: 160 },
  { id: "rx-7700-xt", name: "RX 7700 XT", score: 80, price: 379, vram: 12, lanes: 16, watts: 245 },
  { id: "rtx-5060-ti", name: "RTX 5060 Ti 16GB", score: 82, price: 429, vram: 16, lanes: 8, watts: 180 },
  { id: "rx-7800-xt", name: "RX 7800 XT", score: 92, price: 459, vram: 16, lanes: 16, watts: 263 },
  { id: "rtx-5070", name: "RTX 5070", score: 100, price: 549, vram: 12, lanes: 16, watts: 250 },
  { id: "rx-9070", name: "RX 9070", score: 108, price: 559, vram: 16, lanes: 16, watts: 220 },
  { id: "rtx-5070-ti", name: "RTX 5070 Ti", score: 122, price: 749, vram: 16, lanes: 16, watts: 300 },
  { id: "rx-9070-xt", name: "RX 9070 XT", score: 125, price: 649, vram: 16, lanes: 16, watts: 304 },
  { id: "rtx-5080", name: "RTX 5080", score: 140, price: 999, vram: 16, lanes: 16, watts: 360 },
  { id: "rtx-5090", name: "RTX 5090", score: 185, price: 1999, vram: 32, lanes: 16, watts: 575 },
];

export const GAMES: [string, number][] = [
  ["Cyberpunk 2077", 55],
  ["Call of Duty: Warzone", 110],
  ["Fortnite", 150],
  ["Counter-Strike 2", 230],
  ["Valorant", 300],
  ["Starfield", 50],
];

export const ogImagePath = (c: Cpu) => `/og/${cpuSlug(c)}.png`;
export const cpuSlug = (c: Cpu) => `best-gpu-for-${c.id}`;
export const cpuPath = (c: Cpu) => `/${cpuSlug(c)}/`;
export const findCpuBySlug = (slug: string) => CPUS.find((c) => cpuSlug(c) === slug);
export const findCpu = (id: string) => CPUS.find((c) => c.id === id);

export const affiliateUrl = (g: Gpu) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(g.name + " graphics card")}&tag=${SITE.amazonTag}`;
