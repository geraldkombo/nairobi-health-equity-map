"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight text-stone-800 no-underline">
          Kenya Health Equity Map
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-stone-500" aria-label="Main navigation">
          <Link href="/method" className="hover:text-stone-800 transition-colors">
            Methodology
          </Link>
          <Link href="/compare" className="hover:text-stone-800 transition-colors">
            Compare
          </Link>
          <Link href="/dua" className="hover:text-stone-800 transition-colors">
            Data
          </Link>
        </nav>
      </div>
    </header>
  );
}
