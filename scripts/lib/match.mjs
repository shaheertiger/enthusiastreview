// Strict product-title matching used by fetch-product-images.mjs.
const squash = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const BRAND_ALIASES = { 'black+decker': ['black+decker', 'black & decker', 'black and decker', 'blackdecker'], homelabs: ['homelabs', 'home labs'], "de'longhi": ['delonghi', "de'longhi"], 'eva-dry': ['eva-dry', 'eva dry', 'evadry'], 'dri-eaz': ['dri-eaz', 'drieaz', 'dri eaz'], 'santa fe': ['santa fe', 'santa-fe'], 'pro breeze': ['pro breeze', 'probreeze'] };

/** Model numbers: tokens mixing letters and digits, e.g. FFAD5033W1, TP50AWKN, HD55, EDV-2400, E070. */
export function modelTokens(name) {
  return [...new Set((name.match(/\b[A-Za-z]*\d+[A-Za-z0-9-]*\b|\b[A-Za-z]+-\d+[A-Za-z0-9-]*\b/g) ?? [])
    .map(squash)
    .filter((t) => /[a-z]/.test(t) && /\d/.test(t) && t.length >= 3 && !/^\d+(pint|pt|sqft|ft|oz|g|l|cfm|v|w|lb|lbs|qt)$/.test(t)))];
}
function brandOf(name) {
  const lower = name.toLowerCase();
  for (const [b, alts] of Object.entries(BRAND_ALIASES)) if (alts.some((a) => lower.startsWith(a))) return alts;
  return [lower.split(/\s+/)[0].replace(/[^a-z0-9+-]/g, '')];
}
const pintsOf = (s) => s.match(/(\d{2,3})[\s-]*(?:pint|pt\b)/i)?.[1];

export function isMatch(name, title) {
  if (!title) return false;
  const t = title.toLowerCase();
  const tq = squash(title);
  const brandOk = brandOf(name).some((b) => t.includes(b) || tq.includes(squash(b)));
  if (!brandOk) return false;
  const models = modelTokens(name);
  if (models.length) {
    // Whole-token match: "HDi65" must not match "HDi65S", "FFAD5033W1" not "FFAD5033W1A".
    const tokens = title.split(/[\s,()/|:;+\[\]]+/).map(squash).filter(Boolean);
    const joined = new Set(tokens.flatMap((t, i) => [t, t + (tokens[i + 1] ?? '')])); // "EDV 2400" → "edv2400"
    return models.some((m) => joined.has(m));
  }
  const pints = pintsOf(name);
  if (pints) return pintsOf(title) === pints;
  // No model number or pint size: every distinctive word of the name must appear.
  const generic = new Set(['with', 'for', 'and', 'the', 'dehumidifier', 'dehumidifiers', 'portable', 'compact', 'energy', 'star', 'home', 'smart', 'quiet', 'small', 'large', 'new']);
  const words = name.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !generic.has(w));
  const rest = words.filter((w) => !brandOf(name).some((b) => squash(b).includes(w)));
  return rest.length >= 2 && rest.every((w) => t.includes(w)); // brand alone is never enough
}

