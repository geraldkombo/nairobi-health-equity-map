"use client";

import React from "react";

export default function SourcesPanel() {
  return (
    <details className="group rounded-[8px] border border-[#E0DBD0] bg-white text-[#292524] shadow-sm transition-all open:pb-4 print:border-black">
      <summary className="min-h-[44px] cursor-pointer list-none flex items-center justify-between p-4 font-bold text-[14px] uppercase tracking-widest text-[#524B3F] hover:bg-[#F8F5F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[8px]">
        <span>Open Data Methodology & Integrity Sources</span>
        <span className="transition group-open:rotate-180">
          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
        </span>
      </summary>

      <div className="px-4 pt-4 border-t border-[#E0DBD0] text-[14px] leading-7 text-[#6B6355]">
        <p className="mb-4">
          All scoring indicators rely strictly on publicly available baselines. Missing or unmapped
          facilities directly elevate physical access scores.
        </p>
        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li>
            <strong>Population:</strong> Kenya National Bureau of Statistics (KNBS) 2019 Census data.
          </li>
          <li>
            <strong>Poverty Rate:</strong> Kenya Integrated Household Budget Survey (KIHBS) 2015/16 baseline indicators.
          </li>
          <li>
            <strong>Facility Mapping:</strong> OpenStreetMap / IGAD Climate Prediction and Applications Centre (ICPAC) master lists. Over 1,699 verified points.
          </li>
          <li>
            <strong>Travel Modeling:</strong> WHO AccessMod methodologies calculating friction surfaces.
          </li>
        </ul>
        <p className="text-[12px] leading-5 text-[#8A8170]">
          Last data refresh: <strong>June 2026</strong>. If a community dispensary is absent from this platform, community members can improve the map by reporting its location to OpenStreetMap directly at
          <a href="https://www.openstreetmap.org/note/new" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#524B3F] min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1 text-[#EA580C]">
            www.openstreetmap.org
          </a>
          or via WhatsApp to the data stewards at
          <a href="https://wa.me/254706813068" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#047857] min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1 text-[#059669]">
            +254 706 813 068
          </a>.
        </p>
      </div>
    </details>
  );
}
