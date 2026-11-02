"use client";

import { useRouter } from "next/navigation";
import { CPUS, cpuPath, findCpu } from "@/lib/data";
import { ChevronDown } from "./Icons";

export default function CpuJump() {
  const router = useRouter();
  return (
    <label className="cpu-jump">
      <span className="visually-hidden">Choose your CPU</span>
      <select
        defaultValue=""
        onChange={(e) => {
          const c = findCpu(e.target.value);
          if (c) router.push(cpuPath(c));
        }}
      >
        <option value="" disabled>Choose your CPU…</option>
        {(["AMD", "Intel"] as const).map((b) => (
          <optgroup key={b} label={b}>
            {CPUS.filter((c) => c.brand === b).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}
