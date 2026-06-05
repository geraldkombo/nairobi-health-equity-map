"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900 no-underline">
          Nairobi Health Equity Map
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-600" aria-label="Main navigation">
          <Link href="/method" className="hover:text-neutral-900 transition-colors">
            Method
          </Link>
          <Link href="/compare" className="hover:text-neutral-900 transition-colors">
            Compare
          </Link>
          <a
            href="https://github.com/geraldkombo/nairobi-health-equity-map"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-900 transition-colors"
            aria-label="View source code on GitHub"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
