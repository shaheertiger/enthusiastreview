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
// guides at them with "author": "<slug>". Pages without an author use the desk.
export const AUTHORS: Record<string, Author> = {
  'hardware-desk': {
    slug: 'hardware-desk',
    name: 'The Hardware Desk',
    role: 'PC Hardware Editors',
    initials: 'HW',
    short:
      'Our hardware editors compare PC parts on spec sheets, platform requirements, widely published independent measurements and owner reports, then match each part to the build it suits.',
    bio: [
      `The Hardware Desk covers graphics cards, processors, coolers, power supplies, cases, memory, motherboards and SSDs for ${SITE.name}. We have covered PC building since ${SITE.founded}.`,
      'Every pick is researched against the manufacturer spec sheet, platform documentation (sockets, chipsets, BIOS requirements, connector standards) and the independent reviews and measurements published by the wider hardware press. We read owner reports in bulk to find the problems that show up after months: coil whine, failed fans, BIOS bugs, poor stock.',
      'We have not bench-tested these parts ourselves, and every page says so. We do not accept payment for placement. When you buy through our links we may earn a commission, which never changes what we recommend.',
    ],
    beat: ['Graphics cards and CPUs', 'Air and liquid CPU cooling', 'Power supplies and ATX 3.1', 'Cases, motherboards and memory', 'NVMe storage'],
  },
};

export const DEFAULT_AUTHOR = 'hardware-desk';
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
