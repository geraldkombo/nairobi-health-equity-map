# Source Bundle for Language Audit

Feed this entire document to Gemini with the `audit-all-source-files-prompt.md` instructions.

=== src/app/page.tsx ===

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import CountyDetails from "@/components/CountyDetails";
import HowToUse from "@/components/HowToUse";
import SourcesPanel from "@/components/SourcesPanel";
import InsightsDashboard from "@/components/InsightsDashboard";
import CountyRankings from "@/components/CountyRankings";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { fetchCounties, fetchIndicators, dataUrl } from "@/lib/data-fetch";
import { matchCountyName } from "@/lib/county-names";
import MapErrorBoundary from "@/components/MapErrorBoundary";
import SearchBar from "@/components/SearchBar";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function HomePage() {
  const [counties, setCounties] = useState<CountyRecord[] | null>(null);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [boundaries, setBoundaries] = useState<GeoJSON.FeatureCollection | null>(null);
  const [selectedCountyCode, setSelectedCountyCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function load() {
      try {
        const [countiesRes, indicators, boundariesRes] = await Promise.all([
          fetchCounties(),
          fetchIndicators(),
          fetch(dataUrl("/data/boundaries/counties_simplified.geojson")).then(async (r) => {
            if (!r.ok) throw new Error(`Boundaries fetch failed: ${r.status}`);
            return r.json();
          }),
        ]);
        if (!Array.isArray(countiesRes.counties)) throw new Error("Counties data is not an array");
        if (!boundariesRes || !boundariesRes.features) throw new Error("Boundaries data missing features");
        setCounties(countiesRes.counties);
        setBoundaries(boundariesRes);
        setIndicators(indicators);
        setLoaded(true);
      } catch (e: any) {
        setError(`Data load error: ${e?.message ?? "Unknown"}`);
      }
    }
    load();
  }, []);

  const selectedCounty = useMemo(() => {
    if (!counties || !selectedCountyCode) return null;
    return counties.find((c) => c.id === selectedCountyCode) ?? null;
  }, [counties, selectedCountyCode]);

  const countyScores = useMemo(() => {
    if (!counties || indicators.length === 0) return {};
    const scores: Record<string, number> = {};
    for (const county of counties) {
      const ind = indicators.find((i) => matchCountyName(i.county_name, county.name));
      if (ind) {
        const norm = normalizeCounty(ind);
        scores[county.id] = computePGS(county.id, norm, DEFAULT_WEIGHTS).pgs;
      }
    }
    return scores;
  }, [counties, indicators]);

  const countyNames = useMemo(() => {
    if (!counties) return {};
    const names: Record<string, string> = {};
    for (const c of counties) names[c.id] = c.name;
    return names;
  }, [counties]);

  const handleCountySelect = useCallback((countyCode: string) => {
    setSelectedCountyCode(countyCode || null);
  }, []);

  const totalFacilities = indicators.reduce((sum, i) => sum + i.facility_count, 0);
  const highPriorityCounties = counties ? counties.filter(c => (countyScores[c.id] ?? 0) >= 50).length : 0;

  return (
    <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6">
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {loaded && counties && (
        <InsightsDashboard
          countyCount={counties.length}
          facilityCount={totalFacilities}
          highPriorityCount={highPriorityCounties}
          indicators={indicators}
        />
      )}

      <div className="mb-3 sm:mb-6">
        <p className="mt-0.5 text-xs font-medium text-stone-700 sm:text-sm">
          Identify regions with the most critical service deficits and access evidence to support policy reform.
        </p>
        <p className="mt-0.5 text-[11px] italic text-stone-500 sm:text-xs">
          Effective health monitoring requires reliable and accessible data.
        </p>
      </div>

      <div className="mb-3 sm:mb-4">
        <HowToUse />
      </div>

      <div className="mb-3 max-w-sm sm:mb-6">
        {counties && (
          <SearchBar
            counties={counties.map((c) => ({ id: c.id, name: c.name, code: c.id }))}
            onSelect={handleCountySelect}
          />
        )}
      </div>

      <div className="relative grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {boundaries ? (
            <MapErrorBoundary>
              <MapView
                boundaries={boundaries}
                countyScores={countyScores}
                countyNames={countyNames}
                onCountyClick={handleCountySelect}
                selectedCountyCode={selectedCountyCode}
              />
            </MapErrorBoundary>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-500">
              Loading geographic data...
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 sm:mt-4 sm:text-xs">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#FFF7BC] sm:h-3 sm:w-3"></span> Low (&lt;30)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#FEC44F] sm:h-3 sm:w-3"></span> Medium (30-49)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#D95F0E] sm:h-3 sm:w-3"></span> High (50&ndash;69)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#8C2D04] sm:h-3 sm:w-3"></span> Critical (70+)
            </span>
            <span className="ml-auto text-stone-400">Priority Gap Score</span>
          </div>
        </div>

        <div className="hidden space-y-4 lg:block">
          {selectedCounty ? (
            <CountyDetails
              county={selectedCounty}
              indicators={indicators}
            />
          ) : (
            counties && (
              <CountyRankings
                counties={counties}
                indicators={indicators}
                onCountyClick={handleCountySelect}
              />
            )
          )}
          <SourcesPanel />
        </div>
      </div>

      {selectedCounty && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70svh] overflow-y-auto rounded-t-2xl border border-stone-200 bg-white shadow-2xl lg:hidden">
          <div className="sticky top-0 flex items-center justify-between bg-white px-4 pt-2 pb-1">
            <div className="h-1.5 w-12 rounded-full bg-stone-300 mx-auto"></div>
            <button
              onClick={() => setSelectedCountyCode(null)}
              className="absolute right-3 top-2 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
              aria-label="Close county details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="px-4 pb-6">
            <CountyDetails
              county={selectedCounty}
              indicators={indicators}
            />
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-stone-200 pt-6">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/brief?county=1"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Access sample brief
          </Link>
          <Link
            href="/method"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Review methodology
          </Link>
          <Link
            href="/compare"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Compare county metrics
          </Link>
        </div>
      </div>
      <div className="mt-6 border-t border-stone-100 pt-4 pb-2">
        <p className="text-[10px] leading-5 text-stone-400">
          <strong>Data sources:</strong>{" "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/116" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>
          {" · "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/13" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>
          {" · "}
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI Health Facilities</a>
          {" · "}
          <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod travel model</a>
          {" · "}
          <a href="https://kemri-wellcome.org/press-release-launch-of-comprehensive-public-health-facility-inventory-for-sub-saharan-africa/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KEMRI/Wellcome Trust</a>
          {" · "}
          <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">OSM Kenya road network</a>
          {" · "}
          <a href="https://esa-worldcover.org/en" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ESA WorldCover land cover</a>
          {" · "}
          <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/116" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS GIS boundaries</a>
          <span className="ml-1">| CC-BY-4.0 open data</span>
        </p>
      </div>
    </div>
  );
}
```

=== src/app/brief/page.tsx ===

```tsx
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
           derived from open-data baselines (KNBS 2019 Census from the Kenya National Bureau of Statistics, KIHBS from the Kenya Integrated Household Budget Survey, OpenStreetMap / ICPAC facility inventory from the IGAD Climate Prediction and Applications Centre) and provide a verifiable, transparent starting point for community-led
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
                  ? `A ${indicator.poverty_proxy}% poverty rate means most families cannot absorb out-of-pocket delivery costs. Raise this at County Health Management Team (CHMT) planning meetings and Health Facility Management Committee discussions to advocate for waived maternal health fees.`
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
            {" "}If a local clinic is absent from this map, community members can report it directly to
            OpenStreetMap at <a href="https://www.openstreetmap.org/note/new#map=6/0.5/38.0" target="_blank" rel="noreferrer" className="min-h-[44px] inline-flex items-center underline underline-offset-2 hover:text-[#B45309] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] rounded-[4px] px-1">www.openstreetmap.org/note/new</a> - drop a pin and describe the
            facility. No account is required. Every addition strengthens the evidence base for all
            communities. Facility name and location can also be sent via WhatsApp to
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
```

=== src/app/compare/CompareClient.tsx ===

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CompareView from "@/components/CompareView";
import SourcesPanel from "@/components/SourcesPanel";

interface CompareClientProps {
  counties: { id: string; name: string }[];
  indicators: any[];
}

const NEIGHBORS: Record<string, string[]> = {
  MOMBASA: ["KWALE", "KILIFI"],
  KWALE: ["MOMBASA", "KILIFI"],
  KILIFI: ["KWALE", "MOMBASA", "TANA RIVER"],
  "TANA RIVER": ["KILIFI", "LAMU", "GARISSA", "KITUI"],
  LAMU: ["TANA RIVER", "GARISSA"],
  "TAITA TAVETA": ["KWALE", "KILIFI", "MAKUENI"],
  GARISSA: ["TANA RIVER", "LAMU", "WAJIR", "ISIOLO"],
  WAJIR: ["GARISSA", "MANDERA", "MARSABIT", "ISIOLO"],
  MANDERA: ["WAJIR", "MARSABIT"],
  MARSABIT: ["WAJIR", "MANDERA", "ISIOLO", "SAMBURU"],
  ISIOLO: ["MARSABIT", "WAJIR", "GARISSA", "KITUI", "MERU", "SAMBURU"],
  MERU: ["ISIOLO", "THARAKA NITHI", "NYERI", "KIRINYAGA", "EMBU"],
  "THARAKA NITHI": ["MERU", "EMBU", "KITUI"],
  EMBU: ["THARAKA NITHI", "MERU", "KIRINYAGA", "MACHAKOS", "KITUI"],
  KITUI: ["TANA RIVER", "EMBU", "MACHAKOS", "MAKUENI"],
  MACHAKOS: ["KITUI", "EMBU", "MAKUENI", "KAJIADO", "NAIROBI", "KIAMBU"],
  MAKUENI: ["KITUI", "MACHAKOS", "KAJIADO", "TAITA TAVETA"],
  NYERI: ["MERU", "KIRINYAGA", "NYANDARUA", "NAKURU", "LAIKIPIA"],
  KIRINYAGA: ["MERU", "EMBU", "NYERI", "MURANGA"],
  MURANGA: ["KIRINYAGA", "KIAMBU", "NYANDARUA"],
  KIAMBU: ["NAIROBI", "MACHAKOS", "MURANGA", "NYANDARUA", "NAKURU"],
  NAIROBI: ["KIAMBU", "MACHAKOS", "KAJIADO"],
  KAJIADO: ["MACHAKOS", "MAKUENI", "TAITA TAVETA", "NAROK"],
  NYANDARUA: ["NYERI", "MURANGA", "KIAMBU", "NAKURU"],
  NAKURU: ["NYANDARUA", "KIAMBU", "LAIKIPIA", "BARINGO", "KERICHO", "NANDI"],
  LAIKIPIA: ["NYERI", "NAKURU", "SAMBURU", "ISIOLO"],
  SAMBURU: ["MARSABIT", "ISIOLO", "LAIKIPIA", "BARINGO", "WEST POKOT", "TURKANA"],
  BARINGO: ["NAKURU", "LAIKIPIA", "SAMBURU", "WEST POKOT"],
  "WEST POKOT": ["SAMBURU", "TURKANA", "TRANS NZOIA", "ELGEYO MARAKWET"],
  TURKANA: ["MARSABIT", "SAMBURU", "WEST POKOT"],
  "ELGEYO MARAKWET": ["BARINGO", "WEST POKOT", "TRANS NZOIA", "UASIN GISHU"],
  "TRANS NZOIA": ["WEST POKOT", "ELGEYO MARAKWET", "UASIN GISHU", "BUNGOMA"],
  "UASIN GISHU": ["ELGEYO MARAKWET", "TRANS NZOIA", "NANDI"],
  NANDI: ["NAKURU", "KERICHO", "UASIN GISHU"],
  KERICHO: ["NAKURU", "NANDI", "BOMET", "NAROK"],
  BOMET: ["KERICHO", "NAROK"],
  NAROK: ["KAJIADO", "KERICHO", "BOMET", "MIGORI"],
  "HOMA BAY": ["MIGORI", "KISUMU", "SIAYA"],
  MIGORI: ["NAROK", "HOMA BAY", "KISII"],
  KISUMU: ["HOMA BAY", "SIAYA", "VIHIGA"],
  SIAYA: ["HOMA BAY", "KISUMU", "VIHIGA"],
  VIHIGA: ["KISUMU", "SIAYA", "KAKAMEGA"],
  KAKAMEGA: ["VIHIGA", "BUSIA", "BUNGOMA"],
  BUSIA: ["KAKAMEGA", "BUNGOMA"],
  BUNGOMA: ["KAKAMEGA", "BUSIA", "TRANS NZOIA"],
  KISII: ["MIGORI", "NYAMIRA"],
  NYAMIRA: ["KISII"],
};

export default function CompareClient({ counties, indicators }: CompareClientProps) {
  const [countyA, setCountyA] = useState("");
  const [countyB, setCountyB] = useState("");

  const selA = useMemo(() => counties.find((c) => c.id === countyA) ?? null, [counties, countyA]);
  const selB = useMemo(() => counties.find((c) => c.id === countyB) ?? null, [counties, countyB]);

  const suggestedNeighbors = useMemo(() => {
    if (!selA) return [];
    const neighborNames = NEIGHBORS[selA.name.toUpperCase()] || [];
    return counties.filter((c) => neighborNames.includes(c.name.toUpperCase()));
  }, [selA, counties]);

  const handlePrint = () => window.print();

  return (
    <>
      <div className="mb-8 pb-4 border-b border-[#E0DBD0] print:hidden flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-[24px] font-bold font-serif text-[#78350F] md:text-3xl">Compare Counties</h1>
          <p className="text-[#6B6355] mt-4 text-[14px] leading-7">
            Select two counties to evaluate their infrastructure disparities side-by-side.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {(countyA || countyB) && (
            <button
              onClick={() => { setCountyA(""); setCountyB(""); }}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 bg-[#F8F5F0] border border-[#E0DBD0] hover:bg-[#F0EDE6] text-[#292524] font-bold px-4 py-2 rounded-[6px] transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] active:scale-[0.98] text-[12px] uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset Selection
            </button>
          )}
          {selA && selB && (
            <button
              onClick={handlePrint}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[6px] bg-[#EA580C] px-4 py-2 text-[14px] font-bold text-[#FFFBEB] shadow-sm transition-colors hover:bg-[#C2410C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92400E] active:scale-[0.98]"
            >
              Print advocacy report
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[8px] border border-[#E0DBD0] bg-[#F8F5F0] p-8 shadow-sm print:hidden">
        <div className="mb-4 flex items-center justify-between border-b border-[#E0DBD0] pb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#524B3F]">
            Configure Comparison
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Select Primary County
            </label>
            <select
              value={countyA}
              onChange={(e) => { setCountyA(e.target.value); setCountyB(""); }}
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              <option value="">-- Choose a County --</option>
              {counties.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Select Comparison County
            </label>
            <select
              value={countyB}
              onChange={(e) => setCountyB(e.target.value)}
              disabled={!countyA}
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] disabled:opacity-50"
            >
              <option value="">-- Choose a County --</option>
              {counties.filter((c) => c.id !== countyA).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {selA && suggestedNeighbors.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-[#A8A08F]">
                  Suggested neighboring counties:
                </p>
                <div className="flex flex-wrap gap-4">
                  {suggestedNeighbors.map((n) => {
                    const isActive = selB?.id === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setCountyB(n.id)}
                        className={`min-h-[44px] inline-flex items-center justify-center rounded-[6px] px-4 py-2 text-[14px] font-medium shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] active:scale-[0.98] ${
                          isActive
                            ? "bg-[#78350F] font-bold text-[#FFFBEB]"
                            : "bg-[#FFFBEB] border border-[#E0DBD0] text-[#92400E] hover:bg-[#FDE68A] hover:border-[#FCD34D]"
                        }`}
                      >
                        {isActive ? "Comparing " : "+ "}{n.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {selA && selB ? `Now comparing ${selA.name} and ${selB.name}` : ""}
      </div>

      {selA && selB && selA.id !== selB.id ? (
        <div className="mt-8 print:m-2 print:p-2">
          <CompareView countyA={selA} countyB={selB} indicators={indicators} />
        </div>
      ) : (
        <div className="mt-8 rounded-[8px] border border-[#E0DBD0] bg-white p-8 text-center text-[14px] leading-7 text-[#8A8170]">
          Choose a primary county from the left dropdown, then select a neighbor or secondary county to reveal infrastructure disparities.
        </div>
      )}

      <div className="hidden print:block text-center text-[10px] font-bold text-[#292524] mb-4 mt-8 pt-8 border-t border-black">
        Kenya Health Equity Map -- County Comparison Report: {selA?.name || "N/A"} vs {selB?.name || "N/A"}
      </div>

      <div className="mt-8 print:hidden">
        <SourcesPanel />
      </div>

      <div className="mt-8 text-center text-[12px] text-[#A8A08F] print:hidden flex justify-center">
        <Link
          href="/"
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-[14px] font-medium text-[#524B3F] underline underline-offset-2 transition-colors hover:text-[#292524] hover:bg-[#F8F5F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
        >
          &larr; Return to map
        </Link>
      </div>
    </>
  );
}
```

=== src/app/compare/page.tsx ===

```tsx
import countiesData from "@/../data/snapshots/counties.json";
import indicatorsData from "@/../data/snapshots/county_indicators.json";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Compare Counties | Kenya Health Equity Map",
  description: "Side-by-side comparison of health equity indicators across Kenyan counties.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <CompareClient
        counties={countiesData as { id: string; name: string }[]}
        indicators={indicatorsData as any[]}
      />
    </div>
  );
}
```

=== src/app/dua/page.tsx ===

```tsx
import Link from "next/link";

export const metadata = {
  title: "Data Use Agreement | Kenya Health Equity Map",
  description: "Data sources, licenses, attribution requirements, and citation guidelines for the Kenya Health Equity Map.",
};

function SourceRow({ name, url, license }: { name: string; url: string; license: string }) {
  return (
    <tr className="border-b border-stone-100 text-sm">
      <td className="py-2.5 pr-4 text-stone-800 font-medium">{name}</td>
      <td className="py-2.5 pr-4">
        <a href={url} target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 break-all">{url}</a>
      </td>
      <td className="py-2.5 text-stone-600">{license}</td>
    </tr>
  );
}

export default function DUAPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold font-serif tracking-tight text-stone-800">Data Use Agreement</h1>
      <p className="mt-1 text-sm text-stone-500">
        How data is sourced, attributed, and licensed on this platform.
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Open Data Principles</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The Kenya Health Equity Map is built entirely on open civic data. Every indicator, boundary, and
            facility location displayed on this platform can be traced to a publicly available source.
            We believe transparency in methodology builds trust with the communities and stakeholders
            who use this tool for planning and advocacy.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Use of this platform constitutes agreement to attribute the original data creators in any derivative
            work, publication, or research that incorporates data presented here.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Source Register</h2>
          <p className="mt-1 text-sm text-stone-500">
            Every dataset used in this platform, its license, and the date it was accessed.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="pb-2 pr-4 text-left">Dataset</th>
                  <th className="pb-2 pr-4 text-left">Source URL</th>
                  <th className="pb-2 text-left">License</th>
                </tr>
              </thead>
              <tbody>
                <SourceRow name="KNBS 2019 Census (Population)" url="https://statistics.knbs.or.ke/nada/index.php/catalog/116" license="Open Data" />
                <SourceRow name="KDHS 2022 (Poverty Estimates)" url="https://dhsprogram.com/data/dataset/Kenya_Standard-DHS_2022.cfm" license="Restricted (registered use)" />
                <SourceRow name="KMHFR Facility Registry" url="https://kmhfr.health.go.ke/" license="Open Data" />
                <SourceRow name="ICPAC/KEMRI Health Facilities" url="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" license="CC-BY-4.0" />
                <SourceRow name="IEBC County Boundaries" url="https://github.com/tigawanna/kenya_wards_geojson_data" license="CC-BY-4.0" />
                <SourceRow name="KNBS GIS Boundary Files" url="https://statistics.knbs.or.ke/nada/index.php/catalog/116" license="Open Data" />
                <SourceRow name="OCHA HDX Kenya Population" url="https://data.humdata.org/dataset/kenya-population-statistics" license="CC-BY-4.0" />
                <SourceRow name="OSM Kenya Road Network" url="https://www.openstreetmap.org/relation/192798" license="ODbL-1.0" />
                <SourceRow name="ESA WorldCover Land Cover" url="https://esa-worldcover.org/en" license="CC-BY-4.0" />
                <SourceRow name="WHO AccessMod" url="https://www.accessmod.org" license="GPL-3.0" />
                <SourceRow name="World Bank Kenya Poverty Data" url="https://pip.worldbank.org/country-profiles/KEN" license="CC-BY-4.0" />
                <SourceRow name="Geofabrik Kenya OSM Extract" url="https://download.geofabrik.de/africa/kenya.html" license="ODbL-1.0" />
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Attribution Requirements</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
            <p>
              <strong>Kenya National Bureau of Statistics (KNBS) data</strong> must be attributed as &ldquo;Kenya National Bureau of Statistics,
              2019 Kenya Population and Housing Census.&rdquo; The KNBS terms of use require that any
              publication using KNBS data include a disclaimer that KNBS does not bear responsibility
              for the interpretation or analysis of the data.
            </p>
            <p>
              <strong>IGAD Climate Prediction and Applications Centre (ICPAC) / Kenya Medical Research Institute (KEMRI) data</strong> is licensed under CC-BY-4.0. Attribution must include
              &ldquo;ICPAC and KEMRI/Wellcome Trust, Kenya Health Facilities dataset.&rdquo;
            </p>
            <p>
              <strong>OpenStreetMap data</strong> is licensed under the ODbL-1.0. Attribution must
              read &ldquo;OpenStreetMap contributors&rdquo; with a link to
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 ml-1">openstreetmap.org/copyright</a>.
            </p>
            <p>
              <strong>European Space Agency (ESA) WorldCover</strong> is licensed under CC-BY-4.0. Attribution must include
              &ldquo;European Space Agency, ESA WorldCover 10 m 2021.&rdquo;
            </p>
            <p>
              <strong>WHO AccessMod</strong> is open source under GPL-3.0. Any derivative use of the
              AccessMod methodology must reference the original WHO tool.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Suggested Citation</h2>
          <div className="mt-4 rounded-lg bg-[#FDE68A] p-5 text-sm leading-6 text-stone-800">
            <p className="font-mono">
              Kenya Health Equity Map.
              <em> Map-first civic intelligence platform for health equity across Kenya&apos;s 47 counties.</em>
              Nairobi, Kenya. Retrieved from https://geraldkombo.github.io/kenya-health-equity-map/
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            For county-specific briefs, include the county name, Priority Gap Score, and a
            list of source datasets used. Example: &ldquo;Turkana County Brief, Kenya Health Equity Map,
            Sources: KNBS 2019 Census, KIHBS 2015/16, ICPAC/KEMRI Health Facilities.&rdquo;
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Clinical Data Disclaimer</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            This platform uses indirect measures to assess gaps in health access. It does not measure
            clinical outcomes, quality of care, or health service readiness. For clinical health data,
            refer to the
            <a href="https://hiskenya.org/" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 ml-1">Kenya Health Information System (KHIS)</a>
            {" "}(DHIS2) maintained by the Ministry of Health, which provides facility-level
            service delivery data, commodity availability, and disease surveillance.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Data Contribution and Distribution</h2>
          <div className="mt-4 space-y-5 text-sm leading-6 text-stone-700">
            <div>
              <strong className="text-stone-800">Adding a missing health facility</strong>
              <p className="mt-1">
                Facility location data is sourced from OpenStreetMap (OSM), a free and openly
                editable global geographic database. Users wishing to contribute a missing
                health facility may do so through the following process:
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1 pl-1">
                <li>Register a free account at <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2">openstreetmap.org</a>.</li>
                <li>Navigate to the facility location and select the <strong>Edit</strong> function.</li>
                <li>Place a node and assign the appropriate tags -- facility name, type (hospital, clinic, dispensary), and operational status.</li>
                <li>Submit the changes. The facility will appear on this platform following the next scheduled data refresh.</li>
              </ol>
              <p className="mt-2 text-xs text-amber-700">
                <strong>Data integrity requirement:</strong> Only facilities confirmed through
                physical inspection or verifiable official sources should be submitted. Entries
                based on unverified reports, planned construction, or outdated references
                should not be submitted.
              </p>
            </div>
            <div>
              <strong className="text-stone-800">Sharing a county profile on WhatsApp</strong>
              <p className="mt-1">
                County profiles can be shared via the native device sharing function.
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
          <p className="text-sm text-stone-500">Inquiries and Data Corrections</p>
          <a
            href="https://github.com/geraldkombo/kenya-health-equity-map/issues"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Submit a correction request via GitHub
          </a>
        </div>
        <div className="text-xs text-stone-400 text-center">
          This agreement is governed under the terms of the MIT License as applied to the
          Kenya Health Equity Map software, and under the respective terms of each data
          source for the content presented.
        </div>
      </div>
    </div>
  );
}
```

=== src/app/forum/page.tsx ===

```tsx
import Link from "next/link";

export const metadata = {
  title: "Forum | Kenya Health Equity Map",
  description: "3rd CSS Knowledge Dissemination Forum - offline-first CLM evidence base.",
};

export default function ForumLanding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans text-stone-900">
      <div className="w-full max-w-md rounded-xl border border-orange-200 bg-orange-50 p-8 text-center shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-700">
          3rd CSS Knowledge Dissemination Forum
        </p>
        <h1 className="mb-2 font-serif text-3xl font-extrabold text-amber-900">
          Kenya Health Equity Map
        </h1>
        <p className="mb-6 text-sm text-stone-700">
          Evidence base for health equity monitoring. Fully functional offline
          with no user tracking.
        </p>

        <div className="mb-6 rounded-lg border border-orange-100 bg-white p-4 text-left">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-800">
            Offline Functionality Verification
          </p>
          <p className="text-sm text-stone-600">
            1. Allow the application to initialize completely.<br />
            2. Enable <strong>Airplane Mode</strong> on the device.<br />
            3. Select a county below to view the corresponding data.
          </p>
        </div>

        <h2 className="mb-3 text-left text-sm font-bold uppercase tracking-widest text-amber-900">
          Live CLM Case Studies
        </h2>

        <div className="space-y-3">
          {[
            { href: "/brief?county=turkana", name: "Turkana County", score: 92, desc: "Analysis indicates critical vulnerabilities in geographic accessibility and health infrastructure." },
            { href: "/brief?county=mandera", name: "Mandera County", score: 91, desc: "Data demonstrates significant resource disparities requiring targeted intervention." },
            { href: "/brief?county=tana-river", name: "Tana River County", score: 89, desc: "Metrics highlight substantial gaps in facility-to-population ratios." },
            { href: "/brief?county=elgeyo-marakwet", name: "Elgeyo-Marakwet County", scoreLabel: "129 facilities", desc: "Evaluations reveal an elevated necessity for systematic policy reform to address service deficits." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-full flex-col gap-1 rounded-lg bg-amber-900 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-orange-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{item.name}</span>
                <span className="rounded border border-white/40 px-2 py-0.5 text-xs opacity-80">
                  {item.score ?? item.scoreLabel}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-orange-200">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-bold text-orange-700 underline underline-offset-4 hover:text-amber-900"
          >
            Access the complete interactive map
          </Link>
        </div>
      </div>
    </div>
  );
}
```

=== src/app/method/page.tsx ===

```tsx
import Link from "next/link";
import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="text-[24px] font-bold font-serif text-[#78350F]">Methodology Framework</h1>
      <p className="mt-4 text-[14px] leading-7 text-[#6B6355] border-l-4 border-[#EA580C] pl-4">
        Health equity requires transparent, verifiable methodologies. All algorithms, data sources, and calculations are publicly documented and independently reproducible.
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-[8px] border border-[#E0DBD0] bg-[#FFFBEB] p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Sustainable Development Goals Alignment</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The platform is aligned with <strong>SDG 3 (Good Health and Well-being)</strong>. It maps where health infrastructure gaps are worst so resources can reach the people who need them most. It also supports <strong>SDG 10 (Reduced Inequalities)</strong> by making within-country disparities visible at a glance, particularly for rural and marginalised populations.
          </p>
        </section>

        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">The Priority Gap Score (PGS)</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The Priority Gap Score (PGS) is a composite index from <strong>0 to 100</strong> that measures health infrastructure inequity within each county. Higher scores indicate greater service gaps and stronger claims on resource allocation.
          </p>
          <div className="mt-4 rounded-[6px] bg-[#F8F5F0] p-4 text-[14px] leading-7 text-[#524B3F]">
            <p className="font-semibold text-[#292524]">How to read the score:</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li><strong>0-29:</strong> Relatively equitable resource distribution</li>
              <li><strong>30-49:</strong> Moderate infrastructure gaps</li>
              <li><strong>50-69:</strong> Significant gaps requiring intervention</li>
              <li><strong>70-100:</strong> Severe gaps requiring urgent resource allocation</li>
            </ul>
          </div>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            <strong>Turkana</strong> (PGS 92) and <strong>Mandera</strong> (PGS 91) are the most underserved counties. <strong>Nairobi</strong> (PGS 40) has more facilities per person and lower poverty, so its score is lower.
          </p>
        </section>

        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Score Components</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            The PGS combines three dimensions, each normalised to a 0-1 scale before aggregation:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[8px] bg-[#F8F5F0] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">1. Vulnerability (30%)</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#524B3F]">
                Proportion of the county population living below the poverty line. Higher poverty reduces a household&apos;s ability to afford transport, consultation fees, and treatment.
              </p>
            </div>
            <div className="rounded-[8px] bg-[#F8F5F0] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">2. Physical Access (40%)</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#524B3F]">
                Mean travel time to the nearest mapped health facility, computed using least-cost path analysis along road and path networks. Higher travel times indicate greater geographic barriers to care.
              </p>
            </div>
            <div className="rounded-[8px] bg-[#F8F5F0] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">3. Population Pressure (30%)</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#524B3F]">
                Population-to-facility ratio. Higher ratios mean more people sharing each facility, leading to longer wait times and reduced service quality.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[8px] bg-[#F8F5F0] p-4 text-[14px] leading-7 text-[#524B3F]">
            <p className="font-semibold text-[#292524]">Formula:</p>
            <p className="mt-1">
              <strong>PGS</strong> = (Physical Access x 0.40) + (Vulnerability x 0.30) + (Population Pressure x 0.30)
            </p>
            <p className="text-[12px] leading-5 text-[#6B6355] mt-2">
              Each component is normalised to a 0-1 scale, then the weighted sum is multiplied by 100.
            </p>
          </div>
        </section>

        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Travel time estimation</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            Travel times are estimated using <strong>AccessMod</strong>, a World Health Organization (WHO)-supported tool for geographic accessibility modelling. It finds the fastest route along OpenStreetMap roads and paths: paved roads assume motorised transport; unpaved roads and paths assume walking or bicycle speeds.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            This model was developed by researchers at the Kenya Medical Research Institute (KEMRI)-Wellcome Trust. Road data comes from <a href="https://www.openstreetmap.org/relation/192798">OpenStreetMap</a>. Tool: <a href="https://www.accessmod.org">AccessMod</a>.
          </p>
        </section>

        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Rationale for selected indicators</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            These three dimensions map to widely accepted categories in health-access measurement:
          </p>
          <ul className="mt-4 space-y-4 text-[14px] leading-7 text-[#524B3F]">
            <li><strong>Travel time and facility density</strong> measure <strong>physical accessibility</strong>, defined as the geographic capacity to reach clinical care when needed.</li>
            <li><strong>Poverty rates</strong> approximate <strong>economic accessibility</strong>, defined as the financial capacity to afford transport, fees, and treatment.</li>
            <li><strong>Population-to-facility ratios</strong> capture <strong>demand pressure</strong>, measuring the operational strain on existing health infrastructure.</li>
          </ul>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            All datasets are from publicly accessible sources, including the Kenya National Bureau of Statistics (KNBS), the Kenya Demographic and Health Survey (KDHS), the Kenya Integrated Household Budget Survey (KIHBS), WHO AccessMod, and OpenStreetMap, ensuring every input can be independently verified.
          </p>
        </section>

        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Maternal Health Access</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The platform adds county-level <strong>Skilled Birth Attendance (SBA)</strong> rates from the Kenya Demographic and Health Survey (KDHS 2022). SBA tracks the share of deliveries attended by a trained professional. When low SBA coincides with long travel times, the result is a <strong>maternal health access desert</strong> where women face two compounding barriers at once.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            SBA appears in the county detail panel alongside the PGS, making it easy to flag counties that need maternal health investment, mobile clinics, or community health worker deployment.
          </p>
        </section>

        <section className="rounded-[8px] bg-[#78350F] p-8 text-[#FFFBEB]">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#FDE68A]">Data Limitations and Future Considerations</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#FFFBEB]">
            This map relies on a validated baseline of 1,699 community-mapped facilities, representing approximately 10% of Kenya&apos;s officially registered facilities. The calculated scores therefore represent a strict minimum baseline.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#FFFBEB]">
            <strong className="text-[#FDE68A]">Example:</strong> Elgeyo-Marakwet County has approximately 129 facilities in the official Kenya Master Health Facility List, but fewer than 20 are mapped on OpenStreetMap. This creates an artificial score of 1 facility per 454,000 people. The gap between official records and community mapping is precisely where intervention is needed.
          </p>
          <p className="mt-4 text-[14px] font-medium text-[#FDE68A]">
            Every gap in the map is a chance for community members to improve the data.
          </p>
          <div className="mt-4 rounded-[8px] bg-white p-6 text-[#292524]">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#78350F]">Procedure for reporting unmapped health facilities</h3>
            <ol className="mt-4 list-decimal pl-4 space-y-4 text-[14px] leading-7 text-[#524B3F]">
              <li>Navigate to <a href="https://www.openstreetmap.org/note/new">OpenStreetMap</a>.</li>
              <li>Identify the precise geographic coordinates of the facility.</li>
              <li>Submit a note with the following template:
                <div className="mt-2 rounded-[4px] bg-[#F8F5F0] p-2 text-[12px] font-mono text-[#6B6355] select-all">
                  Missing health facility: [facility name]. This facility serves the community but is not currently mapped. Location verified by community health workers.
                </div>
              </li>
              <li>Submit the record for verification.</li>
            </ol>
          </div>
        </section>

        <SourcesPanel />
      </div>
    </div>
  );
}
```

=== src/app/not-found.tsx ===

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold text-neutral-200">404</div>
      <h1 className="mt-4 text-xl font-semibold font-serif text-neutral-900">Resource not found</h1>
      <p className="mt-2 text-sm text-neutral-500">
        The requested document does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
      >
        Return to map
      </Link>
    </div>
  );
}
```

=== src/app/error.tsx ===

```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Error caught by boundary:", error);
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="text-6xl font-bold text-neutral-200">Error</div>
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">An unexpected error occurred</h1>
      <p className="mt-2 text-sm text-neutral-500">
        {error?.message ?? "An unexpected error occurred while loading the page."}
      </p>
      {error?.stack && (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-neutral-100 p-4 text-left text-xs text-neutral-600">
          {error.stack}
        </pre>
      )}
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
      >
        Attempt reconnection
      </button>
    </div>
  );
}
```

=== src/app/global-error.tsx ===

```tsx
"use client";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-[100svh] bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="text-6xl font-bold text-neutral-200">Error</div>
          <h1 className="mt-4 text-xl font-semibold text-neutral-900">An unexpected error occurred</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Attempt reconnection
          </button>
        </div>
      </body>
    </html>
  );
}
```

=== src/components/CompareView.tsx ===

```tsx
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
  // ... component logic
  return (
    <div className="space-y-8">
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

      <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8 shadow-sm print:border-black print:bg-transparent print:p-4">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#524B3F]">
          National Disparity Index (0-100)
        </h2>
        {/* gradient spectrum bar */}
      </section>

      <section className="grid gap-8 md:grid-cols-2 print:gap-4">
        {([countyA, countyB] as const).map((county, idx) => (
          <div key={county.id} className="...">
            <div className="...">
              <h3 className="text-[14px] font-bold font-serif text-[#292524] print:text-[12px]">{county.name}</h3>
            </div>
            {/* table rows with population, poverty, travel time, facilities, density, SBA */}
          </div>
        ))}
      </section>

      {/* Advocacy Takeaway */}
      {/* Print Footer */}
    </div>
  );
}
```

=== src/components/CountyDetails.tsx ===

```tsx
"use client";

import { useMemo, useState } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
// ... imports

export default function CountyDetails({ county, indicators }: CountyDetailsProps) {
  // ... logic
  return (
    <div className="...">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-stone-800">{county.name}</h2>
          <p className="text-sm text-stone-500">County, Kenya</p>
        </div>
        {score && (
          <div className={`rounded-lg px-3 py-1.5 text-right ${pgsClass}`}>
            <div className="text-xl font-bold tracking-tight">{score.pgs}</div>
            <div className="text-[10px] font-medium opacity-80">Priority Gap Score</div>
          </div>
        )}
      </div>

      {narrativeLines.length > 0 && (
        <div className="mt-4 rounded-lg bg-stone-50 p-4 text-sm leading-6 text-stone-700 border border-stone-100" role="note">
          <strong>Comparative regional analysis:</strong>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {narrativeLines.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      )}

      {/* Score distribution progress bars */}
      {/* Metrics grid (population, facilities) */}
      {/* Data source links */}
      {/* Applications section */}
      {/* Share and brief buttons */}
    </div>
  );
}
```

=== src/components/CountyRankings.tsx ===

```tsx
"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
// ... imports

export default function CountyRankings({ counties, indicators, onCountyClick }: CountyRankingsProps) {
  // ... ranking logic (top 5 / bottom 5)

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-800">Critical intervention priority</h3>
      <p className="mt-1 text-[10px] text-stone-400">Counties indicating the highest necessity for resource allocation</p>

      <div className="mt-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Maximum deficit</h4>
        <div className="mt-1 space-y-0.5">
          {top5.map((c, i) => (
            <RankedCounty key={c.id} rank={i + 1} name={c.name} score={c.score} color={scoreColor(c.score)} onClick={() => onCountyClick(c.id)} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Optimal access</h4>
        <div className="mt-1 space-y-0.5">
          {bottom5.map((c, i) => (
            <RankedCounty key={c.id} rank={rankings.length - 4 + i} name={c.name} score={c.score} color={scoreColor(c.score)} onClick={() => onCountyClick(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

=== src/components/Header.tsx ===

```tsx
"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight text-stone-800 no-underline">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-stone-500" aria-label="Main navigation">
          <Link href="/method" className="hover:text-stone-800 transition-colors">Methodology</Link>
          <Link href="/compare" className="hover:text-stone-800 transition-colors">Compare</Link>
          <Link href="/dua" className="hover:text-stone-800 transition-colors">Data</Link>
        </nav>
      </div>
    </header>
  );
}
```

=== src/components/HowToUse.tsx ===

```tsx
"use client";

import { useEffect, useState } from "react";

export default function HowToUse() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="rounded-xl border border-stone-200 bg-white transition-all duration-200 ease-in-out hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-stone-800"
        aria-expanded={open}
        aria-controls="how-to-use-content"
      >
        Instructions for use
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true">▾</span>
      </button>
      {open && (
        <div id="how-to-use-content" className="border-t border-stone-100 px-5 py-4 text-sm leading-6 text-stone-600">
          <ul className="list-disc space-y-2 pl-5">
            {isMobile ? (
              <>
                <li>Select a county from the geographic interface to view specific health indicators.</li>
                <li>Utilize the search function to locate administrative regions directly.</li>
              </>
            ) : (
              <>
                <li>Hover over a county to view its Priority Gap Score.</li>
                <li>Select a county to access its details panel with key indicators.</li>
              </>
            )}
            <li>Compare multiple regions to analyze structural disparities.</li>
            <li>Generate an analytical brief for formal documentation.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
```

=== src/components/InsightsDashboard.tsx ===

```tsx
"use client";

export default function InsightsDashboard({ countyCount, facilityCount, highPriorityCount, indicators }: InsightsDashboardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
      <div className="...">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Counties</div>
        <div className="mt-1 text-2xl font-bold text-stone-800">{countyCount}</div>
        <div className="text-xs text-stone-400">analyzed</div>
      </div>
      <div className="...">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Facilities</div>
        <div className="mt-1 text-2xl font-bold text-stone-800">{facilityCount}</div>
        <div className="text-xs text-stone-400">mapped</div>
      </div>
      <div className="...">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Population</div>
        <div className="mt-1 text-2xl font-bold text-stone-800">{totalPop.toLocaleString()}</div>
        <div className="text-xs text-stone-400">residents</div>
      </div>
      <div className="...">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">High priority</div>
        <div className="mt-1 text-2xl font-bold text-stone-800">{highPriorityCount}</div>
        <div className="text-xs text-stone-400">counties (Priority Gap Score >= 50)</div>
      </div>
    </div>
  );
}
```

=== src/components/MapView.tsx ===

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { getPGSColor } from "@/lib/scoring";

// Full MapView component - see actual file for complete code
export default function MapView({ boundaries, countyScores, countyNames, onCountyClick, selectedCountyCode }: MapViewProps) {
  // MapLibre GL JS map with CARTO tiles, county fills, hover tooltips, click handlers
  return (
    <div className="relative min-h-[400px] w-full overflow-hidden rounded-xl border border-stone-200 shadow-sm">
      <div ref={containerRef} className="h-[70svh] w-full min-h-[400px] max-h-[800px]" aria-label="Map of Kenya counties with health equity data" />
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-50 text-sm text-stone-500">
          Map rendering error encountered. Review the system console for details.
        </div>
      ) : !ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-50 text-sm text-stone-500">
          Loading geographic interface...
        </div>
      ) : null}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5">
        <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/116" target="_blank" rel="noreferrer" className="...">KNBS boundaries</a>
        <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="...">Facilities: ICPAC/KEMRI</a>
      </div>
    </div>
  );
}
```

=== src/components/SearchBar.tsx ===

```tsx
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";

export default function SearchBar({ counties, onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);

  const fuse = useMemo(() => new Fuse(counties, { keys: ["name", "code"], threshold: 0.4, minMatchCharLength: 1 }), [counties]);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query.trim()).slice(0, 10).map((r) => r.item);
  }, [query, fuse]);

  // Keyboard shortcut (Cmd/Ctrl+K), click-outside handling
  return (
    <>
      <button onClick={() => setOpen(true)} className="...">
        Search administrative counties...
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-stone-200 bg-white shadow-2xl">
            <input ref={inputRef} type="text" ... />
            {results.map(item => (
              <button key={item.id} onClick={() => handleSelect(item.code)} ...>
                <span>{item.name}</span>
                <span className="text-xs text-stone-400">{item.code}</span>
              </button>
            ))}
            {query.trim() && results.length === 0 && <div className="...">No corresponding counties found.</div>}
            {!query.trim() && <div className="...">Enter a county name to initiate search.</div>}
          </div>
        </div>
      )}
    </>
  );
}
```

=== src/components/ShareButton.tsx ===

```tsx
"use client";

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const canShare = typeof navigator !== "undefined" && "share" in navigator;
  const share = () => {
    if (canShare) { navigator.share({ title, text, url }).catch(() => {}); }
    else { navigator.clipboard.writeText(url).catch(() => {}); }
  };
  return (
    <button onClick={share} className="..." title={canShare ? "Distribute" : "Copy hyperlink"}>
      {canShare ? "Distribute" : "Copy hyperlink"}
    </button>
  );
}
```

=== src/components/SourcesPanel.tsx ===

```tsx
"use client";

import React from "react";

export default function SourcesPanel() {
  return (
    <details className="group rounded-[8px] border border-[#E0DBD0] bg-white text-[#292524] shadow-sm transition-all open:pb-4 print:border-black">
      <summary className="min-h-[44px] cursor-pointer list-none flex items-center justify-between p-4 font-bold text-[14px] uppercase tracking-widest text-[#524B3F] hover:bg-[#F8F5F0] ...">
        <span>Open Data Methodology & Integrity Sources</span>
      </summary>
      <div className="px-4 pt-4 border-t border-[#E0DBD0] text-[14px] leading-7 text-[#6B6355]">
        <p className="mb-4">All scoring indicators rely strictly on publicly available baselines.</p>
        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li><strong>Population:</strong> Kenya National Bureau of Statistics (KNBS) 2019 Census data.</li>
          <li><strong>Poverty Rate:</strong> Kenya Integrated Household Budget Survey (KIHBS) 2015/16 baseline indicators.</li>
          <li><strong>Facility Mapping:</strong> OpenStreetMap / IGAD Climate Prediction and Applications Centre (ICPAC) master lists.</li>
          <li><strong>Travel Modeling:</strong> WHO AccessMod methodologies calculating friction surfaces.</li>
        </ul>
        <p className="text-[12px] leading-5 text-[#8A8170]">
          Last Updated: <strong>October 2024</strong>. If a community dispensary is absent from this platform, community members can augment the baseline by reporting its coordinates to OpenStreetMap...
        </p>
      </div>
    </details>
  );
}
```

=== src/components/WeightsControl.tsx ===

```tsx
"use client";

import { DEFAULT_WEIGHTS, type PGSWeights } from "@/lib/scoring";

export default function WeightsControl({ weights, onChange }: WeightsControlProps) {
  const labels: Record<keyof PGSWeights, string> = {
    accessibility: "Accessibility weight",
    populationPressure: "Population pressure weight",
    vulnerability: "Vulnerability weight",
  };

  function handleChange(key: keyof PGSWeights, value: number) {
    const next = { ...weights, [key]: value };
    const sum = next.accessibility + next.populationPressure + next.vulnerability;
    if (sum > 0) {
      next.accessibility /= sum;
      next.populationPressure /= sum;
      next.vulnerability /= sum;
    }
    onChange(next);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Metric Weight Configuration</h3>
      <p className="mt-1 text-xs text-neutral-400">Adjust the relative importance of specific indicators to calculate the Priority Gap Score.</p>
      <div className="mt-4 space-y-4">
        {(Object.keys(DEFAULT_WEIGHTS) as (keyof PGSWeights)[]).map((key) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`weight-${key}`} className="text-neutral-700">{labels[key]}</label>
              <span className="font-mono text-xs text-neutral-500">{(weights[key] * 100).toFixed(0)}%</span>
            </div>
            <input id={`weight-${key}`} type="range" min={0} max={100} value={Math.round(weights[key] * 100)} onChange={(e) => handleChange(key, Number(e.target.value) / 100)} className="mt-1 w-full accent-accent-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
```
