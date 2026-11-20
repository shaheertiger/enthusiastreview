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
  /** Person only: real credentials, emitted in schema exactly as written. */
  credential?: string;
  alumniOf?: string;
  worksFor?: string;
  knowsAbout?: string[];
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
  // Content reviewer. His field is food science, not PC hardware: credit him for what he did
  // (reviewing the site's research method, sourcing and accuracy) and never as a hardware tester.
  'adam-franczyk': {
    slug: 'adam-franczyk',
    name: 'Adam Franczyk, PhD',
    role: 'Research Reviewer',
    initials: 'AF',
    short:
      'Adam Franczyk is a research scientist (PhD, University of Manitoba) who reviewed our research method, sourcing and claims for accuracy across the site.',
    bio: [
      'Adam Franczyk holds a PhD and an MSc in Food and Human Nutritional Sciences from the University of Manitoba, where he is now a postdoctoral researcher. His field is protein quality: he has evaluated thousands of samples, developed and tested four laboratory SOPs (one validated by the American Oil Chemists\' Society) and published peer-reviewed work in Cereal Chemistry and the Journal of Food Composition and Analysis.',
      `For ${SITE.name} he reviewed the research method behind every page: how sources are chosen and cited, how spec-sheet figures and independent measurements are used, how the score is built, and whether claims are stated plainly and honestly, including that we have not bench-tested these parts.`,
      'He is not a PC hardware specialist and did not test or rank individual products. Product picks and write-ups come from the Hardware Desk.',
    ],
    beat: ['Research method and sourcing', 'Accuracy of claims and citations', 'How the score is built', 'Plain disclosure of what was and was not tested'],
    sameAs: ['https://www.linkedin.com/in/ajf17/'],
    credential: 'PhD, Food and Human Nutritional Sciences',
    alumniOf: 'University of Manitoba',
    worksFor: 'University of Manitoba',
    knowsAbout: ['Research methodology', 'Scientific writing', 'Laboratory method validation', 'Data analysis'],
  },
};

export const DEFAULT_AUTHOR = 'hardware-desk';
/** Reviewed the whole site's research method and content (shown as "Reviewed by"). */
export const SITE_REVIEWER = 'adam-franczyk';
export const getAuthor = (slug?: string) => AUTHORS[slug ?? DEFAULT_AUTHOR] ?? AUTHORS[DEFAULT_AUTHOR];

export function authorSchema(slug?: string) {
  const a = getAuthor(slug);
  return {
    '@type': a.slug === DEFAULT_AUTHOR ? 'Organization' : 'Person',
    name: a.name,
    url: `${SITE.url}/authors/${a.slug}/`,
    ...(a.slug === DEFAULT_AUTHOR ? {} : { jobTitle: a.role }),
    ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
    ...(a.credential ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: a.credential } } : {}),
    ...(a.alumniOf ? { alumniOf: { '@type': 'CollegeOrUniversity', name: a.alumniOf } } : {}),
    ...(a.worksFor ? { worksFor: { '@type': 'CollegeOrUniversity', name: a.worksFor } } : {}),
    ...(a.knowsAbout?.length ? { knowsAbout: a.knowsAbout } : {}),
  };
}
