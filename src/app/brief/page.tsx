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
    <div className="space-y-6">
      {/* Institutional Header */}
      <header className="break-inside-avoid border-b-4 border-amber-900 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-700">
          Kenya Health Equity Map &middot; Community Evidence Base
        </p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-serif font-extrabold uppercase tracking-tight text-amber-900">
              {county.name} County
            </h1>
            <p className="mt-1 text-sm font-medium text-stone-600">
              Health Equity &amp; Infrastructure Disparity Report
            </p>
          </div>
          <div className="pl-4 text-right">
            <div className="text-4xl font-bold leading-none text-amber-900">
              {score.pgs}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
              Gap Score / 100
            </div>
          </div>
        </div>
      </header>

      {/* Baseline Narrative */}
      <section className="break-inside-avoid">
        <h2 className="text-xs font-bold uppercase tracking-widest text-orange-700">
          Baseline Narrative
        </h2>
        <p className="mt-2 text-sm leading-7 text-stone-800 text-justify">
          {county.name} registers a Priority Gap Score of {score.pgs}/100, indicating severe resource
          inequity. Travel time to the nearest health facility is heavily elevated at{" "}
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
          <div className="mt-3 rounded-sm border-l-4 border-orange-600 bg-orange-50 p-3 text-xs leading-6 text-stone-700">
            <strong>Community context:</strong> Turkana has a 42.6% hardcore poverty rate -
            the highest nationally, encompassing over 745,000 individuals. 42% of women aged 15-49
            report having experienced physical violence, compounding barriers to safe reproductive
            health access. Nomadic populations face near-impassable distances across 77,000 sq km of
            arid terrain.
          </div>
        )}
        {county.name === "Tana River" && (
          <div className="mt-3 rounded-sm border-l-4 border-orange-600 bg-orange-50 p-3 text-xs leading-6 text-stone-700">
            <strong>Community context:</strong> Tana River has a Rural Access Index of just 11.35%
            and a banking access rate of only 8.6%. In late 2023, excessive rains destroyed over
            9,568 acres of crops, causing maize yields to fall 50% and green gram yields 71% below
            long-term averages. Food prices surged 36% above average, depleting household ability to
            afford delivery costs.
          </div>
        )}
        {county.name === "Elgeyo Marakwet" && (
          <div className="mt-3 rounded-sm border-l-4 border-orange-600 bg-orange-50 p-3 text-xs leading-6 text-stone-700">
            <strong>Community context:</strong> The official Kenya Master Health Facility List
            records approximately 129 health facilities in this county, but fewer than 20 are mapped
            on OpenStreetMap. This mapping gap results in an artificial score of 1 facility per
            454,000 people. The county reports a 30% stunting rate among children under five and
            skilled birth attendance of only 56%.
          </div>
        )}
      </section>

      {/* Key Infrastructure Indicators */}
      <section className="break-inside-avoid rounded-sm border border-stone-200 bg-stone-50 p-5 print:border-black print:bg-transparent">
        <h2 className="text-xs font-bold uppercase tracking-widest text-orange-700">
          Key Infrastructure Indicators
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-stone-500">Population</p>
            <p className="text-2xl font-bold text-amber-900">
              {indicator.population.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-stone-500">Poverty Rate</p>
            <p className="text-2xl font-bold text-amber-900">{indicator.poverty_proxy}%</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-stone-500">Mapped Facilities</p>
            <p className="text-2xl font-bold text-amber-900">{indicator.facility_count}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-stone-500">Avg. Travel Time</p>
            <p className="text-2xl font-bold text-amber-900">
              {indicator.travel_time_to_facility_proxy} min
            </p>
          </div>
        </div>
      </section>

      {/* Active Advocacy Focus Section */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-orange-700 uppercase tracking-widest mb-4">
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
                  ? `A ${indicator.poverty_proxy}% poverty rate means most families cannot absorb out-of-pocket delivery costs. Present this data at county budget hearings to advocate for waived maternal health fees.`
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
            <div key={item.key} className="border-l-4 border-orange-600 bg-gray-50 p-4 rounded-r-sm shadow-sm">
              <h3 className="font-bold text-amber-900 text-sm">{item.label}</h3>
              <p className="text-xs text-gray-700 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Integrity & Community Crowdsourcing */}
      <section className="break-inside-avoid border-t border-stone-300 pt-5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
          Data Integrity &amp; Community Crowdsourcing
        </h2>
        <p className="mt-2 text-[11px] leading-6 text-stone-600 text-justify">
          This brief acts as a transparent, open-data baseline for advocacy. It quantifies physical
          access barriers using travel time estimates and validated facility mapping. It does
          not measure clinical quality or staff capacity. Because facility data relies on the current
          OpenStreetMap/ICPAC baseline of 1,699 community-mapped facilities, unmapped rural
          dispensaries may not be reflected.
          <strong className="text-amber-900">
            {" "}If your local clinic is missing from this map, you can report it directly to
            OpenStreetMap at www.openstreetmap.org/note/new#map=6/0.5/38.0 - just drop a pin and describe the
            facility. No account needed. Every addition strengthens the evidence base for all
            communities.
          </strong>
        </p>
        <p className="mt-2 text-[10px] leading-5 text-stone-400">
          <strong>Data sources:</strong> County populations from{" "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/116" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>.
          Poverty rates from{" "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/13" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>.
          Facility locations from{" "}
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI</a>.
          Travel modelling via{" "}
          <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod</a>.
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
    <div className="min-h-[100svh] bg-white text-stone-800">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Screen controls */}
        <div className="mb-6 flex items-start justify-between gap-6 print:hidden">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Kenya Health Equity Map
            </div>
            <h1 className="mt-1 text-xl font-bold text-stone-800">
              {selected ? selected.name : "Select a county"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePrint()}
              disabled={!selected || !indicator}
              className="rounded-lg bg-amber-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Download PDF &rarr;
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-800"
            >
              &larr; Return to map
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 print:hidden" role="alert">
            {error}
          </div>
        )}

        {!countyCode ? (
          <div className="mt-8 rounded-xl border border-stone-200 p-6 text-sm text-stone-500 print:hidden">
            Open this page from the map by clicking <strong>Generate brief</strong> on a selected county.
          </div>
        ) : !selected || !indicator ? (
          <div className="mt-8 rounded-xl border border-stone-200 p-6 text-sm text-stone-500 print:hidden">
            Loading county data&hellip;
          </div>
        ) : (
          <div ref={printRef}>
            <PrintableBrief
              county={selected}
              indicator={indicator}
            />
          </div>
        )}

        <p className="mt-8 text-center text-[10px] text-stone-300 print:hidden">
          geraldkombo.github.io/kenya-health-equity-map
        </p>
      </div>
    </div>
  );
}

export default function BriefPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-8 text-sm text-stone-500">Loading brief...</div>}>
      <BriefContent />
    </Suspense>
  );
}
