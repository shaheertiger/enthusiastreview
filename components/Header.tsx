import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { IconChip } from "@/components/icons";

export default function Header() {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <IconChip className="h-[18px] w-[18px]" />
          </span>
          <span className="brand-word">
            Enthusiast<span className="brand-accent">Review</span>
          </span>
        </Link>
        <nav className="hidden gap-7 text-sm font-medium sm:flex">
          <Link href="/#graphics-cards" className="nav-link">
            Graphics Cards
          </Link>
          <Link href="/#power-supplies" className="nav-link">
            Power Supplies
          </Link>
          <Link href="/#cases" className="nav-link">
            Cases
          </Link>
          <Link href="/#guides" className="nav-link">
            Guides
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
