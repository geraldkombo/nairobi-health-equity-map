"use client";

import { useEffect, useMemo, useState } from "react";
import CompareView from "@/components/CompareView";
import SourcesPanel from "@/components/SourcesPanel";
import WeightsControl from "@/components/WeightsControl";
import type { WardRecord, IndicatorRecord } from "@/lib/adapters";
import { DEFAULT_WEIGHTS, type PGSWeights } from "@/lib/scoring";
import { fetchWards, fetchIndicators } from "@/lib/data-fetch";

export default function ComparePage() {
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [wardA, setWardA] = useState("");
  const [wardB, setWardB] = useState("");
  const [weights, setWeights] = useState<PGSWeights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    async function load() {
      try {
        const [wardsRes, indicators] = await Promise.all([
          fetchWards(),
          fetchIndicators(),
        ]);
        setWards(wardsRes.wards);
        setIndicators(indicators);
      } catch {}
    }
    load();
  }, []);

  const selA = useMemo(() => wards.find((w) => w.id === wardA) ?? null, [wards, wardA]);
  const selB = useMemo(() => wards.find((w) => w.id === wardB) ?? null, [wards, wardB]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Compare wards</h1>
      <p className="mt-1 text-sm text-neutral-500">Select two wards to compare their equity indicators side by side.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ward-a" className="mb-1 block text-sm font-medium text-neutral-700">
            First ward
          </label>
          <select
            id="ward-a"
            value={wardA}
            onChange={(e) => setWardA(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            aria-label="Select first ward"
          >
            <option value="">Choose a ward...</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} — {w.subcounty}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ward-b" className="mb-1 block text-sm font-medium text-neutral-700">
            Second ward
          </label>
          <select
            id="ward-b"
            value={wardB}
            onChange={(e) => setWardB(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            aria-label="Select second ward"
          >
            <option value="">Choose a ward...</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} — {w.subcounty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <WeightsControl weights={weights} onChange={setWeights} />
      </div>

      {selA && selB ? (
        <div className="mt-6">
          <CompareView wardA={selA} wardB={selB} indicators={indicators} weights={weights} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-400">
          Select two wards to see a comparison.
        </div>
      )}

      <div className="mt-8">
        <SourcesPanel />
      </div>
    </div>
  );
}
