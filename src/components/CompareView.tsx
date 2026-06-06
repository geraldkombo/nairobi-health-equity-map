"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";

interface CompareViewProps {
  countyA: CountyRecord;
  countyB: CountyRecord;
  indicators: IndicatorRecord[];
}

function pgsBadge(pgs: number): string {
  if (pgs >= 70) return "text-stone-50 bg-[#78350F]";
  if (pgs >= 50) return "text-white bg-[#EA580C]";
  if (pgs >= 30) return "text-stone-800 bg-[#F59E0B]";
  return "text-stone-800 bg-[#FDE68A]";
}

export default function CompareView({ countyA, countyB, indicators }: CompareViewProps) {
  const stats = useMemo(() => {
    const iA = indicators.find((i) => i.county_code === countyA.id);
    const iB = indicators.find((i) => i.county_code === countyB.id);

    const sA = iA ? computePGS(countyA.id, normalizeCounty(iA), DEFAULT_WEIGHTS) : null;
    const sB = iB ? computePGS(countyB.id, normalizeCounty(iB), DEFAULT_WEIGHTS) : null;

    return { sA, sB, iA, iB };
  }, [countyA, countyB, indicators]);

  const narrative = useMemo(() => {
    if (!stats.sA || !stats.sB) return null;
    const diff = stats.sA.pgs - stats.sB.pgs;
    if (Math.abs(diff) < 1) return "Both counties have a similar assessed priority level.";
    const higher = diff > 0 ? countyA.name : countyB.name;
    const lower = diff > 0 ? countyB.name : countyA.name;
    return `${higher} is assessed as higher priority than ${lower}.`;
  }, [stats, countyA.name, countyB.name]);

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
                <div className={`mt-3 inline-block rounded-lg px-3 py-1.5 ${pgsBadge(s.pgs)}`}>
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
                    <span className="text-stone-500">Poverty proxy</span>
                    <span className="font-medium text-stone-700">{ind.poverty_proxy}%</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-500">Travel time proxy</span>
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
                  <strong className="text-stone-600">Drivers:</strong> {s.drivers.slice(0, 2).join("; ") || "All indicators within range"}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {narrative && (
        <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700" role="note">
          <strong>Comparison summary:</strong> {narrative}
        </div>
      )}
    </div>
  );
}
