import { ImageResponse } from "next/og";
import { CPUS, cpuSlug, findCpuBySlug } from "@/lib/data";
import { DEFAULTS, recommend } from "@/lib/recommend";

const size = { width: 1200, height: 630 };

export const dynamicParams = false;

export function generateStaticParams() {
  return CPUS.map((c) => ({ file: `${cpuSlug(c)}.png` }));
}

// Served at /og/{slug}.png — the file extension keeps it clear of the trailing-slash redirect.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const cpu = findCpuBySlug((await params).file.replace(/\.png$/, ""));
  if (!cpu) return new Response("Not found", { status: 404 });
  const r = recommend(cpu, DEFAULTS);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f3f2f2", color: "#201e1d" }}>
        <div style={{ display: "flex", padding: "28px 56px", fontSize: 34, fontWeight: 800, borderBottom: "4px solid #201e1d" }}>
          enthusiast<span style={{ color: "#ec3013" }}>review</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", background: "#ec3013", color: "#f3f2f2", padding: "40px 56px", gap: 6 }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>Best GPU for</div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, background: "#f3f2f2", color: "#201e1d", padding: "6px 20px", alignSelf: "flex-start" }}>
            {cpu.name}
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>without bottleneck</div>
        </div>
        <div style={{ display: "flex", padding: "32px 56px", gap: 48, fontSize: 30 }}>
          {([["Best match", r.best], ["Budget", r.budgetPick], ["Max", r.max]] as const).map(([k, g]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, color: "#ae1800", textTransform: "uppercase", letterSpacing: 2 }}>{k}</span>
              <span style={{ fontWeight: 800 }}>{g.name}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
