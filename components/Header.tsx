import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">
          Enthusiast<span className="text-brand-600">Review</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/#graphics-cards" className="hover:text-brand-600">
            Graphics Cards
          </Link>
          <Link href="/#power-supplies" className="hover:text-brand-600">
            Power Supplies
          </Link>
          <Link href="/#cases" className="hover:text-brand-600">
            Cases
          </Link>
          <Link href="/#guides" className="hover:text-brand-600">
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}
