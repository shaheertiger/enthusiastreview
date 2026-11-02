"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "./Icons";

const LINKS = [
  { href: "/", label: "GPU bottleneck finder" },
  { href: "/#cpus", label: "All CPUs" },
  { href: "/methodology/", label: "How we test" },
  { href: "/about/", label: "About" },
  { href: "/affiliate-disclosure/", label: "Affiliate disclosure" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="wordmark" aria-label="enthusiastreview home">
          enthusiast<span>review</span>
        </a>
        <button
          type="button"
          className="btn-icon44"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav id="site-menu" className={`menu${open ? " is-open" : ""}`} aria-label="Main">
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
