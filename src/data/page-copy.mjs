// Page-specific boilerplate (ranking method §1c: remove the template fingerprint).
//
// The disclosure, the byline's method line and the "why trust us" box used to be the same
// paragraph on every page. They now depend on the page type and topic, and rotate between
// several wordings, so no two neighbouring pages read the same. Plain JS so both the Astro
// template and scripts/build-markdown.mjs can import it.

/** Deterministic small hash of a slug, used to rotate wordings. */
export const hashOf = (s) => [...s].reduce((h, c, i) => (h * 31 + c.charCodeAt(0) + i) >>> 0, 7);
const pick = (page, list, salt = 0) => list[(hashOf(page.slug) + salt) % list.length];

/** The search a page targets: `query`, else the title before "(2026)", ":" or "?". */
export const queryOf = (p) => (p.query ?? p.title.split(/\s+\(\d{4}\)|[:?]|\s+[|–—]\s+/)[0]).trim();

/**
 * Page type from the ranking method (§2), mapped onto this site's sections and categories.
 *   A question  · C brand · D roundup · E fix · F versus · G store
 * (There are no single-model reviews (B) on this site yet.)
 */
export function pageType(p) {
  if (p.section === 'compare' || /\bvs\.?\b/i.test(p.title) && p.section === 'guides') return 'F';
  if (p.category === 'Brands') return 'C';
  if (p.category === 'Retailers') return 'G';
  if (p.section === 'best') return 'D';
  if (p.category === 'How-To & Fixes') return 'E';
  return 'A';
}

const QUESTION = /^(how|what|why|when|where|which|who|can|could|does|do|is|are|should|will)\b/i;

/** "<Search>: The Short Answer" (§4, first H2). Questions keep their question mark. */
export function shortAnswerHeading(p) {
  const q = queryOf(p);
  return QUESTION.test(q) ? `${q.replace(/\?$/, '')}? The Short Answer` : `${q}: The Short Answer`;
}

/** Topic phrase for running text, from the page's nav label. */
function topic(p) {
  const n = p.navLabel ?? queryOf(p).replace(/^(best|quietest)\s+/i, '');
  if (p.category === 'Brands' || p.category === 'Retailers' || p.category === 'Comparisons') return n;
  // "Basements" → "basements"; keep acronyms and model-like tokens ("RV", "50-Pint" → "50-pint").
  return n.replace(/\b([A-Z])([a-z]+)\b/g, (_, a, b) => a.toLowerCase() + b);
}

/** One-line method note for the byline (§4): accurate to what each page type is based on. */
export function methodNote(p) {
  switch (pageType(p)) {
    case 'C': return `Based on ${p.navLabel ?? 'the brand'}’s spec sheets and manuals, DOE and ENERGY STAR listings, CPSC recalls and owner reports`;
    case 'G': return `Based on the store’s own listings and policies, DOE ratings and owner reports`;
    case 'F': return 'Based on published specs, DOE ratings, warranties and owner reports';
    case 'E': return 'Based on manufacturer manuals, service guides and owner reports';
    case 'A': return p.category === 'Mold & Allergies'
      ? 'Based on EPA and health-agency guidance, DOE data and manufacturer specs'
      : 'Based on DOE and ENERGY STAR data, manufacturer manuals and EPA guidance';
    default: return pick(p, [
      'Based on 2019 DOE ratings, manufacturer manuals and owner reports',
      'Based on DOE and ENERGY STAR listings, manuals and recall records',
      'Based on published DOE capacities, specs and owner reviews',
    ]);
  }
}

/** Affiliate disclosure near the top. Plain Markdown-style text with one [link](/path/). */
export function disclosure(p) {
  const t = topic(p);
  const hasProducts = (p.products ?? []).length > 0;
  if (!hasProducts) {
    return pick(p, [
      'This guide links to products on Amazon. If you buy through those links we may earn a commission, at no cost to you. [How we make money](/disclosure/).',
      'Some links here go to Amazon, and we may earn a commission if you buy. It never decides what we recommend. [Our disclosure](/disclosure/).',
    ]);
  }
  const type = pageType(p);
  if (type === 'C') {
    return pick(p, [
      `${t} doesn’t pay us or see this page before it goes up. If you buy through our Amazon links we may earn a commission. [How we review](/how-we-review/).`,
      `We picked these ${t} models ourselves; no brand paid for a spot. Buying through our links may earn us a commission at no cost to you. [How we review](/how-we-review/).`,
    ]);
  }
  if (type === 'F') {
    return `Neither brand paid for this comparison. If you buy either machine through our links we may earn a commission at no cost to you. [How we review](/how-we-review/).`;
  }
  return pick(p, [
    `No manufacturer paid to be on this list. If you buy through our Amazon links we may earn a commission at no cost to you. [How we review](/how-we-review/).`,
    `These ${t} picks come from published ratings and owner reports, not paid placement. We may earn a commission when you buy through our links. [How we review](/how-we-review/).`,
    `We earn a commission on some purchases made through links on this page, at no cost to you. It never changes the order of the picks. [How we review](/how-we-review/).`,
    `Affiliate links help fund this site: we may earn a commission if you buy, and nobody can pay for a place on the list. [How we review](/how-we-review/).`,
    `Independent picks; affiliate links. Buying through them may earn us a commission at no extra cost to you. [How we review](/how-we-review/).`,
  ], 3);
}

/** The "why trust us" box at the end: heading and paragraph vary by page type and topic. */
export function trustBox(p, siteName) {
  const t = topic(p);
  const heading = pick(p, [`Why trust ${siteName}?`, 'How this guide was researched', 'Where our information comes from', 'About our sources'], 5);
  const close = ' We haven’t run these machines in a lab, and we say so; every figure is attributed to the rating, manual or report it comes from.';
  let text;
  switch (pageType(p)) {
    case 'C':
      text = `Every ${t} model here was checked against ${t}’s own spec sheets and manuals, its ENERGY STAR and DOE listings, the CPSC recall database and the complaints that keep recurring in owner reviews. We update this page when ${t} discontinues, recalls or replaces a model.`;
      break;
    case 'G':
      text = `We checked what ${t} actually stocks against the manufacturers’ DOE ratings, then read the store’s delivery, return and price-match terms. Store listings change often, so we recheck this page regularly and note when a model drops out.`;
      break;
    case 'F':
      text = `Both machines were compared on the same data: capacity under the 2019 DOE test (not the older, inflated ratings), ENERGY STAR efficiency, warranty terms, recall history and patterns in owner reviews.`;
      break;
    case 'E':
      text = `The steps here come from manufacturer manuals and service documentation, cross-checked against the fixes owners report actually worked. When a fault needs a technician or a warranty claim, we say so rather than suggest a risky repair.`;
      break;
    case 'A':
      text = p.category === 'Mold & Allergies'
        ? `Health claims here follow EPA and public-health guidance, and humidity targets come from those sources rather than from manufacturers. We are not doctors; see a professional for medical advice.`
        : `The numbers on this page come from DOE test procedures, ENERGY STAR data, EPA guidance and manufacturer manuals, and we link to the guide that goes deeper wherever a topic needs it.`;
      break;
    default:
      text = pick(p, [
        `For ${t}, we compared capacity under the 2019 DOE standard, ENERGY STAR efficiency, drainage, operating temperature and recall history, then read owner reviews for the problems that only appear after a season.`,
        `The ${t} picks above were narrowed from current listings using DOE pint ratings (not the old 2012 numbers), manufacturer manuals, the CPSC recall database and recurring themes in owner reviews.`,
        `We weigh what matters for ${t}: real DOE capacity, how the water leaves the machine, noise and cold-weather limits. Picks are rechecked when models are discontinued, recalled or replaced, and no placement is paid.`,
      ], 1);
  }
  return { heading, text: text + close };
}
