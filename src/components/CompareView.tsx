"use client";

import React from "react";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";

interface CompareViewProps {
  countyA: { id: string; name: string };
  countyB: { id: string; name: string };
  indicators: any[];
}

export default function CompareView({ countyA, countyB, indicators }: CompareViewProps) {
  const indA = indicators.find((i) => i.county_name.toUpperCase() === countyA.name.toUpperCase());
  const indB = indicators.find((i) => i.county_name.toUpperCase() === countyB.name.toUpperCase());

  if (!indA || !indB) {
    return (
      <div className="rounded-[8px] border border-[#E0DBD0] p-8 text-center text-[14px] leading-7 text-[#6B6355]">
        Indicator data is missing for one or both of these counties. Please select another comparison.
      </div>
    );
  }

  const scoreA = computePGS(countyA.id, normalizeCounty(indA), DEFAULT_WEIGHTS);
  const scoreB = computePGS(countyB.id, normalizeCounty(indB), DEFAULT_WEIGHTS);

  const diff = Math.abs(scoreA.pgs - scoreB.pgs);
  const overlap = diff < 8;

  const A_COLOR = "#78350F";
  const B_COLOR = "#EA580C";

  return (
    <div className="space-y-8">
      {/* Gap Score Spectrum */}
      <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8 shadow-sm print:border-black print:bg-transparent">
        <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#524B3F] mb-8">
          Priority Gap Score Disparity
        </h2>

        <div className="relative h-[12px] rounded-[6px] bg-[#E0DBD0] print:border print:border-[#A8A08F]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div
            className="absolute top-0 bottom-0 bg-[#A8A08F] opacity-20"
            style={{
              left: `${Math.min(scoreA.pgs, scoreB.pgs)}%`,
              right: `${100 - Math.max(scoreA.pgs, scoreB.pgs)}%`
            }}
          />

          <div
            className={`absolute -top-[16px] w-[16px] h-[44px] rounded-[4px] border-2 border-white shadow-sm transition-all z-10 print:border-black`}
            style={{ left: `calc(${scoreA.pgs}% - 8px)`, backgroundColor: A_COLOR }}
            title={`${countyA.name}: ${scoreA.pgs}/100`}
          />
          <div
            className={`absolute w-[16px] h-[44px] rounded-[4px] border-2 border-white shadow-sm transition-all z-20 print:border-black ${overlap && scoreA.pgs <= scoreB.pgs ? 'top-[4px]' : overlap ? '-top-[36px]' : '-top-[16px]'}`}
            style={{ left: `calc(${scoreB.pgs}% - 8px)`, backgroundColor: B_COLOR }}
            title={`${countyB.name}: ${scoreB.pgs}/100`}
          />
        </div>

        <div className="mt-8 flex justify-between text-[12px] font-semibold text-[#8A8170]">
          <span>0 (High Resource Equity)</span>
          <span>100 (Severe Infrastructure Gap)</span>
        </div>
      </section>

      {/* Raw Data Comparison Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-[8px] border-t-4 bg-[#F8F5F0] p-8 shadow-sm print:border-black print:bg-transparent" style={{ borderColor: A_COLOR }}>
          <h3 className="text-[24px] font-bold text-[#292524] mb-4">{countyA.name}</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Gap Score</span>
              <span className="text-[14px] font-bold" style={{ color: A_COLOR }}>{scoreA.pgs}/100</span>
            </div>
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Poverty Rate</span>
              <span className="text-[14px] font-bold text-[#292524]">{indA.poverty_proxy}%</span>
            </div>
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Facility Count</span>
              <span className="text-[14px] font-bold text-[#292524]">{indA.facility_count}</span>
            </div>
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Avg Travel Time</span>
              <span className="text-[14px] font-bold text-[#292524]">{indA.travel_time_to_facility_proxy} min</span>
            </div>
          </div>
        </div>

        <div className="rounded-[8px] border-t-4 bg-[#F8F5F0] p-8 shadow-sm print:border-black print:bg-transparent" style={{ borderColor: B_COLOR }}>
          <h3 className="text-[24px] font-bold text-[#292524] mb-4">{countyB.name}</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Gap Score</span>
              <span className="text-[14px] font-bold" style={{ color: B_COLOR }}>{scoreB.pgs}/100</span>
            </div>
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Poverty Rate</span>
              <span className="text-[14px] font-bold text-[#292524]">{indB.poverty_proxy}%</span>
            </div>
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Facility Count</span>
              <span className="text-[14px] font-bold text-[#292524]">{indB.facility_count}</span>
            </div>
            <div className="flex justify-between border-b border-[#E0DBD0] pb-2">
              <span className="text-[12px] font-semibold uppercase text-[#6B6355]">Avg Travel Time</span>
              <span className="text-[14px] font-bold text-[#292524]">{indB.travel_time_to_facility_proxy} min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Advocacy Takeaways */}
      <section className="rounded-[8px] border border-[#E0DBD0] bg-[#FFFBEB] p-8 shadow-sm print:border-black print:bg-transparent">
        <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F] mb-4">
          Key Drivers & Advocacy Takeaways
        </h2>
        <p className="text-[14px] leading-7 text-[#292524]">
          This comparison highlights a {diff} point gap between {countyA.name} and {countyB.name}.
          {indA.travel_time_to_facility_proxy > indB.travel_time_to_facility_proxy
            ? ` ${countyA.name} experiences significantly worse average travel times (${indA.travel_time_to_facility_proxy} min) compared to ${countyB.name} (${indB.travel_time_to_facility_proxy} min). `
            : ` ${countyB.name} registers more severe access barriers in travel distance (${indB.travel_time_to_facility_proxy} min) vs ${countyA.name}. `}
          {indA.poverty_proxy > indB.poverty_proxy
            ? ` Compounding this physical barrier, ${countyA.name}'s elevated poverty rate (${indA.poverty_proxy}%) restricts ability to absorb transport costs.`
            : ` Financial constraints are heavily concentrated in ${countyB.name} (${indB.poverty_proxy}% poverty).`}
        </p>
        <p className="text-[14px] leading-7 text-[#524B3F] mt-4 font-semibold">
          Advocacy action: Use this data to negotiate proportional CHMT budget allocations between neighboring wards. Request mobile clinical outreach for regions exceeding 60-minute travel times.
        </p>
      </section>
    </div>
  );
}
