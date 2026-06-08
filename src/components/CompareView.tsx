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

  const { sA, sB, iA, iB } = stats;

  const equityNote = useMemo(() => {
    if (!sA || !sB) return null;
    const diff = sA.pgs - sB.pgs;
    if (Math.abs(diff) < 1) return null;
    return {
      higher: diff > 0 ? countyA : countyB,
      lower: diff > 0 ? countyB : countyA,
      diff: Math.abs(diff),
    };
  }, [sA, sB, countyA, countyB]);

  if (!iA || !iB || !sA || !sB) {
    return (
      <div className="rounded-[8px] border border-[#E0DBD0] bg-white p-8 text-center text-[14px] leading-7 text-[#6B6355]">
        Indicator data is unavailable for one or both of these counties. Please select a different comparison.
      </div>
    );
  }

  const overlap = Math.abs(sA.pgs - sB.pgs) < 8;

  return (
    <div className="space-y-8">
      {/* Institutional Header */}
      <header className="border-b-4 border-[#78350F] pb-4 print:pb-2">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C] print:text-[9px]">
          Kenya Health Equity Map, County Comparison
        </p>
        <div className="mt-4 flex items-end justify-between">
          <h1 className="text-[24px] font-serif font-extrabold uppercase tracking-tight text-[#78350F] md:text-3xl print:text-xl">
            {countyA.name} vs {countyB.name}
          </h1>
        </div>
      </header>

      {/* National Disparity Spectrum */}
      <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8 shadow-sm print:border-black print:bg-transparent print:p-4">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#524B3F]">
          National Disparity Index (0–100)
        </h2>
        <div className="relative mt-4 h-[56px] w-full rounded-[6px] bg-gradient-to-r from-[#FFF7BC] via-[#FEC44F] via-[#D95F0E] to-[#8C2D04] shadow-inner print:h-[40px]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {overlap ? (
            <>
              <div
                className="absolute -top-[4px] flex -translate-x-1/2 flex-col items-center transition-all duration-500"
                style={{ left: `${Math.min(Math.max(sA.pgs, 0), 100)}%` }}
              >
                <span className="min-h-[44px] inline-flex items-center rounded-[4px] bg-[#292524] px-4 py-1 text-[12px] font-bold text-[#FFFBEB] shadow-sm whitespace-nowrap print:text-[8px] print:px-2 print:py-0">
                  {countyA.name} ({sA.pgs})
                </span>
                <div className="mt-[2px] h-[10px] w-[10px] rotate-45 bg-[#292524] print:hidden" />
              </div>
              <div
                className="absolute flex -translate-x-1/2 flex-col items-center transition-all duration-500"
                style={{ left: `${Math.min(Math.max(sB.pgs, 0), 100)}%`, top: '40px' }}
              >
                <div className="mb-[2px] h-[10px] w-[10px] rotate-45 bg-[#EA580C] print:hidden" />
                <span className="min-h-[44px] inline-flex items-center rounded-[4px] bg-[#EA580C] px-4 py-1 text-[12px] font-bold text-[#FFFBEB] shadow-sm whitespace-nowrap print:text-[8px] print:px-2 print:py-0">
                  {countyB.name} ({sB.pgs})
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                className="absolute -top-[4px] flex -translate-x-1/2 flex-col items-center transition-all duration-500"
                style={{ left: `${Math.min(Math.max(sA.pgs, 0), 100)}%` }}
              >
                <span className="min-h-[44px] inline-flex items-center rounded-[4px] bg-[#292524] px-4 py-1 text-[12px] font-bold text-[#FFFBEB] shadow-sm whitespace-nowrap print:text-[8px] print:px-2 print:py-0">
                  {countyA.name} ({sA.pgs})
                </span>
                <div className="mt-[2px] h-[10px] w-[10px] rotate-45 bg-[#292524] print:hidden" />
              </div>
              <div
                className="absolute -bottom-[4px] flex -translate-x-1/2 flex-col items-center transition-all duration-500"
                style={{ left: `${Math.min(Math.max(sB.pgs, 0), 100)}%` }}
              >
                <div className="mb-[2px] h-[10px] w-[10px] rotate-45 bg-[#EA580C] print:hidden" />
                <span className="min-h-[44px] inline-flex items-center rounded-[4px] bg-[#EA580C] px-4 py-1 text-[12px] font-bold text-[#FFFBEB] shadow-sm whitespace-nowrap print:text-[8px] print:px-2 print:py-0">
                  {countyB.name} ({sB.pgs})
                </span>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-between text-[12px] text-[#8A8170] print:text-[9px]">
          <span>Low (0)</span>
          <span>Critical (70+)</span>
        </div>
      </section>

      {/* County Cards */}
      <section className="grid gap-8 md:grid-cols-2 print:gap-4">
        {([countyA, countyB] as const).map((county, idx) => {
          const s = county.id === countyA.id ? sA : sB;
          const ind = county.id === countyA.id ? iA : iB;
          const accentColor = idx === 0 ? "#78350F" : "#EA580C";
          return (
            <div
              key={county.id}
              className="rounded-[8px] border border-[#E0DBD0] bg-white shadow-sm print:border-black print:shadow-none"
              style={{ borderTop: `4px solid ${accentColor}` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-[#E0DBD0] bg-[#F8F5F0] p-4 print:p-2">
                <div>
                  <h3 className="text-[14px] font-bold font-serif text-[#292524] print:text-[12px]">{county.name}</h3>
                  <p className="text-[12px] uppercase tracking-wide text-[#A8A08F] print:hidden">County</p>
                </div>
                {s && (
                  <div className={`rounded-[6px] px-4 py-1 text-center font-bold shadow-sm print:px-2 print:py-0 ${getPGSBadgeClass(s.pgs)}`}>
                    <span className="text-[20px] print:text-[14px]">{s.pgs}</span>
                    <span className="ml-1 text-[12px] font-normal opacity-80 print:hidden">Priority Gap Score</span>
                  </div>
                )}
              </div>
              {/* Card Body */}
              {ind && (
                <div className="p-4 print:p-2">
                  <table className="w-full text-[14px] print:text-[10px]">
                    <tbody>
                      <tr className="border-b border-[#E0DBD0]">
                        <td className="py-2 text-[#6B6355] print:py-1">Population</td>
                        <td className="py-2 text-right font-semibold text-[#292524] print:py-1">{ind.population.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-[#E0DBD0]">
                        <td className="py-2 text-[#6B6355] print:py-1">Poverty rate</td>
                        <td className="py-2 text-right font-semibold text-[#292524] print:py-1">{ind.poverty_proxy}%</td>
                      </tr>
                      <tr className="border-b border-[#E0DBD0]">
                        <td className="py-2 text-[#6B6355] print:py-1">Travel time to clinic</td>
                        <td className="py-2 text-right font-semibold text-[#292524] print:py-1">
                          {ind.travel_time_to_facility_proxy}{" "}
                          <span className="text-[12px] font-normal text-[#8A8170] print:text-[9px]">minutes</span>
                        </td>
                      </tr>
                      <tr className="border-b border-[#E0DBD0]">
                        <td className="py-2 text-[#6B6355] print:py-1">Mapped facilities</td>
                        <td className="py-2 text-right font-semibold text-[#292524] print:py-1">{ind.facility_count}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-[#6B6355] print:py-1">Facility density</td>
                        <td className="py-2 text-right font-semibold text-[#292524] print:py-1">
                          {ind.facility_density_proxy.toFixed(2)}{" "}
                          <span className="text-[12px] font-normal text-[#8A8170] print:text-[9px]">per 10k</span>
                        </td>
                      </tr>
                      {ind.skilled_birth_attendance != null && (
                        <tr>
                          <td className="py-2 text-[#6B6355] print:py-1">Skilled birth attendance</td>
                          <td className="py-2 text-right font-semibold text-[#292524] print:py-1">
                            {ind.skilled_birth_attendance}%
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {s.drivers.length > 0 && (
                    <div className="mt-4 rounded-[6px] bg-[#F8F5F0] p-4 print:mt-2 print:p-2">
                      <p className="mb-2 text-[12px] font-bold uppercase tracking-widest text-[#6B6355] print:hidden">
                        Key drivers
                      </p>
                      <ul className="list-disc pl-4 text-[12px] leading-6 text-[#524B3F] print:text-[9px] print:leading-4 print:pl-3">
                        {s.drivers.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Advocacy Takeaway */}
      {equityNote && (
        <section
          className="rounded-[8px] border-l-4 bg-[#FFFBEB] p-8 shadow-sm print:border-black print:bg-transparent print:p-4"
          style={{ borderLeftColor: "#EA580C" }}
          role="note"
        >
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#78350F] print:hidden">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Advocacy Takeaway
          </h3>
          <p className="mt-2 text-[14px] leading-7 text-[#292524] print:text-[10px] print:leading-snug">
            Data Takeaway: {equityNote.higher.name} registers a Gap Score of {sA.pgs} compared to {equityNote.lower.name}&rsquo;s {sB.pgs} -- a difference of {equityNote.diff} points. Significant variations in regional infrastructure demand strategic resource distribution.
          </p>
          <div className="mt-4 border-t border-[#E0DBD0] pt-4 text-[12px] font-semibold text-[#78350F] print:mt-2 print:pt-2 print:text-[9px]">
            Use this direct comparison in community-led monitoring to advocate for equitable resource allocation from national and county health executives.
          </div>
        </section>
      )}

      {/* Print Footer */}
      <div className="hidden print:block mt-4 text-center text-[9px] text-[#8A8170]">
        geraldkombo.github.io/kenya-health-equity-map, Source data: KNBS, KIHBS, KDHS, WHO AccessMod, OSM
      </div>
    </div>
  );
}
