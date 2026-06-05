"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import type { IndicatorRecord, FacilitiesGeoJSON, CountyRecord } from "@/lib/adapters";
import { fetchCounties, fetchFacilities, fetchIndicators } from "@/lib/data-fetch";

function BriefContent() {
  const params = useSearchParams();
  const countyCode = params.get("county");
  const printRef = useRef<HTMLDivElement>(null);
  const [autoPrinted, setAutoPrinted] = useState(false);

  const [counties, setCounties] = useState<CountyRecord[] | null>(null);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilitiesGeoJSON | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [countiesRes, facilitiesRes, indicators] = await Promise.all([
          fetchCounties(),
          fetchFacilities(),
          fetchIndicators(),
        ]);
        setCounties(countiesRes.counties);
        setFacilities(facilitiesRes.geojson);
        setIndicators(indicators);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load data.");
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!autoPrinted && countyCode && counties && indicators.length > 0) {
      setAutoPrinted(true);
    }
  }, [autoPrinted, countyCode, counties, indicators]);

  const selected = useMemo(() => {
    if (!counties || !countyCode) return null;
    return counties.find((c) => c.id === countyCode) ?? null;
  }, [counties, countyCode]);

  const indicator = useMemo(() => {
    if (!selected) return null;
    return indicators.find((i) => i.county_code === selected.id) ?? null;
  }, [selected, indicators]);

  const score = useMemo(() => {
    if (!selected || indicator === null || indicators.length === 0) return null;
    const allTravel = indicators.map((i) => i.travel_time_to_facility_proxy);
    const allPoverty = indicators.map((i) => i.poverty_proxy);
    const allPop = indicators.map((i) => i.population);
    const allDensity = indicators.map((i) => i.facility_density_proxy);
    const norm = normalizeCounty(indicator, {
      travelTimeRange: [Math.min(...allTravel), Math.max(...allTravel)],
      povertyRange: [Math.min(...allPoverty), Math.max(...allPoverty)],
      populationRange: [Math.min(...allPop), Math.max(...allPop)],
      facilityDensityRange: [Math.min(...allDensity), Math.max(...allDensity)],
    });
    return computePGS(selected.id, norm, DEFAULT_WEIGHTS);
  }, [selected, indicator, indicators]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-[100svh] bg-white text-neutral-950">
      <div ref={printRef} className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-start justify-between gap-6 no-print">
          <div>
            <div className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Kenya Health Equity Map - One-Page Brief
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {selected ? selected.name : "Select a county"}
            </h1>
            <div className="mt-1 text-sm text-neutral-500">
              County, Kenya &middot; {today}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 no-print">
            <button
              className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </button>
            <Link className="text-sm text-neutral-600 underline hover:text-neutral-900" href="/">
              &larr; Back to map
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {!countyCode ? (
          <div className="mt-8 rounded-xl border border-neutral-200 p-6 text-sm text-neutral-500">
            Open this page from the map by clicking <strong>Generate brief</strong> on a selected county.
          </div>
        ) : !selected ? (
          <div className="mt-8 rounded-xl border border-neutral-200 p-6 text-sm text-neutral-500">
            Loading county data&hellip;
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Priority Gap Score</div>
                <div className="mt-2 text-4xl font-bold tracking-tight">
                  {score ? `${(score.pgs * 100).toFixed(0)}` : "-"}
                  <span className="ml-1 text-lg font-normal text-neutral-400">/ 100</span>
                </div>
                <div className="mt-1 text-xs text-neutral-400">0 (low priority) to 100 (high priority)</div>

                {score && (
                  <div className="mt-3 flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => {
                      const threshold = [0, 20, 40, 60, 80][i];
                      const filled = score.pgs * 100 >= threshold;
                      return (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${filled ? "bg-neutral-900" : "bg-neutral-100"}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Facilities mapped</div>
                <div className="mt-2 text-xl font-semibold">
                  {indicator ? indicator.facility_count : "-"}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  health facilities identified
                </div>
              </div>
            </div>

            {indicator && (
              <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Key Indicators</div>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Population</span>
                    <span className="font-semibold text-neutral-900">{indicator.population.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Poverty proxy</span>
                    <span className="font-semibold text-neutral-900">{indicator.poverty_proxy}%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Travel time proxy</span>
                    <span className="font-semibold text-neutral-900">{indicator.travel_time_to_facility_proxy} min</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Facility density proxy</span>
                    <span className="font-semibold text-neutral-900">{indicator.facility_density_proxy} /km&sup2;</span>
                  </div>
                </div>
              </div>
            )}

            {score && (
              <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">What Drives This Score</div>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-700">
                  {score.drivers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                  {score.drivers.length === 0 && (
                    <li>All indicator proxies are within typical national range.</li>
                  )}
                </ul>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Limitations</div>
              <p className="mt-3 text-sm leading-6 text-neutral-700">
                This brief is a transparent, open-data snapshot. It indicates potential access constraints using verifiable
                proxies: travel time estimates, facility density, and indicator-based gap scoring.
                It does not measure quality of care, capacity, or clinical outcomes. Facility data is from the ICPAC/KEMRI
                dataset and may be incomplete for some counties.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sources &amp; Licensing</div>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-700">
                <li>
                  County boundaries:{" "}
                  <a className="underline" href="https://github.com/tigawanna/kenya_wards_geojson_data" target="_blank" rel="noreferrer">
                    IEBC via Kenya Wards GeoJSON
                  </a>{" "}
                  &mdash; CC-BY-4.0
                </li>
                <li>
                  Facilities (points):{" "}
                  <a className="underline" href="https://geoportal.icpac.net" target="_blank" rel="noreferrer">
                    ICPAC/KEMRI Kenya Health Facilities
                  </a>{" "}
                  &mdash; CC-BY-4.0
                </li>
                <li>
                  Populations:{" "}
                  <a className="underline" href="https://www.knbs.or.ke" target="_blank" rel="noreferrer">
                    KNBS 2019 Kenya Census
                  </a>
                </li>
                <li>
                  Poverty rates:{" "}
                  <span className="text-neutral-500">KIHBS 2015/16 county estimates</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-neutral-400">
                Suggested citation: &ldquo;Kenya Health Equity Map, brief generated {today}, sources as listed above.&rdquo;
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BriefPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-8 text-sm text-neutral-500">Loading brief...</div>}>
      <BriefContent />
    </Suspense>
  );
}
