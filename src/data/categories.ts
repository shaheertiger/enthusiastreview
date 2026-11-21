// Product categories. Order = order on hubs, menus and the home page.
export interface CategoryInfo {
  key: string;
  label: string; // "Graphics Cards"
  singular: string; // "graphics card"
  plural: string; // "graphics cards"
  group: 'Components' | 'Cooling & Power' | 'Build' | 'Systems';
  /** Guide that answers "best <category>". */
  hero: string;
  blurb: string;
  icon: string; // SVG path data, 24x24 viewBox
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'gaming-pcs', label: 'Gaming PCs', singular: 'gaming PC', plural: 'gaming PCs', group: 'Systems', hero: 'best-prebuilt-gaming-pc', blurb: 'Prebuilt gaming PCs judged on the parts inside, not the RGB.', icon: 'M7 2h10v20H7zM10 5h4M10 8h4M12 17m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M3 9h2M3 13h2M19 9h2M19 13h2' },
  { key: 'graphics-cards', label: 'Graphics Cards', singular: 'graphics card', plural: 'graphics cards', group: 'Components', hero: 'best-graphics-card', blurb: 'GPUs matched to resolution, refresh rate and budget.', icon: 'M2 7h20v10H2zM6 17v3M10 17v3M14 17v3M18 17v3M8 10.5a2.5 2.5 0 1 0 0 .01M16 10.5a2.5 2.5 0 1 0 0 .01' },
  { key: 'processors', label: 'Processors', singular: 'CPU', plural: 'CPUs', group: 'Components', hero: 'best-cpu-for-gaming', blurb: 'Gaming and workstation CPUs, by platform and price.', icon: 'M7 7h10v10H7zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3' },
  { key: 'cpu-coolers', label: 'CPU Coolers', singular: 'CPU cooler', plural: 'CPU coolers', group: 'Cooling & Power', hero: 'best-cpu-cooler', blurb: 'Air towers and AIOs sized to your CPU and case.', icon: 'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 4c2 3 2 5 0 6M20 12c-3 2-5 2-6 0M12 20c-2-3-2-5 0-6M4 12c3-2 5-2 6 0' },
  { key: 'power-supplies', label: 'Power Supplies', singular: 'power supply', plural: 'power supplies', group: 'Cooling & Power', hero: 'best-power-supply', blurb: 'PSUs with the wattage, connectors and warranty you need.', icon: 'M3 6h18v12H3zM13 8l-3 4h4l-3 4M17 10v4' },
  { key: 'pc-cases', label: 'PC Cases', singular: 'PC case', plural: 'PC cases', group: 'Build', hero: 'best-pc-case', blurb: 'Cases picked for airflow, fit and build ease.', icon: 'M6 2h12v20H6zM9 5h6M9 8h6M12 17m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0' },
  { key: 'memory', label: 'Memory', singular: 'RAM kit', plural: 'RAM kits', group: 'Components', hero: 'best-ram-for-gaming', blurb: 'DDR5 and DDR4 kits at the speed your CPU likes.', icon: 'M2 8h20v8H2zM5 16v3M9 16v3M13 16v3M17 16v3M5 11h2v2H5zM10 11h2v2h-2zM15 11h2v2h-2z' },
  { key: 'motherboards', label: 'Motherboards', singular: 'motherboard', plural: 'motherboards', group: 'Build', hero: 'best-am5-motherboard', blurb: 'AM5 and AM4 boards by chipset, features and power delivery.', icon: 'M3 3h18v18H3zM7 7h5v5H7zM15 7h2v10h-2zM7 15h5v2H7z' },
  { key: 'storage', label: 'SSDs', singular: 'SSD', plural: 'SSDs', group: 'Build', hero: 'best-ssd-for-gaming', blurb: 'NVMe drives by speed, endurance and price per terabyte.', icon: 'M2 9h20v6H2zM5 12h6M15 11v2M18 11v2' },
];

export const CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<string, CategoryInfo>;
