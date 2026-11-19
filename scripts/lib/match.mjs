// Strict Amazon listing rules for scripts/fetch-product-images.mjs.
//
// Each product id has a rule: every `all` pattern must match the Amazon title, no `none`
// pattern may match, and `prefer` patterns rank otherwise-equal listings (the first listing
// in Amazon's relevance order wins ties). `q` overrides the search words. A wrong match sends
// readers to the wrong part, so a product with no rule, or no listing passing its rule, is
// left unmatched and keeps its tagged Amazon search link.
//
// Graphics cards: AMD, NVIDIA and Intel sell through partner brands, so a GPU's photo and
// direct link are one partner card of that exact GPU and memory size (never the Ti, XT, 8 GB
// or laptop variant). The product page captions the listing it shows.

const r = (s) => new RegExp(s, 'i');

/** Listings that are never the product itself, whatever the category. */
export const NEVER = r(String.raw`\b(renewed|refurbished|pre-?owned|open box|used|replacement for|compatible with|compatible \w+ for|memory for|for parts|gaming pc(?!\s*case)|desktop pc(?!\s*case)|gaming desktop(?!\s*case)|prebuilt|pre-built|gaming computer(?!\s*case))\b`);
const BUNDLE = String.raw`\s\+\s+(asus|msi|gigabyte|asrock|amd|intel|nzxt|corsair|aorus|rog|tuf)\b|\bbundle\b|\bcombo\b|\bkit with\b|micro center|\bwith (asus|msi|gigabyte|asrock)\b`;
const GPU_NOT = String.raw`laptop|notebook|\bmobile\b|${BUNDLE}`;
const CPU_NOT = String.raw`${BUNDLE}|motherboard|tray\b`;
const RAM_NOT = String.raw`sodimm|so-dimm|laptop|notebook|\becc\b|server`;
const ACCESSORY = String.raw`\b(fan kit|bracket|riser|cable kit|replacement panel|mount kit|side panel only)\b`;

export const RULES = {
  // ---- graphics cards
  'rtx-5090': { all: [String.raw`rtx\W*5090\b`, String.raw`32\s*g`], none: [String.raw`5090\s*d\b`, GPU_NOT] },
  'rtx-5080': { all: [String.raw`rtx\W*5080\b`, String.raw`16\s*g`], none: [String.raw`super`, GPU_NOT] },
  'rtx-5070-ti': { all: [String.raw`rtx\W*5070\s*ti\b`, String.raw`16\s*g`], none: [String.raw`super`, GPU_NOT] },
  'rtx-5070': { all: [String.raw`rtx\W*5070\b`, String.raw`12\s*g`], none: [String.raw`5070\s*ti|\bti\b|super`, GPU_NOT] },
  'rtx-5060-ti-16gb': { all: [String.raw`rtx\W*5060\s*ti\b`, String.raw`\b16\s*g`], none: [String.raw`\b8\s*gb?\b`, GPU_NOT] },
  'rtx-5060': { all: [String.raw`rtx\W*5060\b`, String.raw`\b8\s*g`], none: [String.raw`5060\s*ti|\bti\b`, GPU_NOT] },
  'rx-9070-xt': { all: [String.raw`rx\s*9070\s*xt`, String.raw`16\s*g`], none: [GPU_NOT] },
  'rx-9070': { all: [String.raw`rx\s*9070\b`, String.raw`16\s*g`], none: [String.raw`9070\s*xt|\bxt\b|\bgre\b`, GPU_NOT] },
  'rx-9060-xt-16gb': { all: [String.raw`rx\s*9060\s*xt`, String.raw`\b16\s*g`], none: [String.raw`\b8\s*gb?\b`, GPU_NOT] },
  'rx-6600': { all: [String.raw`rx\s*6600\b`, String.raw`\b8\s*g`], none: [String.raw`6600\s*xt|\bxt\b`, GPU_NOT] },
  'rx-6700-xt': { all: [String.raw`rx\s*6700\s*xt`, String.raw`12\s*g`], none: [GPU_NOT] },
  'rtx-4060': { all: [String.raw`rtx\W*4060\b`, String.raw`\b8\s*g`], none: [String.raw`4060\s*ti|\bti\b`, GPU_NOT] },
  'rtx-4070': { all: [String.raw`rtx\W*4070\b`, String.raw`12\s*g`], none: [String.raw`4070\s*(ti|super)|\bti\b|super`, GPU_NOT] },
  'arc-b580': { q: 'Intel Arc B580 12GB graphics card', all: [String.raw`\bb580\b`, String.raw`^(intel|asrock|sparkle|acer|gunnir|onix|maxsun)\b`], none: [String.raw`\bb570\b|\bpro\b`, GPU_NOT] },

  // ---- processors
  'ryzen-7-9800x3d': { all: [String.raw`ryzen\W*7\s*9800x3d\b`], none: [CPU_NOT] },
  'ryzen-9-9950x3d': { all: [String.raw`ryzen\W*9\s*9950x3d\b`], none: [String.raw`9950x3d2`, CPU_NOT] },
  'ryzen-7-9700x': { all: [String.raw`ryzen\W*7\s*9700x\b`], none: [CPU_NOT] },
  'ryzen-5-9600x': { all: [String.raw`ryzen\W*5\s*9600x\b`], none: [CPU_NOT] },
  'ryzen-7-7800x3d': { all: [String.raw`ryzen\W*7\s*7800x3d\b`], none: [CPU_NOT] },
  'ryzen-5-7600': { all: [String.raw`ryzen\W*5\s*7600\b`], none: [String.raw`7600x`, CPU_NOT] },
  'core-ultra-7-265k': { all: [String.raw`^intel`, String.raw`ultra\s*7\b`, String.raw`\b265k\b`], none: [String.raw`265kf|270k`, CPU_NOT] },
  'core-ultra-5-245k': { all: [String.raw`^intel`, String.raw`ultra\s*5\b`, String.raw`\b245k\b`], none: [String.raw`245kf|250k`, CPU_NOT] },
  'ryzen-7-5800x3d': { all: [String.raw`ryzen\W*7\s*5800x3d\b`], none: [String.raw`anniversary`, CPU_NOT] },
  'ryzen-7-5800x': { all: [String.raw`ryzen\W*7\s*5800x\b`], none: [CPU_NOT] },
  'ryzen-7-8700f': { all: [String.raw`ryzen\W*7\s*8700f\b`], none: [CPU_NOT] },
  'core-i9-14900k': { all: [String.raw`^intel`, String.raw`i9-?\s*14900k\b`], none: [String.raw`14900kf|14900ks`, CPU_NOT] },
  'ryzen-7-5700x3d': { all: [String.raw`ryzen\W*7\s*5700x3d\b`], none: [CPU_NOT] },

  // ---- CPU coolers
  'thermalright-peerless-assassin-120-se': { all: [String.raw`^thermalright`, String.raw`peerless\s*assassin\s*120\s*se\b`], none: [String.raw`\bv2\b|argb|white|digital|plus`] },
  'thermalright-phantom-spirit-120-se': { all: [String.raw`^thermalright`, String.raw`phantom\s*spirit\s*120\s*se\b|ps120se`], none: [String.raw`argb|white|evo|digital`] },
  'thermalright-assassin-x-120-refined-se': { all: [String.raw`^thermalright`, String.raw`assassin\s*x\s*120\s*(refined|r)\s*se\b`], none: [String.raw`argb|plus|white`] },
  'noctua-nh-d15-g2': { all: [String.raw`^noctua`, String.raw`nh-?d15\s*g2\b`], none: [String.raw`\blbc\b|\bhbc\b|chromax`] },
  'noctua-nh-u12s-redux': { all: [String.raw`^noctua`, String.raw`nh-?u12s\s*redux`], none: [String.raw`upgrade kit|na-fk1`] },
  'arctic-freezer-36': { all: [String.raw`^arctic`, String.raw`freezer\s*36\b`], none: [String.raw`a-?rgb|36-s\b|liquid`] },
  'be-quiet-dark-rock-pro-5': { all: [String.raw`^be\s*quiet`, String.raw`dark\s*rock\s*pro\s*5\b`] },
  'arctic-liquid-freezer-iii-pro-360': { all: [String.raw`^arctic`, String.raw`liquid\s*freezer\s*iii\s*pro\s*360\b`], none: [String.raw`a-?rgb`] },

  // ---- power supplies
  'corsair-rm850x': { all: [String.raw`^corsair`, String.raw`\brm850x\b`], none: [String.raw`shift|white|\bsf\b`], prefer: [String.raw`atx\s*3\.1|2024|12v-2x6`] },
  'corsair-rm1000x': { all: [String.raw`^corsair`, String.raw`\brm1000x\b`], none: [String.raw`shift|white`], prefer: [String.raw`atx\s*3\.1|2024|12v-2x6`] },
  'corsair-rm750e': { all: [String.raw`^corsair`, String.raw`\brm750e\b`], prefer: [String.raw`atx\s*3\.1|12v-2x6`] },
  'msi-mag-a750gl-pcie5': { all: [String.raw`^msi`, String.raw`a750gl`], prefer: [String.raw`pcie\s*5`] },
  'seasonic-focus-gx-850': { all: [String.raw`seasonic`, String.raw`focus\s*gx-?850\b`], prefer: [String.raw`atx\s*3|12v-2x6|pcie\s*5`] },
  'be-quiet-pure-power-12-m-750': { all: [String.raw`^be\s*quiet`, String.raw`pure\s*power\s*12\s*m\b`, String.raw`\b750\s*w`] },
  'montech-century-ii-850': { all: [String.raw`montech`, String.raw`century\s*ii\b`, String.raw`\b850\s*w?\b`] },

  // ---- cases
  'lian-li-lancool-217': { all: [String.raw`lian\s*li`, String.raw`lancool\s*217\b`], none: [ACCESSORY] },
  'lian-li-lancool-207': { all: [String.raw`lian\s*li`, String.raw`lancool\s*207\b`], none: [ACCESSORY] },
  'lian-li-o11-dynamic-evo': { all: [String.raw`lian\s*li`, String.raw`o11\s*dynamic\s*evo\b`], none: [String.raw`evo\s*(xl|rgb)\b`, ACCESSORY] },
  'fractal-design-north': { all: [String.raw`^fractal`, String.raw`\bnorth\b`], none: [String.raw`north\s*xl|momentum`, ACCESSORY] },
  'fractal-design-pop-air': { all: [String.raw`^fractal`, String.raw`pop\s*air\b`], none: [String.raw`\bmini\b|\bxl\b`, ACCESSORY] },
  'phanteks-xt-pro-ultra': { all: [String.raw`phanteks`, String.raw`xt\s*pro\s*ultra\b`], none: [ACCESSORY] },
  'nzxt-h5-flow-2024': { all: [String.raw`^nzxt`, String.raw`h5\s*flow\b`], none: [String.raw`h5\s*flow\s*rgb|elite`, ACCESSORY], prefer: [String.raw`2024`] },
  'montech-xr': { all: [String.raw`montech`, String.raw`\bxr\b`], none: [String.raw`\bxr\s*m\b|xr-m\b`, ACCESSORY] },
  'montech-air-903-max': { all: [String.raw`montech`, String.raw`air\s*903\s*max\b`], none: [ACCESSORY] },
  'cooler-master-q300l': { all: [String.raw`cooler\s*master`, String.raw`q300l\b`], none: [ACCESSORY], prefer: [String.raw`^(?!.*\bv2\b)`] },
  'thermaltake-versa-h18': { all: [String.raw`thermaltake`, String.raw`versa\s*h18\b`], none: [ACCESSORY] },
  'montech-air-100-lite': { q: 'MONTECH AIR 100 LITE micro ATX case', all: [String.raw`montech`, String.raw`air\s*100\s*lite\b`], none: [ACCESSORY] },
  'zalman-s2': { q: 'Zalman S2 ATX mid tower case', all: [String.raw`^zalman`, String.raw`\bs2\b`], none: [ACCESSORY] },

  // ---- memory
  'gskill-flare-x5-ddr5-6000-cl30': { all: [String.raw`flare\s*x5`, String.raw`32\s*gb\s*\(?\s*2\s*x\s*16`, String.raw`6000`, String.raw`cl30`], none: [RAM_NOT] },
  'corsair-vengeance-ddr5-6000-cl30': { all: [String.raw`^corsair`, String.raw`vengeance`, String.raw`ddr5`, String.raw`32\s*gb`, String.raw`6000`, String.raw`\bc(l)?30\b`], none: [String.raw`\brgb\b|\brs\b`, RAM_NOT] },
  'kingston-fury-beast-ddr5-6000-cl30': { all: [String.raw`^kingston`, String.raw`fury\s*beast`, String.raw`32\s*gb`, String.raw`6000`, String.raw`cl30`], none: [String.raw`\brgb\b|white`, RAM_NOT] },
  'teamgroup-t-force-delta-rgb-ddr5-6000': { all: [String.raw`delta\s*rgb`, String.raw`ddr5`, String.raw`32\s*gb`, String.raw`6000`, String.raw`\bcl30\b`], none: [RAM_NOT] },
  'gskill-trident-z5-neo-rgb-ddr5-6000-64gb': { all: [String.raw`trident\s*z5\s*neo\s*rgb`, String.raw`64\s*gb\s*\(?\s*2\s*x\s*32`, String.raw`6000`, String.raw`cl30`], none: [String.raw`royal`, RAM_NOT] },
  'gskill-ripjaws-v-ddr4-3600-cl16': { q: 'G.Skill Ripjaws V 32GB 2x16GB DDR4 3600 CL16 F4-3600C16D-32GVKC', all: [String.raw`ripjaws\s*v`, String.raw`32\s*gb\s*\(?\s*2\s*x\s*16`, String.raw`3600`, String.raw`cl16`], none: [RAM_NOT] },
  'gskill-trident-z-neo-ddr4-3600-cl16': { all: [String.raw`trident\s*z\s*neo\b`, String.raw`ddr4`, String.raw`32\s*gb\s*\(?\s*2\s*x\s*16`, String.raw`3600`, String.raw`cl16`], none: [RAM_NOT] },
  'corsair-vengeance-lpx-ddr4-3200-cl16': { all: [String.raw`^corsair`, String.raw`vengeance\s*lpx`, String.raw`32\s*gb`, String.raw`3200`, String.raw`\bc(l)?16\b`], none: [String.raw`white`, RAM_NOT] },
  'crucial-pro-ddr4-3200': { q: 'Crucial Pro DDR4 32GB 2x16GB 3200 desktop memory', all: [String.raw`^crucial\s*pro\b`, String.raw`ddr4`, String.raw`32\s*gb`, String.raw`3200`], none: [RAM_NOT] },

  // ---- motherboards
  'msi-mag-b650-tomahawk-wifi': { all: [String.raw`^msi`, String.raw`mag\s*b650\s*tomahawk\s*wi-?fi\b`], none: [BUNDLE] },
  'gigabyte-b650-aorus-elite-ax': { all: [String.raw`^gigabyte`, String.raw`\bb650\s*aorus\s*elite\s*ax\b`], none: [String.raw`b650m|\bice\b|\bv2\b|ryzen\s*\d\s*\d{4}x?\s*\+`, BUNDLE] },
  'asus-tuf-gaming-b650-plus-wifi': { all: [String.raw`^asus`, String.raw`tuf\s*gaming\s*b650-?plus\s*wi-?fi\b`], none: [String.raw`b650e`, BUNDLE] },
  'msi-mag-x870-tomahawk-wifi': { all: [String.raw`^msi`, String.raw`mag\s*x870\s*tomahawk\b`], none: [String.raw`x870e|\bmax\b`, BUNDLE] },
  'asrock-b850-steel-legend-wifi': { all: [String.raw`^asrock`, String.raw`\bb850\s*steel\s*legend\b`], none: [String.raw`b850m`, BUNDLE] },
  'msi-pro-b650m-a-wifi': { all: [String.raw`^msi`, String.raw`pro\s*b650m-?a\s*wi-?fi\b`], none: [String.raw`ddr4|\bii\b`, BUNDLE] },
  'msi-mag-b550-tomahawk': { all: [String.raw`^msi`, String.raw`mag\s*b550\s*tomahawk\b`], none: [String.raw`\bmax\b|wi-?fi`, BUNDLE] },
  'asus-rog-strix-x570-e-gaming': { all: [String.raw`^asus`, String.raw`strix\s*x570-?e\b`], none: [BUNDLE] },
  'gigabyte-x570s-aorus-elite-ax': { q: 'GIGABYTE X570S AORUS Elite AX motherboard', all: [String.raw`^gigabyte`, String.raw`x570s\s*aorus\s*elite\s*ax\b`], none: [BUNDLE] },
  'asus-tuf-gaming-x570-plus-wifi': { q: 'ASUS TUF Gaming X570-Plus WiFi motherboard', all: [String.raw`^asus`, String.raw`tuf\s*gaming\s*x570-?plus\b`], none: [String.raw`x570-?pro`, BUNDLE] },

  // ---- SSDs
  'samsung-990-pro': { all: [String.raw`^samsung`, String.raw`990\s*pro\b`, String.raw`\b2\s*tb\b`], none: [String.raw`heatsink|\bevo\b`] },
  'wd-black-sn850x': { all: [String.raw`sn850x`, String.raw`\b2\s*tb\b`], none: [String.raw`heatsink|xbox|call of duty`] },
  'crucial-t500': { all: [String.raw`^crucial`, String.raw`\bt500\b`, String.raw`\b2\s*tb\b`], none: [String.raw`heatsink`] },
  'samsung-9100-pro': { all: [String.raw`^samsung`, String.raw`9100\s*pro\b`, String.raw`\b2\s*tb\b`], none: [String.raw`heatsink`] },
  'crucial-p3-plus': { all: [String.raw`^crucial`, String.raw`p3\s*plus\b`, String.raw`\b2\s*tb\b`] },
  'kingston-nv3': { all: [String.raw`^kingston`, String.raw`\bnv3\b`, String.raw`\b2\s*tb\b|2000\s*g`] },
  'wd-black-sn7100': { q: 'WD Black SN7100 2TB WDS200T4X0E', all: [String.raw`sn7100\b`, String.raw`\b2\s*tb\b`], none: [String.raw`heatsink`] },
};

/** Does this Amazon title pass the product's rule? */
export function passes(id, title) {
  const rule = RULES[id];
  if (!rule || !title) return false;
  if (NEVER.test(title)) return false;
  if (!rule.all.every((p) => r(p).test(title))) return false;
  if ((rule.none ?? []).some((p) => r(p).test(title))) return false;
  return true;
}

/** Best listing for a product among Amazon results (kept in Amazon's order), or undefined. */
export function pick(id, items) {
  const ok = items.filter((it) => passes(id, it.title) && it.image);
  const prefer = (RULES[id]?.prefer ?? []).map(r);
  const score = (it) => prefer.filter((p) => p.test(it.title)).length;
  return ok.sort((a, b) => score(b) - score(a))[0];
}

export const searchWords = (p) => RULES[p.id]?.q ?? (p.amazon ?? p.name).replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
