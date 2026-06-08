"use client";

import { useMemo, useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS, getPGSBadgeClass } from "@/lib/scoring";
import type { IndicatorRecord, CountyRecord } from "@/lib/adapters";
import { fetchCounties, fetchIndicators } from "@/lib/data-fetch";
import { matchCountyName } from "@/lib/county-names";

function PrintableBrief({
  county,
  indicator,
}: {
  county: CountyRecord;
  indicator: IndicatorRecord;
}) {
  const norm = normalizeCounty(indicator);
  const score = computePGS(county.id, norm, DEFAULT_WEIGHTS);

  return (
    <div className="space-y-8">
      {/* Institutional Header */}
      <header className="break-inside-avoid border-b-4 border-[#78350F] pb-4">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">
          Kenya Health Equity Map, Community Evidence Base
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-serif font-extrabold uppercase tracking-tight text-[#78350F]">
              {county.name} County
            </h1>
            <p className="mt-2 text-[14px] font-medium text-[#6B6355]">
              Health Equity &amp; Infrastructure Disparity Report
            </p>
          </div>
          <div className="pl-4 text-right">
            <div className="text-4xl font-bold leading-none text-[#78350F]">
              {score.pgs}
            </div>
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#524B3F]">
              Gap Score / 100
            </div>
          </div>
        </div>
      </header>

      {/* Baseline Narrative */}
      <section className="break-inside-avoid">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">
          Baseline Narrative
        </h2>
        <p className="mt-4 text-[14px] leading-7 text-[#292524] text-justify">
          {county.name} registers a Priority Gap Score of {score.pgs}/100, indicating significant resource
          disparity. Travel time to the nearest health facility is substantially elevated at{" "}
          {indicator.travel_time_to_facility_proxy} minutes, demonstrating acute physical access
          constraints in peripheral wards. The socioeconomic vulnerability remains high with a
          poverty rate of {indicator.poverty_proxy}%. Furthermore, with only{" "}
          {indicator.facility_count} validated facilities mapped against a vast geography, facility
          density remains a critical limiting factor for decentralized care. These indicators are
          derived from open-data baselines (KNBS 2019 Census, KIHBS, OpenStreetMap/ICPAC
          facility inventory) and provide a verifiable, transparent starting point for community-led
          advocacy.
        </p>
        {county.name === "Turkana" && (
          <div className="mt-4 rounded-[8px] border-l-4 border-[#EA580C] bg-[#FFFBEB] p-4 text-[12px] leading-6 text-[#524B3F]">
            <strong className="text-[#292524]">Community context:</strong> Turkana has a 42.6% hardcore poverty rate -
            the highest nationally, encompassing over 745,000 individuals. 42% of women aged 15-49
            report having experienced physical violence, compounding barriers to safe reproductive
            health access. Nomadic populations face near-impassable distances across 77,000 sq km of
            arid terrain.
          </div>
        )}
        {county.name === "Tana River" && (
          <div className="mt-4 rounded-[8px] border-l-4 border-[#EA580C] bg-[#FFFBEB] p-4 text-[12px] leading-6 text-[#524B3F]">
            <strong className="text-[#292524]">Community context:</strong> Tana River has a Rural Access Index of just 11.35%
            and a banking access rate of only 8.6%. In late 2023, excessive rains destroyed over
            9,568 acres of crops, causing maize yields to fall 50% and green gram yields 71% below
            long-term averages. Food prices surged 36% above average, depleting household ability to
            afford delivery costs.
          </div>
        )}
        {county.name === "Elgeyo Marakwet" && (
          <div className="mt-4 rounded-[8px] border-l-4 border-[#EA580C] bg-[#FFFBEB] p-4 text-[12px] leading-6 text-[#524B3F]">
            <strong className="text-[#292524]">Community context:</strong> The official Kenya Master Health Facility List
            records approximately 129 health facilities in this county, but fewer than 20 are mapped
            on OpenStreetMap. This mapping gap results in an artificial score of 1 facility per
            454,000 people. The county reports a 30% stunting rate among children under five and
            skilled birth attendance of only 56%.
          </div>
        )}
      </section>

      {/* Key Infrastructure Indicators */}
      <section className="break-inside-avoid rounded-[8px] border border-[#E0DBD0] bg-[#F8F5F0] p-8 print:border-black print:bg-transparent">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">
          Key Infrastructure Indicators
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-[12px] font-semibold uppercase text-[#6B6355]">Population</p>
            <p className="text-2xl font-bold text-[#78350F]">
              {indicator.population.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase text-[#6B6355]">Poverty Rate</p>
            <p className="text-2xl font-bold text-[#78350F]">{indicator.poverty_proxy}%</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase text-[#6B6355]">Mapped Facilities</p>
            <p className="text-2xl font-bold text-[#78350F]">{indicator.facility_count}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase text-[#6B6355]">Avg. Travel Time</p>
            <p className="text-2xl font-bold text-[#78350F]">
              {indicator.travel_time_to_facility_proxy} min
            </p>
          </div>
        </div>
      </section>

      {/* Active Advocacy Focus Section */}
      <section className="mb-8">
        <h2 className="text-[14px] font-bold text-[#EA580C] uppercase tracking-widest mb-4">
          Community Advocacy Focus Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(
            [
              {
                key: "infrastructure",
                label: "Infrastructure Access",
                desc: norm.travelTime > 0.6
                  ? `Travel time of ${indicator.travel_time_to_facility_proxy} minutes exceeds most counties. Use this metric to advocate for mobile clinics, ambulance services, or a new dispensary in the underserved ward.`
                  : `With ${indicator.travel_time_to_facility_proxy} minute average travel time, use this baseline to monitor whether new road or transport investments reduce access barriers over time.`,
              },
              {
                key: "financial",
                label: "Financial Protection",
                desc: norm.poverty > 0.6
                  ? `A ${indicator.poverty_proxy}% poverty rate means most families cannot absorb out-of-pocket delivery costs. Raise this at CHMT planning meetings and Health Facility Management Committee discussions to advocate for waived maternal health fees.`
                  : `At ${indicator.poverty_proxy}% poverty, financial barriers still affect access. Use this figure to argue for subsidized transport or supply vouchers for expectant mothers.`,
              },
              {
                key: "capacity",
                label: "Facility Capacity",
                desc: norm.populationPressure > 0.6 || norm.facilityDensity > 0.6
                  ? `${indicator.facility_count} mapped facilities serve ${indicator.population.toLocaleString()} people. Leverage this ratio to demand staffing increases, drug supply allocations, and infrastructure upgrades.`
                  : `${indicator.facility_count} mapped facilities serve this county. Community mapping can expand this count - report missing clinics to OpenStreetMap to strengthen the evidence base.`,
              },
            ] satisfies { key: string; label: string; desc: string }[]
          ).map((item) => (
            <div key={item.key} className="border-l-4 border-[#EA580C] bg-[#F8F5F0] p-4 rounded-[8px] shadow-sm">
              <h3 className="font-bold font-serif text-[#78350F] text-[14px]">{item.label}</h3>
              <p className="text-[12px] text-[#524B3F] mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Integrity & Community Crowdsourcing */}
      <section className="break-inside-avoid border-t border-[#E0DBD0] pt-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#6B6355]">
          Data Integrity &amp; Community Crowdsourcing
        </h2>
        <p className="mt-4 text-[12px] leading-6 text-[#524B3F] text-justify">
          This brief acts as a transparent, open-data baseline for advocacy. It quantifies physical
          access barriers using travel time estimates and validated facility mapping. It does
          not measure clinical quality or staff capacity. Because facility data relies on the current
          OpenStreetMap/ICPAC baseline of 1,699 community-mapped facilities, unmapped rural
          dispensaries may not be reflected.
          <strong className="text-[#78350F]">
            {" "}If your local clinic is missing from this map, you can report it directly to
            OpenStreetMap at <a href="https://www.openstreetmap.org/note/new#map=6/0.5/38.0" target="_blank" rel="noreferrer" className="min-h-[44px] inline-flex items-center underline underline-offset-2 hover:text-[#B45309] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">www.openstreetmap.org/note/new</a> - just drop a pin and describe the
            facility. No account needed. Every addition strengthens the evidence base for all
            communities. Or send the facility name and location via WhatsApp to
            <a href="https://wa.me/254706813068" target="_blank" rel="noreferrer" className="min-h-[44px] inline-flex items-center text-[#059669] hover:text-[#047857] underline underline-offset-2 ml-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">+254 706 813 068</a>.
          </strong>
        </p>
        <p className="mt-4 text-[12px] leading-5 text-[#8A8170]">
          <strong>Data sources:</strong> County populations from{" "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/116" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#524B3F] min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">KNBS 2019 Census</a>.
          Poverty rates from{" "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/13" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#524B3F] min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">KIHBS 2015/16</a>.
          Facility locations from{" "}
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#524B3F] min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">ICPAC/KEMRI</a>.
          Travel modelling via{" "}
          <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#524B3F] min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">WHO AccessMod</a>.
          <br />
          <strong>Citation:</strong> Kenya Health Equity Map. {county.name} County CLM Evidence
          Brief. geraldkombo.github.io/kenya-health-equity-map
        </p>
      </section>
    </div>
  );
}

function BriefContent() {
  const params = useSearchParams();
  const countyCode = params.get("county");
  const printRef = useRef<HTMLDivElement>(null);

  const [counties, setCounties] = useState<CountyRecord[] | null>(null);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [countiesRes, indicators] = await Promise.all([
          fetchCounties(),
          fetchIndicators(),
        ]);
        setCounties(countiesRes.counties);
        setIndicators(indicators);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load data.");
      }
    }
    load();
  }, []);

  const selected = useMemo(() => {
    if (!counties || !countyCode) return null;
    return counties.find((c) => c.id === countyCode) ?? null;
  }, [counties, countyCode]);

  const indicator = useMemo(() => {
    if (!selected) return null;
    return indicators.find((i) => matchCountyName(i.county_name, selected.name)) ?? null;
  }, [selected, indicators]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `kenya-health-equity-brief-${selected?.name?.toLowerCase().replace(/\s+/g, "-") ?? countyCode}`,
    pageStyle: `
      @page { size: A4; margin: 15mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  return (
    <div className="min-h-[100svh] bg-white text-[#292524]">
      <div className="mx-auto max-w-3xl px-8 py-8">
        {/* Screen controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 print:hidden">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#A8A08F]">
              Kenya Health Equity Map
            </div>
            <h1 className="mt-2 text-xl font-bold font-serif text-[#292524]">
              {selected ? selected.name : "Select a county"}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => handlePrint()}
              disabled={!selected || !indicator}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[6px] bg-[#78350F] px-4 py-2 text-[14px] font-bold text-[#FFFBEB] shadow-sm transition-colors hover:bg-[#451A03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
            >
              Download PDF Document
            </button>
            <Link
              href="/"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-[14px] font-medium text-[#524B3F] underline underline-offset-2 transition-colors hover:text-[#292524] hover:bg-[#F8F5F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              &larr; Return to map
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-[8px] border border-red-200 bg-red-50 p-4 text-[14px] text-red-700 print:hidden" role="alert">
            {error}
          </div>
        )}

        {!countyCode ? (
          <div className="mt-8 rounded-[8px] border border-[#E0DBD0] p-8 text-[14px] text-[#524B3F] print:hidden">
            To access this page, select a county from the map interface and choose <strong>Generate analytical brief</strong>.
          </div>
        ) : !selected || !indicator ? (
          <div className="mt-8 rounded-[8px] border border-[#E0DBD0] p-8 text-[14px] text-[#524B3F] print:hidden">
            Loading county metrics&hellip;
          </div>
        ) : (
          <div ref={printRef}>
            <PrintableBrief
              county={selected}
              indicator={indicator}
            />
          </div>
        )}

        <p className="mt-8 text-center text-[12px] text-[#C8C1B3] print:hidden">
          geraldkombo.github.io/kenya-health-equity-map
        </p>
      </div>
    </div>
  );
}

export default function BriefPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-8 py-8 text-[14px] text-[#524B3F]">Loading brief...</div>}>
      <BriefContent />
    </Suspense>
  );
}
