"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS, getPGSBadgeClass } from "@/lib/scoring";
import { matchCountyName } from "@/lib/county-names";

interface CompareViewProps {
  countyA: CountyRecord;
  countyB: CountyRecord;
  indicators: IndicatorRecord[];
}

export default function CompareView({ countyA, countyB, indicators }: CompareViewProps) {
  const stats = useMemo(() => {
    const iA = indicators.find((i) => matchCountyName(i.county_name, countyA.name));
    const iB = indicators.find((i) => matchCountyName(i.county_name, countyB.name));

    const sA = iA ? computePGS(countyA.id, normalizeCounty(iA), DEFAULT_WEIGHTS) : null;
    const sB = iB ? computePGS(countyB.id, normalizeCounty(iB), DEFAULT_WEIGHTS) : null;

    return { sA, sB, iA, iB };
  }, [countyA, countyB, indicators]);

  const narrative = useMemo(() => {
    if (!stats.sA || !stats.sB) return null;
    const diff = stats.sA.pgs - stats.sB.pgs;
    if (Math.abs(diff) < 1) return "Both counties face a similar level of need.";
    const higher = diff > 0 ? countyA.name : countyB.name;
    const lower = diff > 0 ? countyB.name : countyA.name;
    return null;
  }, [stats, countyA.name, countyB.name]);

  const equityNote = useMemo(() => {
    if (!stats.sA || !stats.sB) return null;
    const diff = stats.sA.pgs - stats.sB.pgs;
    if (Math.abs(diff) < 1) return null;
    const h = diff > 0 ? countyA : countyB;
    const l = diff > 0 ? countyB : countyA;
    const d = Math.abs(diff);
    return { higher: h, lower: l, diff: d };
  }, [stats, countyA, countyB]);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {[countyA, countyB].map((county) => {
          const s = county.id === countyA.id ? stats.sA : stats.sB;
          const ind = county.id === countyA.id ? stats.iA : stats.iB;
          return (
            <div key={county.id} className="rounded-xl border border-stone-200 bg-white p-5 transition-all duration-200 ease-in-out hover:shadow-md">
              <h3 className="font-bold text-stone-800">{county.name}</h3>
              <p className="text-sm text-stone-500">County</p>
              {s && (
                <div className={`mt-3 inline-block rounded-lg px-3 py-1.5 ${getPGSBadgeClass(s.pgs)}`}>
                  <span className="text-xl font-bold">{s.pgs}</span>
                  <span className="ml-1 text-xs font-medium opacity-80">PGS</span>
                </div>
              )}
              {ind && (
                <div className="mt-4 space-y-2 text-sm text-stone-700">
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-500">Population</span>
                    <span className="font-medium text-stone-700">{ind.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-500">Poverty rate</span>
                    <span className="font-medium text-stone-700">{ind.poverty_proxy}%</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-500">Travel time</span>
                    <span className="font-medium text-stone-700">{ind.travel_time_to_facility_proxy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Facility density</span>
                    <span className="font-medium text-stone-700">{ind.facility_density_proxy}</span>
                  </div>
                </div>
              )}
              {s && (
                <div className="mt-3 text-xs text-stone-500 leading-5">
                  <strong className="text-stone-600">Why:</strong> {s.drivers.slice(0, 2).join("; ") || "All measures within normal range"}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {narrative && (
        <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700" role="note">
          <strong>What this means:</strong> {narrative}
        </div>
      )}
      {equityNote && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 shadow-sm" role="note">
          <p className="font-semibold">This {equityNote.diff}-point gap means communities in <strong>{equityNote.higher.name}</strong> face significantly more barriers to care than those in <strong>{equityNote.lower.name}</strong>.</p>
          <p className="mt-2 font-medium">Use this comparison in your advocacy to demand equitable resource distribution from the national and county governments.</p>
        </div>
      )}
    </div>
  );
}
