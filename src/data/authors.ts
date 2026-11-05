import { SITE } from './site';

export interface Author {
  slug: string;
  name: string;
  role: string;
  initials: string;
  short: string;
  bio: string[];
  beat: string[];
  sameAs?: string[];
}

// Add real, named authors here (with a real bio and profile links) and point
// pages at them with "author": "<slug>". Pages without an author use the desk.
export const AUTHORS: Record<string, Author> = {
  'home-air-desk': {
    slug: 'home-air-desk',
    name: 'The Home Air Desk',
    role: 'Dehumidifier & Indoor Air Editors',
    initials: 'HA',
    short:
      'Our home air editors compare dehumidifiers on published DOE and ENERGY STAR data, manufacturer manuals, recall notices and thousands of owner reviews, then explain which one fits your space.',
    bio: [
      'The Home Air Desk covers dehumidifiers, hygrometers and moisture control for Enthusiast Review. We research every model on these pages against the 2019 DOE test standard, ENERGY STAR certification data, manufacturer manuals and the U.S. Consumer Product Safety Commission recall database.',
      'We read owner reviews in bulk to find the problems that only show up after a season — noisy compressors, failed pumps, buckets that crack — and we say so when a popular model has a recall history or a misleading pint rating.',
      'We do not accept payment for placement, and manufacturers never see a guide before it is published. When you buy through our links we may earn a commission, which never changes what we recommend.',
    ],
    beat: ['Portable and whole-house dehumidifiers', 'Crawl space and basement moisture', 'Desiccant and mini dehumidifiers', 'Hygrometers and humidity control', 'Energy use and running costs'],
  },
};

export const DEFAULT_AUTHOR = 'home-air-desk';
export const getAuthor = (slug?: string) => AUTHORS[slug ?? DEFAULT_AUTHOR] ?? AUTHORS[DEFAULT_AUTHOR];

export function authorSchema(slug?: string) {
  const a = getAuthor(slug);
  return {
    '@type': a.slug === DEFAULT_AUTHOR ? 'Organization' : 'Person',
    name: a.name,
    url: `${SITE.url}/authors/${a.slug}/`,
    ...(a.slug === DEFAULT_AUTHOR ? {} : { jobTitle: a.role }),
    ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
  };
}
