"use client";

import Link from "next/link";

interface InsightsDashboardProps {
  countyCount: number;
  facilityCount: number;
  highPriorityCount: number;
  indicators: { population: number; poverty_proxy: number }[];
}

function StatCard({ label, value, sub, href }: { label: string; value: string | number; sub: string; href?: string }) {
  const content = (
    <div className="rounded-xl border border-stone-200 bg-white p-4 transition-all duration-200 ease-in-out hover:shadow-md cursor-pointer">
      <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-stone-800">{value}</div>
      <div className="text-xs text-stone-400">{sub}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-accent-600 focus-visible:outline-offset-2 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}

export default function InsightsDashboard({ countyCount, facilityCount, highPriorityCount, indicators }: InsightsDashboardProps) {
  const totalPop = indicators.reduce((s, i) => s + i.population, 0);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
      <StatCard label="Counties" value={countyCount} sub="compare side-by-side" href="/compare" />
      <StatCard label="Facilities" value={facilityCount} sub="view data sources" href="/dua#sources" />
      <StatCard label="Population" value={totalPop.toLocaleString()} sub="residents" href="/method#formula" />
      <StatCard label="High priority" value={highPriorityCount} sub="counties (Priority Gap Score >= 50)" href="/method#thresholds" />
    </div>
  );
}
