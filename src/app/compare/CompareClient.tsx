"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CompareView from "@/components/CompareView";
import SourcesPanel from "@/components/SourcesPanel";

interface CompareClientProps {
  counties: { id: string; name: string }[];
  indicators: any[];
}

export default function CompareClient({ counties, indicators }: CompareClientProps) {
  const [countyA, setCountyA] = useState("");
  const [countyB, setCountyB] = useState("");

  const selA = useMemo(() => counties.find((c) => c.id === countyA) ?? null, [counties, countyA]);
  const selB = useMemo(() => counties.find((c) => c.id === countyB) ?? null, [counties, countyB]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="county-a" className="mb-1 block text-sm font-medium text-stone-700">
            First county
          </label>
          <select
            id="county-a"
            value={countyA}
            onChange={(e) => { setCountyA(e.target.value); if (e.target.value === countyB) setCountyB(""); }}
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            aria-label="Select first county"
          >
            <option value="">Choose a county...</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === countyB}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="county-b" className="mb-1 block text-sm font-medium text-stone-700">
            Second county
          </label>
          <select
            id="county-b"
            value={countyB}
            onChange={(e) => { setCountyB(e.target.value); if (e.target.value === countyA) setCountyA(""); }}
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            aria-label="Select second county"
          >
            <option value="">Choose a county...</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === countyA}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selA && selB && selA.id !== selB.id ? (
        <div className="mt-6">
          <CompareView countyA={selA} countyB={selB} indicators={indicators} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-400">
          Select two counties to see a comparison.
        </div>
      )}

      <div className="mt-8">
        <SourcesPanel />
      </div>

      <div className="mt-6 text-center text-xs text-stone-400">
        <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
      </div>
    </>
  );
}
