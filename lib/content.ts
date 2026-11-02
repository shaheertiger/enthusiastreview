import { GAMES, type Cpu, type Gpu } from "./data";
import { budgetValue, headroom, type Recommendation, type Settings } from "./recommend";

export type Section = { kicker: string; heading: string; paras: string[] };
export type Faq = { q: string; a: string };
export type Check = { n: string; title: string; text: string };

const usd = (n: number) => `$${n}`;

export function buildContent(cpu: Cpu, s: Settings, r: Recommendation) {
  const { best, budgetPick, max, next, cap, psu, upgrade, upgradeGpu, hits } = r;
  const budget = budgetValue(s.budget);
  const older = cpu.year <= 2020;
  const pcie3 = cpu.pcie === 3;
  const ddr4 = cpu.memory.startsWith("DDR4");

  const why =
    `At ${s.res} and ${s.fps}, the ${cpu.name} can keep a GPU up to roughly ${max.name} level busy. ` +
    `The ${best.name} is the strongest card ${best.price <= budget ? `within your ${s.budget} budget` : "close to your budget"} that stays inside that limit, so the graphics card does the work instead of waiting for the CPU. ` +
    (s.res === "1080p"
      ? "At 1080p the CPU carries more of the load per frame, which is why the ceiling is lower here than at 1440p."
      : "Higher resolutions shift work onto the GPU, which gives the CPU more breathing room and raises the ceiling.");

  const over =
    `Moving up from the ${max.name} to something like the ${next.name} costs ${usd(Math.max(0, next.price - max.price))} more, ` +
    `but in CPU-heavy games such as Warzone and Counter-Strike 2 your frame rate barely changes. ` +
    `That money does more as a CPU upgrade later. Only buy bigger if you are moving to ${s.res === "4K" ? "a higher-refresh 4K monitor" : "1440p or 4K"} soon — the higher resolution will put the extra GPU power to use.`;

  const tierPara = (kicker: string, g: Gpu) => {
    const h = headroom(g, cap);
    const head = `${kicker} — ${g.name} (${usd(g.price)}, ${g.vram}GB). Uses ${h}% of the CPU's headroom. `;
    if (g === best)
      return head + `This is the card we would buy. At ${s.res} it ${h > 85 ? "uses nearly all of the CPU's headroom, so nothing you pay for is wasted" : "leaves a little headroom spare, which keeps frame times steady in busy scenes"}${g.price <= budget ? `, and it fits under your ${s.budget} budget.` : "."}`;
    if (g === budgetPick && g !== max)
      return head + `If you would rather keep money for a monitor, more RAM or a CPU upgrade, this card gives up about ${Math.max(5, Math.round((1 - g.score / best.score) * 100))}% of the performance for ${usd(Math.max(0, best.price - g.price))} less. It is fine for esports titles and older games at high settings.`;
    return head + "This is the most GPU the CPU can keep busy at these settings. It makes sense only if a CPU upgrade or a higher-resolution monitor is coming soon; otherwise the extra spend shows up as idle GPU time.";
  };

  const sections: Section[] = [
    {
      kicker: "The basics",
      heading: "What “without bottleneck” actually means",
      paras: [
        "Every frame needs work from both the CPU and the GPU. The CPU runs game logic, physics, AI and draw calls; the GPU turns that into pixels. Whichever part finishes last sets your frame rate. When the GPU is idle waiting on the CPU, you have a CPU bottleneck, and a faster graphics card will not raise your FPS.",
        `Some imbalance is always there, so the goal is not zero. The goal is to stop spending money the CPU will waste. For the ${cpu.name} at ${s.res} and ${s.fps}, extra GPU power stops helping at around the ${max.name}. Every pick on this page sits at or below that line.`,
        `Your settings move the line. Higher resolutions load the GPU and give an older CPU room. Higher refresh targets do the opposite: to hit ${s.fps} the CPU has to prepare frames faster, so the ceiling drops. That is why the same CPU gets a different answer at 1080p / 240Hz than at 4K / 60Hz.`,
        "A bottleneck is easy to spot once you know what to look for. Open an overlay such as MSI Afterburner or the Xbox Game Bar. If GPU usage sits well below 95% while one or more CPU threads are near 100%, the CPU is setting the pace.",
      ],
    },
    {
      kicker: "About this CPU",
      heading: `The ${cpu.name} at a glance`,
      paras: [
        cpu.blurb,
        `It has ${cpu.cores} cores and ${cpu.threads} threads, boosts to ${cpu.boost}, uses the ${cpu.socket} socket and officially supports ${cpu.memory} memory. ${pcie3 ? "Its graphics slot runs at PCIe 3.0, which matters for cards wired with only eight lanes." : `It supports PCIe ${cpu.pcie}.0 for the graphics card on a matching motherboard, so slot bandwidth will not hold back any card on this page.`}`,
      ],
    },
    {
      kicker: "Our picks",
      heading: "The three picks, in detail",
      paras: [
        budgetPick === best
          ? `Budget pick — ${best.name}. At these settings there is no cheaper card that keeps at least 70% of the best match's performance, so the best match is also the value pick.`
          : tierPara("Budget pick", budgetPick),
        tierPara("Best match", best),
        max === best
          ? `Max before bottleneck — also the ${max.name}. Your ${s.budget} budget already reaches the ${cpu.name}'s ceiling at ${s.res} / ${s.fps}, so spending more would buy GPU power the CPU cannot use.`
          : tierPara("Max before bottleneck", max),
      ],
    },
    {
      kicker: "Setup guide",
      heading: `Best settings for the ${cpu.name} with the ${best.name}`,
      paras: [
        `Start with the high preset at ${s.res}, then lower the settings that load the CPU first: crowd density, view distance, physics quality and shadow distance. They cost CPU time for little visual payoff, and lowering them raises the ceiling more than any texture setting.`,
        `Keep texture quality as high as the ${best.vram}GB of VRAM allows — it costs almost no CPU time. Use DLSS, FSR or XeSS in Quality mode in demanding games. Upscaling does not lift a CPU limit, but frame generation can smooth a CPU-limited game if your base frame rate is already above about 50 FPS.`,
        `Turn on ${ddr4 ? "XMP (Intel) or DOCP/XMP (AMD)" : "XMP or EXPO"} for your ${s.ram} of RAM, and make sure it runs in dual channel (two or four sticks in the right slots). ${cpu.brand === "AMD" && ddr4 ? "On Ryzen the Infinity Fabric clock is tied to memory speed, so DDR4-3200 or 3600 instead of the default 2133 can be worth 10–15% in CPU-limited games." : "Many systems run memory at a slow default speed out of the box, and fixing that is free performance in CPU-limited games."} A frame cap a few FPS below ${s.fps} in the driver keeps frame times even.`,
      ],
    },
    {
      kicker: "Buying advice",
      heading: "New or used?",
      paras: [
        `Used cards from the previous generation can be good value with the ${cpu.name}${max.score < 100 ? ", since the top-end cards are wasted on it anyway" : ""}. A used card with the performance of the ${best.name} often costs 25–35% less. In exchange you lose the warranty and sometimes newer features like the latest upscaling or AV1 encoding.`,
        "If you buy used, ask for a stress-test video, listen for fan noise and coil whine, and avoid cards with obvious heavy-use wear such as discoloured boards or replaced thermal pads. If you want a warranty and the newest features, the new prices above are the safer route.",
      ],
    },
    {
      kicker: "Method",
      heading: "How we work out these picks",
      paras: [
        `We place every CPU and GPU on one shared performance scale built from our own testing and published benchmark data across a fixed set of games. For each CPU we estimate how much GPU it can keep fully loaded at 1080p / 144Hz in CPU-heavy titles, then adjust that ceiling for your resolution, refresh rate, RAM and streaming load.`,
        "A pairing counts as balanced when the GPU would stay above roughly 95% load in most games at the stated settings. Prices are approximate street prices and are reviewed when they move by more than 10%, or when a new GPU or a major driver update changes the picture.",
      ],
    },
  ];

  const checks: Check[] = [
    { n: "01", title: `Power supply: ${psu}W or more`, text: `An 80+ Gold unit from a known brand, with the PCIe power connectors the ${best.name} needs. Don't reuse an old no-name supply.` },
    { n: "02", title: "Will it fit in your case?", text: "Check your case's maximum GPU length and slot width. Many current cards are over 300mm long and 2.5 slots thick." },
    pcie3
      ? { n: "03", title: "PCIe 3.0: watch for x8 cards", text: `The ${cpu.name} runs the graphics slot at PCIe 3.0. Cards wired with eight lanes (like the RX 7600, RTX 4060, RTX 5060 and Arc B580) lose a few percent — more if an 8GB card runs out of VRAM. Prefer x16 cards or 12GB+ models where you can.` }
      : { n: "03", title: `PCIe ${cpu.pcie}.0 is plenty`, text: "Your platform gives every card on this page full slot bandwidth, including x8 cards, as long as the board supports it." },
    { n: "04", title: "Update drivers and BIOS", text: `Remove old drivers with DDU, update the motherboard BIOS${cpu.brand === "AMD" ? "" : " (Intel has shipped important microcode fixes)"}, and turn on Resizable BAR / Smart Access Memory for up to 5–10% more FPS.` },
    ...(cpu.cap < 95
      ? [{ n: "", title: "Skip Intel Arc on this CPU", text: `Arc B570 and B580 cards are great value on fast CPUs, but their driver adds heavy CPU overhead. On the ${cpu.name} they lose a big share of their performance, so we leave them out of the picks.` }]
      : []),
    { n: "05", title: ddr4 ? "Dual-channel DDR4-3200 or faster" : "Dual-channel DDR5 with EXPO/XMP on", text: "A single memory stick halves bandwidth and causes stutter that looks like a CPU bottleneck. Two matched sticks fix it." },
    { n: "06", title: "Keep the CPU cool", text: "A throttling CPU lowers the ceiling quietly. Check temperatures under load and clean or replace the cooler if it runs above 90°C." },
  ];

  checks.forEach((k, i) => (k.n = String(i + 1).padStart(2, "0")));

  const up = upgrade && upgradeGpu
    ? {
        title: `Drop in a ${upgrade.name} and aim for the ${upgradeGpu.name}`,
        text: `The ${upgrade.name} uses the same ${cpu.socket} socket${cpu.socket === "AM4" ? " (after a BIOS update)" : ""}, so your motherboard stays. It raises the ceiling by about ${Math.round((upgrade.cap / cpu.cap - 1) * 100)}%, enough to run the ${upgradeGpu.name} without a bottleneck at these settings.`,
        cpu: upgrade,
      }
    : {
        title: `Your ${cpu.socket} platform is already at its best`,
        text: `There is no faster gaming CPU for your board. A future CPU upgrade means a new motherboard${ddr4 ? " and DDR5 memory" : ""}. Buy the GPU now and carry it over when you rebuild.`,
        cpu: undefined,
      };

  const faqs: Faq[] = [
    {
      q: `What is the best GPU for the ${cpu.name}?`,
      a: `For ${s.res} at ${s.fps} with a ${s.budget} budget, the ${best.name} is the best match: it uses ${headroom(best, cap)}% of the CPU's headroom. The ${budgetPick.name} is the value pick, and the ${max.name} is the most GPU the ${cpu.name} can keep busy before it becomes the bottleneck.`,
    },
    {
      q: `Is the ${max.name} a bottleneck with the ${cpu.name}?`,
      a: `Only just. At ${s.res} / ${s.fps} it is the strongest card that stays inside the CPU's limit. Anything faster loses frames to the CPU, so you pay for performance you cannot use.`,
    },
    {
      q: `Will the ${cpu.name} bottleneck the ${next.name}?`,
      a: `${next === max ? `At these settings the ${next.name} sits right at the limit.` : `Yes, at ${s.res} / ${s.fps}. The ${next.name} is faster than the ${cpu.name} can feed in CPU-heavy games, so expect the GPU to sit below full load.`} Moving to a higher resolution reduces the gap.`,
    },
    {
      q: `Will ${s.ram} of RAM hold me back?`,
      a: s.ram === "8GB"
        ? "Yes. 8GB causes stutter in most current games no matter which GPU you buy. A 2×8GB or 2×16GB kit is the cheapest real upgrade on this page."
        : s.ram === "16GB"
          ? "No. 16GB in dual channel is the gaming standard. Go to 32GB if you stream, mod heavily or keep a browser open while you play."
          : "No. 32GB is more than games need today, so memory capacity won't limit any card on this page.",
    },
    {
      q: "Does streaming change the pick?",
      a: `Yes. Encoding takes CPU time on the ${cpu.name}, which lowers its ceiling by around 8% in our model. Let the GPU's hardware encoder (NVENC, AMD AMF or Intel QuickSync/AV1) do the work instead of x264.`,
    },
    {
      q: `What PSU do I need for the ${best.name}?`,
      a: `A quality ${psu}W unit with the right PCIe power connectors. The ${best.name} draws around ${best.watts}W on its own; the rest is headroom for the CPU, drives and power spikes.`,
    },
    {
      q: "Can a bottleneck damage my PC?",
      a: "No. A bottleneck costs performance, not hardware. Nothing overheats or wears out faster — you just get lower or less steady frame rates than the GPU could deliver.",
    },
    {
      q: "Should I upgrade the CPU or the GPU first?",
      a: upgrade
        ? `For most people on the ${cpu.name}, the GPU comes first: it is the bigger jump in frames per dollar at ${s.res}. If you mostly play competitive shooters at ${s.fps}, a ${upgrade.name} on your current board may be the better first step.`
        : `The GPU first. Your platform is already at its limit, so a CPU upgrade means a new board too. A GPU bought now moves into the next build.`,
    },
    {
      q: "Is AMD or NVIDIA better for this CPU?",
      a: `Both work. NVIDIA's driver uses slightly more CPU time in some DirectX 12 games, which can matter a little on ${older ? "older chips like this one" : "older chips"}. Radeon cards usually give more frames per dollar; NVIDIA leads in ray tracing, DLSS and streaming. Choose on price and features rather than bottleneck worries.`,
    },
  ];

  const fpsCaption = `Estimated averages for the ${cpu.name} + ${best.name} at ${s.res}, high preset${s.use === "Gaming" ? "" : ", while streaming"}.`;
  const hzNote = `${hits} of ${GAMES.length} games reach your ${s.fps} refresh rate.${hits < 3 && r.hz > 60 ? " For competitive play, lower settings before spending more on the GPU." : ""}`;
  const capNote = `Past the ${max.name}, the ${cpu.name} becomes the limit at ${s.res} / ${s.fps}.`;

  return { why, over, sections, checks, up, faqs, fpsCaption, hzNote, capNote };
}

export function metaDescription(cpu: Cpu, r: Recommendation) {
  return `The best GPU for the ${cpu.name} without a bottleneck is the ${r.best.name} at 1080p/144Hz. See the budget pick (${r.budgetPick.name}), the max before bottleneck (${r.max.name}), FPS estimates and an interactive picker for your settings.`;
}
