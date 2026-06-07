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
  const [offlineBanner, setOfflineBanner] = useState(false);

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
    if ('serviceWorker' in navigator) setOfflineBanner(true);
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
        <h1 className="text-lg font-bold tracking-tight text-stone-800 sm:text-xl">Kenya Health Equity Map</h1>
        <p className="mt-0.5 text-xs font-medium text-stone-700 sm:text-sm">
          See which counties are most underserved - and get the evidence to demand change.
        </p>
        <p className="mt-0.5 text-[11px] italic text-stone-500 sm:text-xs">
          Community-led monitoring starts with data communities can trust and use.
        </p>
      </div>

      {offlineBanner && (
        <div className="mb-3 rounded-lg border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm sm:mb-4 sm:text-sm">
          <strong>Works offline:</strong> Save this page to your phone&apos;s home screen to use the map without internet.
        </div>
      )}

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
              Loading map data...
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 sm:mt-4 sm:text-xs">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#FFF7BC] sm:h-3 sm:w-3"></span> Low (&lt;30)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#FEC44F] sm:h-3 sm:w-3"></span> Med (30&ndash;49)
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
            View sample brief
          </Link>
          <Link
            href="/method"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            View methodology
          </Link>
          <Link
            href="/compare"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Compare counties
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
