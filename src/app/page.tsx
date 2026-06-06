"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useCallback } from "react";
import CountyDetails from "@/components/CountyDetails";
import HowToUse from "@/components/HowToUse";
import SourcesPanel from "@/components/SourcesPanel";
import InsightsDashboard from "@/components/InsightsDashboard";
import CountyRankings from "@/components/CountyRankings";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { fetchCounties, fetchIndicators } from "@/lib/data-fetch";
import MapErrorBoundary from "@/components/MapErrorBoundary";

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
          fetch("/data/boundaries/counties_simplified.geojson").then(async (r) => {
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
      const ind = indicators.find((i) => i.county_code === county.id);
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
    setSelectedCountyCode(countyCode);
  }, []);

  const totalFacilities = indicators.reduce((sum, i) => sum + i.facility_count, 0);
  const highPriorityCounties = counties ? counties.filter(c => (countyScores[c.id] ?? 0) >= 50).length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
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

      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-stone-800">Kenya Health Equity Map</h1>
        <p className="mt-1 text-sm text-stone-500">
          Explore health access inequities across Kenya&apos;s 47 counties. Hover the map to see scores, click a county for details.
        </p>
      </div>

      <div className="mb-6">
        <HowToUse />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-[#FDE68A]"></span> Low (&lt;30)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-[#F59E0B]"></span> Medium (30 to 49)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-[#EA580C]"></span> High (50 to 69)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-[#78350F]"></span> Critical (70+)
            </span>
            <span className="ml-auto text-stone-400">Priority Gap Score (PGS)</span>
          </div>
        </div>

        <div className="space-y-4">
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

      <div className="mt-8 border-t border-stone-200 pt-6">
        <div className="flex flex-wrap gap-3">
          <a
            href="/brief?county=1"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            View sample brief
          </a>
          <a
            href="/method"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            View methodology
          </a>
          <a
            href="/compare"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Compare counties
          </a>
        </div>
      </div>
      <div className="mt-6 border-t border-stone-100 pt-4 pb-2">
        <p className="text-[10px] leading-5 text-stone-400">
          <strong>Data sources:</strong>{" "}
          <a href="https://www.knbs.or.ke/census-2019/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>
          {" · "}
          <a href="https://www.knbs.or.ke/kihbs-2015-16/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>
          {" · "}
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health_facilities" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI Health Facilities</a>
          {" · "}
          <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod travel model</a>
          {" · "}
          <a href="https://kemri-wellcome.org/programmes/geographic-access/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KEMRI/Wellcome Trust</a>
          {" · "}
          <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">OSM Kenya road network</a>
          {" · "}
          <a href="https://worldcover.esa.int/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ESA WorldCover land cover</a>
          {" · "}
          <a href="https://www.knbs.or.ke/gis-boundary-files/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS GIS boundaries</a>
          <span className="ml-1">| CC-BY-4.0 open data</span>
        </p>
      </div>
    </div>
  );
}
