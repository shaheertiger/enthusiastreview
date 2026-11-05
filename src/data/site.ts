// Single source of truth for the site's identity.
export const SITE = {
  name: 'Enthusiast Review',
  url: 'https://www.enthusiastreview.com',
  tagline: 'Independent dehumidifier reviews, buying guides and fixes',
  email: 'editors@enthusiastreview.com', // confirm this mailbox exists before launch
  founded: '2024',
  updated: '2026-11-05',
};

export const SECTIONS = {
  best: { label: 'Best Picks', path: '/best/', blurb: 'Ranked shortlists for every room, budget, brand and job.' },
  guides: { label: 'Buying Guides', path: '/guides/', blurb: 'Sizing, settings, running costs and troubleshooting.' },
  compare: { label: 'Comparisons', path: '/compare/', blurb: 'Brand-against-brand breakdowns, side by side.' },
} as const;

export type SectionKey = keyof typeof SECTIONS;

// Categories used to group pages on hubs and in the main navigation.
export const CATEGORIES = [
  'Top Picks',
  'Rooms & Spaces',
  'Mold & Allergies',
  'Specialty & Storage',
  'Size & Features',
  'Brands',
  'Retailers',
  'How-To & Fixes',
  'Buying Advice',
  'Comparisons',
] as const;
export type Category = (typeof CATEGORIES)[number];
