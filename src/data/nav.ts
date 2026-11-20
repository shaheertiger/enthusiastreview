// The "Best Lists" menu: five groups, the sister-site structure (besthometheaterreview.com).
// Used by the header mega menu, the mobile drawer and the home page's "Browse by Category".
// Guide entries name a slug; the build fails if that guide no longer exists.
import { GUIDES } from '../lib/data';

export interface NavItem {
  label: string;
  href: string;
  tagline: string;
  /** Category key for the icon (src/data/categories.ts), or one of the extra icons below. */
  icon: string;
  tool?: boolean;
}
export interface NavGroup {
  label: string;
  /** Shown on the home page's "Browse by Category"; the Database group is menu-only. */
  home: boolean;
  items: NavItem[];
}

/** Icons for menu entries that are not a product category (24x24 viewBox path data). */
export const EXTRA_ICONS: Record<string, string> = {
  tool: 'M5 3h14v18H5zM8 6h8v3H8zM8 12h2M11 12h2M14 12h2M8 15h2M11 15h2M14 15h2M8 18h2M11 18h5',
  gear: 'M4 5h16M4 12h16M4 19h16M8 3v4M15 10v4M11 17v4',
  brand: 'M4 4h7l9 9-7 7-9-9zM8 8h.01',
  compare: 'M3 5h7v14H3zM14 5h7v14h-7zM12 3v18',
  glossary: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',
  score: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
};

const guide = (slug: string, label: string, tagline: string): NavItem => {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) throw new Error(`src/data/nav.ts: no guide "${slug}"`);
  return { label, href: `/${slug}/`, tagline, icon: g.category };
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Graphics Cards',
    home: true,
    items: [
      guide('best-graphics-card', 'Best Graphics Cards', 'Every price band, 1080p to 4K'),
      guide('best-budget-graphics-card', 'Best Budget GPUs', 'The most frames for the money'),
      guide('best-graphics-card-for-1440p', 'Best GPUs for 1440p', 'High refresh at 2560 x 1440'),
      guide('best-nvidia-graphics-card', 'Best NVIDIA Cards', 'GeForce RTX, ranked'),
      guide('best-amd-graphics-card', 'Best AMD Cards', 'Radeon RX, ranked'),
      guide('amd-vs-nvidia-gpu-equivalents', 'AMD vs NVIDIA Equivalents', 'Which card matches which'),
      guide('intel-arc-gpu-equivalents', 'Intel Arc Equivalents', 'Arc vs GeForce and Radeon'),
    ],
  },
  {
    label: 'CPUs, Boards & RAM',
    home: true,
    items: [
      guide('best-cpu-for-gaming', 'Best CPUs for Gaming', 'AM5, AM4 and Intel picks'),
      guide('best-amd-cpu-for-gaming', 'Best AMD CPUs', 'Ryzen, X3D included'),
      guide('best-am5-motherboard', 'Best AM5 Motherboards', 'B650, B850 and X870 boards'),
      guide('best-ram-for-gaming', 'Best RAM for Gaming', 'DDR5 and DDR4 kits'),
      guide('intel-vs-amd-cpu-equivalents', 'Intel vs AMD Equivalents', 'Which chip matches which'),
      { label: 'Bottleneck Calculator', href: '/tools/bottleneck-calculator/', tagline: 'Check a CPU and GPU pairing', icon: 'tool', tool: true },
    ],
  },
  {
    label: 'Cooling & Power',
    home: true,
    items: [
      guide('best-cpu-cooler', 'Best CPU Coolers', 'Air towers and AIOs'),
      guide('best-cpu-cooler-for-ryzen-7-9800x3d', 'Best Coolers for 9800X3D', 'Sized for a hot X3D chip'),
      guide('thermalright-review', 'Best Thermalright Coolers', 'The value cooler brand, ranked'),
      guide('best-power-supply', 'Best Power Supplies', 'Wattage, connectors, warranty'),
      guide('best-psu-under-100', 'Best PSUs Under $100', 'Safe units on a budget'),
      { label: 'PSU Calculator', href: '/tools/psu-calculator/', tagline: 'Work out the wattage you need', icon: 'tool', tool: true },
    ],
  },
  {
    label: 'Cases & Storage',
    home: true,
    items: [
      guide('best-pc-case', 'Best PC Cases', 'Airflow, fit and build ease'),
      guide('best-pc-cases-under-50', 'Best Cases Under $50', 'Cheap cases that still breathe'),
      guide('best-ssd-for-gaming', 'Best SSDs for Gaming', 'NVMe by speed and price per TB'),
      guide('how-to-check-what-graphics-card-i-have', 'Check Your Graphics Card', 'Find the GPU in any PC'),
      guide('how-to-update-nvidia-drivers', 'Update NVIDIA Drivers', 'The clean way, step by step'),
    ],
  },
  {
    label: 'Database',
    home: false,
    items: [
      { label: 'All PC Gear', href: '/gear/', tagline: 'Every part we track, scored', icon: 'gear' },
      { label: 'Brands', href: '/brands/', tagline: 'Every brand and its lineup', icon: 'brand' },
      { label: 'Equivalents Charts', href: '/equivalents/', tagline: 'Which GPU or CPU matches which', icon: 'compare' },
      { label: 'Compare Two Products', href: '/compare/', tagline: 'Head-to-head spec sheets', icon: 'compare' },
      { label: 'Glossary', href: '/glossary/', tagline: 'Spec-sheet terms explained', icon: 'glossary' },
      { label: 'How We Score', href: '/how-we-review/', tagline: 'What the ER Score weighs', icon: 'score' },
    ],
  },
];
