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

  const equityNote = useMemo(() => {
    if (!stats.sA || !stats.sB) return null;
    const diff = stats.sA.pgs - stats.sB.pgs;
    if (Math.abs(diff) < 1) return null;
    const h = diff > 0 ? countyA : countyB;
    const l = diff > 0 ? countyB : countyA;
    const d = Math.abs(diff);
    return { higher: h, lower: l, diff: d };
  }, [stats, countyA, countyB]);

  const pgsA = stats.sA?.pgs ?? 0;
  const pgsB = stats.sB?.pgs ?? 0;

  return (
    <div>
      {/* National inequity spectrum */}
      {stats.sA && stats.sB && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm print:mb-2 print:border-black print:p-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 print:hidden">National inequity spectrum (0-100)</h3>
          <div className="relative mt-3 h-8 w-full rounded-lg bg-gradient-to-r from-[#FFF7BC] via-[#FEC44F] via-[#D95F0E] to-[#8C2D04] shadow-inner print:mt-1 print:h-4">
            <div
              className="absolute -top-1 flex -translate-x-1/2 flex-col items-center transition-all duration-500"
              style={{ left: `${Math.min(Math.max(pgsA, 0), 100)}%` }}
            >
              <span className="rounded bg-stone-900 px-1.5 py-0.5 text-[10px] font-bold text-white shadow print:text-[8px] print:px-1 print:py-0">
                {countyA.name} ({pgsA})
              </span>
              <div className="mt-0.5 h-2 w-2 rotate-45 bg-stone-900 print:hidden" />
            </div>
            <div
              className="absolute -bottom-1 flex -translate-x-1/2 flex-col items-center transition-all duration-500"
              style={{ left: `${Math.min(Math.max(pgsB, 0), 100)}%` }}
            >
              <div className="mb-0.5 h-2 w-2 rotate-45 bg-blue-700 print:hidden" />
              <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold text-white shadow print:text-[8px] print:px-1 print:py-0">
                {countyB.name} ({pgsB})
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-stone-400 print:text-[8px] print:mt-0">
            <span>Low (0)</span>
            <span>Critical (70+)</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 print:gap-2">
        {[countyA, countyB].map((county, idx) => {
          const s = county.id === countyA.id ? stats.sA : stats.sB;
          const ind = county.id === countyA.id ? stats.iA : stats.iB;
          const borderColor = idx === 0 ? "border-l-stone-900" : "border-l-blue-700";
          return (
            <div key={county.id} className={`rounded-xl border border-stone-200 bg-white shadow-sm ${borderColor} border-l-4 print:border print:shadow-none`}>
              <div className="flex items-start justify-between border-b border-stone-100 bg-stone-50 p-4 print:p-1.5">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 print:text-sm">{county.name}</h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wide print:hidden">County</p>
                </div>
                {s && (
                  <div className={`rounded-lg px-3 py-1.5 text-center font-bold ${getPGSBadgeClass(s.pgs)} print:px-1.5 print:py-0.5`}>
                    <span className="text-xl print:text-sm">{s.pgs}</span>
                    <span className="ml-1 text-xs font-normal opacity-80 print:hidden">Gap Score</span>
                  </div>
                )}
              </div>
              {ind && (
                <div className="p-4 print:p-1.5">
                  <ul className="space-y-2 text-sm print:space-y-0 print:text-[10px]">
                    <li className="flex justify-between border-b border-stone-100 py-1.5 print:py-0.5">
                      <span className="text-stone-500 print:text-[10px]">Population</span>
                      <span className="font-semibold text-stone-900 print:text-[10px]">{ind.population.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-100 py-1.5 print:py-0.5">
                      <span className="text-stone-500 print:text-[10px]">Poverty rate</span>
                      <span className="font-semibold text-stone-900 print:text-[10px]">{ind.poverty_proxy}%</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-100 py-1.5 print:py-0.5">
                      <span className="text-stone-500 print:text-[10px]">Travel time to clinic</span>
                      <span className="font-semibold text-stone-900 print:text-[10px]">
                        {ind.travel_time_to_facility_proxy}{" "}
                        <span className="text-xs font-normal text-stone-500 print:text-[9px]">minutes</span>
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-stone-100 py-1.5 print:py-0.5">
                      <span className="text-stone-500 print:text-[10px]">Facility density</span>
                      <span className="font-semibold text-stone-900 print:text-[10px]">
                        {ind.facility_density_proxy.toFixed(2)}{" "}
                        <span className="text-xs font-normal text-stone-500 print:text-[9px]">per 10k people</span>
                      </span>
                    </li>
                  </ul>
                  {s && s.drivers.length > 0 && (
                    <div className="mt-4 rounded-lg bg-stone-50 p-3 print:mt-1 print:p-1.5">
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 print:hidden">
                        Key drivers of inequity
                      </p>
                      <ul className="list-disc pl-4 text-xs leading-5 text-stone-700 print:text-[9px] print:leading-4 print:pl-3">
                        {s.drivers.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                        {s.drivers.length === 0 && <li>All measures within normal range</li>}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {equityNote && (
        <div className="mt-6 rounded-r-lg border-l-4 border-red-600 bg-red-50 p-5 shadow-sm print:mt-2 print:p-2" role="note">
          <h4 className="flex items-center gap-2 text-sm font-bold text-red-900 print:hidden">
            <svg className="h-4 w-4 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Advocacy takeaway
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-red-800 print:text-[10px] print:leading-snug print:mt-0.5">
            The <strong>{equityNote.diff}-point gap</strong> reveals a stark systemic disparity. Communities in{" "}
            <strong>{equityNote.higher.name}</strong> face significantly more barriers to basic care, enduring longer
            travel times and severely under-resourced facilities compared to{" "}
            <strong>{equityNote.lower.name}</strong>.
          </p>
          <div className="mt-3 border-t border-red-200 pt-3 text-xs font-semibold text-red-900 print:mt-1 print:pt-1 print:text-[9px]">
            Use this direct comparison in your community-led monitoring to demand equitable resource allocation from
            national and county health executives.
          </div>
        </div>
      )}
    </div>
  );
}
