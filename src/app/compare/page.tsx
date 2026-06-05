"use client";

import { useEffect, useMemo, useState } from "react";
import CompareView from "@/components/CompareView";
import SourcesPanel from "@/components/SourcesPanel";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { fetchCounties, fetchIndicators } from "@/lib/data-fetch";

export default function ComparePage() {
  const [counties, setCounties] = useState<CountyRecord[]>([]);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [countyA, setCountyA] = useState("");
  const [countyB, setCountyB] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [countiesRes, indicators] = await Promise.all([
          fetchCounties(),
          fetchIndicators(),
        ]);
        setCounties(countiesRes.counties);
        setIndicators(indicators);
      } catch {}
    }
    load();
  }, []);

  const selA = useMemo(() => counties.find((c) => c.id === countyA) ?? null, [counties, countyA]);
  const selB = useMemo(() => counties.find((c) => c.id === countyB) ?? null, [counties, countyB]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Compare counties</h1>
      <p className="mt-1 text-sm text-neutral-500">Select two counties to compare their equity indicators side by side.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="county-a" className="mb-1 block text-sm font-medium text-neutral-700">
            First county
          </label>
          <select
            id="county-a"
            value={countyA}
            onChange={(e) => setCountyA(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            aria-label="Select first county"
          >
            <option value="">Choose a county...</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="county-b" className="mb-1 block text-sm font-medium text-neutral-700">
            Second county
          </label>
          <select
            id="county-b"
            value={countyB}
            onChange={(e) => setCountyB(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            aria-label="Select second county"
          >
            <option value="">Choose a county...</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selA && selB ? (
        <div className="mt-6">
          <CompareView countyA={selA} countyB={selB} indicators={indicators} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-400">
          Select two counties to see a comparison.
        </div>
      )}

      <div className="mt-8">
        <SourcesPanel />
      </div>
    </div>
  );
}
