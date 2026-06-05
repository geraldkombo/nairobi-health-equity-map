"use client";

interface InsightsDashboardProps {
  countyCount: number;
  facilityCount: number;
  highPriorityCount: number;
  indicators: { population: number; poverty_proxy: number }[];
}

export default function InsightsDashboard({ countyCount, facilityCount, highPriorityCount, indicators }: InsightsDashboardProps) {
  const totalPop = indicators.reduce((s, i) => s + i.population, 0);
  const avgPoverty = indicators.length > 0
    ? (indicators.reduce((s, i) => s + i.poverty_proxy, 0) / indicators.length).toFixed(1)
    : "-";

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Counties</div>
        <div className="mt-1 text-2xl font-bold text-neutral-900">{countyCount}</div>
        <div className="text-xs text-neutral-400">analysed</div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Facilities</div>
        <div className="mt-1 text-2xl font-bold text-neutral-900">{facilityCount}</div>
        <div className="text-xs text-neutral-400">mapped</div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Pop. proxy</div>
        <div className="mt-1 text-2xl font-bold text-neutral-900">{totalPop.toLocaleString()}</div>
        <div className="text-xs text-neutral-400">residents</div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">High priority</div>
        <div className="mt-1 text-2xl font-bold text-neutral-900">{highPriorityCount}</div>
        <div className="text-xs text-neutral-400">counties (PGS &ge;50)</div>
      </div>
    </div>
  );
}
