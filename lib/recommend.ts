import { CPUS, GAMES, GPUS, type Cpu, type Gpu } from "./data";

export const OPTIONS = {
  res: ["1080p", "1440p", "4K"],
  fps: ["60Hz", "144Hz", "240Hz"],
  ram: ["8GB", "16GB", "32GB"],
  use: ["Gaming", "Gaming + Stream"],
  budget: ["$250", "$400", "$600", "$900"],
} as const;

export type SettingKey = keyof typeof OPTIONS;
export type Settings = { [K in SettingKey]: (typeof OPTIONS)[K][number] };

export const DEFAULTS: Settings = {
  res: "1080p",
  fps: "144Hz",
  ram: "16GB",
  use: "Gaming",
  budget: "$400",
};

export const LABELS: Record<SettingKey, string> = {
  res: "Resolution",
  fps: "Refresh rate",
  ram: "RAM",
  use: "Use",
  budget: "Budget",
};

const MULT = {
  res: { "1080p": 1, "1440p": 1.3, "4K": 1.7 },
  fps: { "60Hz": 1.25, "144Hz": 1, "240Hz": 0.85 },
  ram: { "8GB": 0.9, "16GB": 1, "32GB": 1.02 },
  use: { Gaming: 1, "Gaming + Stream": 0.92 },
} as const;

export const budgetValue = (b: Settings["budget"]) => parseInt(b.slice(1), 10);

/** Parse settings from a query string, ignoring anything invalid. */
export function parseSettings(search: string): Settings {
  const q = new URLSearchParams(search);
  const out: Settings = { ...DEFAULTS };
  (Object.keys(OPTIONS) as SettingKey[]).forEach((k) => {
    const v = q.get(k);
    if (v && (OPTIONS[k] as readonly string[]).includes(v)) (out as Record<string, string>)[k] = v;
  });
  return out;
}

export function settingsQuery(s: Settings): string {
  const q = new URLSearchParams();
  (Object.keys(OPTIONS) as SettingKey[]).forEach((k) => {
    if (s[k] !== DEFAULTS[k]) q.set(k, s[k]);
  });
  const str = q.toString();
  return str ? `?${str}` : "";
}

export function effectiveCap(cpu: Cpu, s: Settings) {
  return cpu.cap * MULT.res[s.res] * MULT.fps[s.fps] * MULT.ram[s.ram] * MULT.use[s.use];
}

export const headroom = (g: Gpu, cap: number) => Math.min(100, Math.round((g.score / cap) * 100));

/** Intel Arc's driver has heavy CPU overhead; on slower CPUs it loses far more than its score suggests. */
export const OVERHEAD_MIN_CAP = 95;
export const usable = (cpu: Cpu, g: Gpu) => !g.highOverhead || cpu.cap >= OVERHEAD_MIN_CAP;

export type Verdict = "Bottlenecked" | "Balanced" | "Underused" | "Driver overhead";
export function verdict(g: Gpu, cap: number, cpu?: Cpu): Verdict {
  if (cpu && !usable(cpu, g)) return "Driver overhead";
  const r = g.score / cap;
  if (r > 1.05) return "Bottlenecked";
  if (r < 0.6) return "Underused";
  return "Balanced";
}

export type Recommendation = ReturnType<typeof recommend>;

export function recommend(cpu: Cpu, s: Settings) {
  const cap = effectiveCap(cpu, s);
  const budget = budgetValue(s.budget);
  const fit = GPUS.filter((g) => usable(cpu, g) && g.score <= cap * 1.05);
  const pool = fit.length ? fit : [GPUS[0]];
  const max = pool[pool.length - 1];
  const inBudget = pool.filter((g) => g.price <= budget);
  const best = inBudget.length
    ? inBudget.reduce((a, b) => (b.score > a.score ? b : a))
    : pool.reduce((a, b) => (b.price < a.price ? b : a));
  const cheaper = pool.filter((g) => g.price < best.price && g.score >= best.score * 0.7);
  const budgetPick = cheaper.length
    ? cheaper.reduce((a, b) => (b.score / b.price > a.score / a.price ? b : a))
    : pool[0];
  const next = GPUS.find((g) => usable(cpu, g) && g.score > max.score) ?? max;

  const resF = { "1080p": 1, "1440p": 0.72, "4K": 0.42 }[s.res];
  const hz = parseInt(s.fps, 10);
  const streamF = s.use === "Gaming" ? 1 : 0.9;
  const ramF = s.ram === "8GB" ? 0.9 : 1;
  const fpsRows = GAMES.map(([name, base]) => {
    const gpuSide = Math.round(((base * best.score) / 60) * resF);
    const cpuSide = Math.round(((base * cpu.cap) / 60) * streamF * ramF);
    const cpuLimited = cpuSide < gpuSide;
    return { name, fps: Math.min(gpuSide, cpuSide), limit: cpuLimited ? "CPU" : "GPU" } as const;
  });
  const hits = fpsRows.filter((r) => r.fps >= hz).length;
  const psu = Math.max(550, Math.ceil((best.watts + 250) / 0.8 / 50) * 50);

  const upgrade = CPUS.filter((c) => c.socket === cpu.socket && c.cap > cpu.cap).sort((a, b) => b.cap - a.cap)[0];
  let upgradeGpu: Gpu | undefined;
  if (upgrade) {
    const upCap = (upgrade.cap * cap) / cpu.cap;
    const upFit = GPUS.filter((g) => usable(upgrade, g) && g.score <= upCap * 1.05);
    upgradeGpu = upFit[upFit.length - 1];
  }

  return { cap, best, budgetPick, max, next, fpsRows, hits, hz, psu, upgrade, upgradeGpu };
}

/** Highest GPU that fits at a given resolution/refresh, other settings default. */
export function ceilingAt(cpu: Cpu, res: Settings["res"], fps: Settings["fps"]) {
  const cap = effectiveCap(cpu, { ...DEFAULTS, res, fps });
  const fit = GPUS.filter((g) => usable(cpu, g) && g.score <= cap * 1.05);
  return fit.length ? fit[fit.length - 1] : GPUS[0];
}
