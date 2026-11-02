"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CPUS, GPUS, affiliateUrl, cpuPath, findCpu, SITE, type Gpu } from "@/lib/data";
import {
  DEFAULTS, LABELS, OPTIONS, headroom, parseSettings, recommend, settingsQuery, usable, verdict,
  type SettingKey, type Settings,
} from "@/lib/recommend";
import { buildContent } from "@/lib/content";
import { ArrowRight, ChevronDown, X } from "./Icons";

const BAR_KEY = "er-pricebar-closed";
const KEYS = Object.keys(OPTIONS) as SettingKey[];

function Buy({ gpu, className, children }: { gpu: Gpu; className: string; children: ReactNode }) {
  return (
    <a className={className} href={affiliateUrl(gpu)} target="_blank" rel="sponsored nofollow noopener">
      {children}
    </a>
  );
}

export default function Finder({ cpuId, updated, children }: { cpuId: string; updated: string; children?: ReactNode }) {
  const cpu = findCpu(cpuId)!;
  const router = useRouter();
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [showBar, setShowBar] = useState(false);
  const [closed, setClosed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Restore settings from the URL after hydration (server renders defaults).
  useEffect(() => {
    setS(parseSettings(window.location.search));
    try {
      if (sessionStorage.getItem(BAR_KEY) === "1") setClosed(true);
    } catch {}
  }, []);

  // Sticky price bar: visible only once the Best match card has scrolled above the viewport.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const r = useMemo(() => recommend(cpu, s), [cpu, s]);
  const c = useMemo(() => buildContent(cpu, s, r), [cpu, s, r]);

  const update = (next: Settings) => {
    setS(next);
    window.history.replaceState(null, "", window.location.pathname + settingsQuery(next));
  };
  const cycle = (k: SettingKey) => {
    const vs = OPTIONS[k] as readonly string[];
    update({ ...s, [k]: vs[(vs.indexOf(s[k]) + 1) % vs.length] } as Settings);
  };
  const closeBar = () => {
    setClosed(true);
    try {
      sessionStorage.setItem(BAR_KEY, "1");
    } catch {}
  };

  const { best, budgetPick, max } = r;
  const barOn = showBar && !closed;
  const updatedLabel = new Date(updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">
          <span>Best GPU for</span>
          <span className="cpu-select">
            <span className="cpu-select-value">{cpu.name}</span>
            <ChevronDown />
            <select
              aria-label="Change CPU"
              value={cpu.id}
              onChange={(e) => {
                const target = findCpu(e.target.value);
                if (target) router.push(cpuPath(target) + settingsQuery(s));
              }}
            >
              {CPUS.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </span>
          <span>without bottleneck</span>
        </h1>
        <p className="hero-meta">
          Updated <time dateTime={updated}>{updatedLabel}</time> · {cpu.cores} cores / {cpu.threads} threads · {cpu.socket} · PCIe {cpu.pcie}.0
        </p>
      </section>

      <div className="tiles" role="group" aria-label="Your setup">
        {KEYS.map((k) => (
          <button key={k} type="button" className="tile" onClick={() => cycle(k)}>
            <span className="tile-label">{LABELS[k]} · tap to change</span>
            <span className="tile-value">{s[k]}</span>
          </button>
        ))}
      </div>

      <div className="wrap stack-12">
        <div className="best" ref={cardRef}>
          <div className="kicker">Best match</div>
          <div className="best-name">{best.name}</div>
          <div className="meter" role="img" aria-label={`Uses ${headroom(best, r.cap)}% of CPU headroom`}>
            <div style={{ width: `${headroom(best, r.cap)}%` }} />
          </div>
          <div className="small">
            Uses {headroom(best, r.cap)}% of CPU headroom. Strongest card {best.price <= parseInt(s.budget.slice(1)) ? "under your budget" : "near your budget"} that the {cpu.name} can fully feed.
          </div>
          <Buy gpu={best} className="btn-cta">
            <span>Check price</span>
            <span className="row-8">${best.price} <ArrowRight /></span>
          </Buy>
        </div>

        <div className="tiers">
          {([["Budget pick", budgetPick], ["Max before bottleneck", max]] as const).map(([k, g]) => (
            <div className="tier" key={k}>
              <div className="kicker kicker-sm">{k}</div>
              <div className="tier-name">{g.name}</div>
              <div className="tier-head">Uses {headroom(g, r.cap)}% of CPU headroom</div>
              <Buy gpu={g} className="btn-outline">
                <span>${g.price}</span> <ArrowRight size={16} />
              </Buy>
            </div>
          ))}
        </div>

        <p className="cap-note">{c.capNote} <span className="muted">Prices are approximate; links are affiliate links.</span></p>

        <div className="article">
          <section className="sec sec-first">
            <div className="kicker">The verdict, explained</div>
            <h2>Why the {best.name} fits the {cpu.name}</h2>
            <p>{c.why}</p>
          </section>

          <section className="sec">
            <div className="kicker">Benchmarks</div>
            <h2>Expected FPS with the {best.name}</h2>
            <p className="caption">{c.fpsCaption}</p>
            <table className="data">
              <thead>
                <tr><th scope="col">Game</th><th scope="col">Avg FPS</th><th scope="col">Limited by</th></tr>
              </thead>
              <tbody>
                {r.fpsRows.map((g) => (
                  <tr key={g.name}>
                    <td className="strong-600">{g.name}</td>
                    <td className="num">{g.fps}</td>
                    <td className={g.limit === "CPU" ? "lim-cpu" : "lim-gpu"}>{g.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small">{c.hzNote}</p>
          </section>

          <section className="sec">
            <div className="kicker">Overspending</div>
            <h2>What if you buy bigger than the {max.name}?</h2>
            <p>{c.over}</p>
          </section>

          <section className="sec">
            <div className="kicker">Every card checked</div>
            <h2>Current GPUs vs the {cpu.name} at {s.res} / {s.fps}</h2>
            <p className="caption">Headroom is how much of the CPU&apos;s ceiling each card uses. Over 105% means the CPU holds the card back.{!usable(cpu, GPUS.find((g) => g.highOverhead)!) && " Intel Arc cards are marked “Driver overhead”: their driver needs a faster CPU than this one to perform as rated."}</p>
            <table className="data">
              <thead>
                <tr><th scope="col">GPU</th><th scope="col">Price</th><th scope="col">Headroom</th><th scope="col">Verdict</th></tr>
              </thead>
              <tbody>
                {GPUS.map((g) => {
                  const v = verdict(g, r.cap, cpu);
                  const tag = g === best ? "Best match" : g === budgetPick ? "Budget pick" : g === max ? "Max" : "";
                  return (
                    <tr key={g.id} className={v === "Bottlenecked" || v === "Driver overhead" ? "row-over" : g === best ? "row-best" : ""}>
                      <td className={tag ? "strong" : "strong-600"}>
                        {g.name}
                        {tag && <span className="row-tag">{tag}</span>}
                      </td>
                      <td>${g.price}</td>
                      <td className="num">{Math.round((g.score / r.cap) * 100)}%</td>
                      <td className={v === "Balanced" || v === "Underused" ? "" : "lim-cpu"}>{v}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {children}

          {c.sections.map((sec) => (
            <section className="sec" key={sec.heading}>
              <div className="kicker">{sec.kicker}</div>
              <h2>{sec.heading}</h2>
              {sec.paras.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}

          <section className="sec">
            <div className="kicker">Checklist</div>
            <h2>Before you buy</h2>
            <ol className="checks">
              {c.checks.map((k) => (
                <li key={k.n}>
                  <span className="check-n">{k.n}</span>
                  <div>
                    <div className="check-title">{k.title}</div>
                    <div className="small">{k.text}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="upgrade">
            <div className="kicker kicker-dark">Upgrade path</div>
            <h2 className="upgrade-title">{c.up.title}</h2>
            <p>{c.up.text}</p>
            {c.up.cpu && (
              <a className="upgrade-link" href={cpuPath(c.up.cpu)}>
                Best GPU for {c.up.cpu.name} <ArrowRight size={16} />
              </a>
            )}
          </section>

          <section className="sec">
            <h2>FAQ</h2>
            <div className="faq">
              {c.faqs.map((f, i) => (
                <details key={f.q} name="faq" open={i === 0}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="faq-sign" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="disclosure">
            FPS figures are estimates based on our testing and public benchmarks, rounded. Prices change daily.
            As an Amazon Associate {SITE.name} earns from qualifying purchases; links marked with a price are affiliate links.{" "}
            <a href="/affiliate-disclosure/">Disclosure</a> · <a href="/methodology/">Methodology</a>
          </p>
        </div>
      </div>

      <div className={`pricebar${barOn ? " is-on" : ""}`} inert={!barOn}>
        <div className="pricebar-text">
          <span className="pricebar-label">Best match · affiliate link</span>
          <span className="pricebar-name">{best.name}</span>
        </div>
        <Buy gpu={best} className="btn-bar">
          <span>${best.price}</span> <ArrowRight size={16} />
        </Buy>
        <button type="button" className="btn-close" onClick={closeBar} aria-label="Close price bar">
          <X />
        </button>
      </div>
    </>
  );
}
