"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { haversineKm } from "@/lib/geo";
import { normalizeWard } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import type { WardRecord, IndicatorRecord, FacilitiesGeoJSON } from "@/lib/adapters";
import { fetchWards, fetchFacilities, fetchIndicators } from "@/lib/data-fetch";

function BriefContent() {
  const params = useSearchParams();
  const wardId = params.get("ward");

  const [wards, setWards] = useState<WardRecord[] | null>(null);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilitiesGeoJSON | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [wardsRes, facilitiesRes, indicators] = await Promise.all([
          fetchWards(),
          fetchFacilities(),
          fetchIndicators(),
        ]);
        setWards(wardsRes.wards);
        setFacilities(facilitiesRes.geojson);
        setIndicators(indicators);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load data.");
      }
    }
    load();
  }, []);

  const selected = useMemo(() => {
    if (!wards || !wardId) return null;
    return wards.find((w) => w.id === wardId) ?? null;
  }, [wards, wardId]);

  const indicator = useMemo(() => {
    if (!selected) return null;
    return indicators.find((i) => i.ward_code === selected.id) ?? null;
  }, [selected, indicators]);

  const score = useMemo(() => {
    if (!selected || indicator === null || indicators.length === 0) return null;
    const allTravel = indicators.map((i) => i.travel_time_to_facility_proxy);
    const allPoverty = indicators.map((i) => i.poverty_proxy);
    const allPop = indicators.map((i) => i.population);
    const allDensity = indicators.map((i) => i.facility_density_proxy);
    const norm = normalizeWard(indicator, {
      travelTimeRange: [Math.min(...allTravel), Math.max(...allTravel)],
      povertyRange: [Math.min(...allPoverty), Math.max(...allPoverty)],
      populationRange: [Math.min(...allPop), Math.max(...allPop)],
      facilityDensityRange: [Math.min(...allDensity), Math.max(...allDensity)],
    });
    return computePGS(selected.id, norm, DEFAULT_WEIGHTS);
  }, [selected, indicator, indicators]);

  const nearest = useMemo(() => {
    if (!selected || !facilities) return null;
    let min = Infinity;
    let name: string | null = null;
    let amenity: string | null = null;
    for (const f of facilities.features) {
      const [lon, lat] = f.geometry.coordinates;
      const d = haversineKm(selected.lat, selected.lon, lat, lon);
      if (d < min) {
        min = d;
        name = f.properties.name;
        amenity = f.properties.amenity ?? null;
      }
    }
    return { distanceKm: min, name, amenity };
  }, [selected, facilities]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-[100svh] bg-white text-neutral-950">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-start justify-between gap-6 no-print">
          <div>
            <div className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Nairobi Health Equity Map — One-page brief
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {selected ? selected.name : "Select a ward"}
            </h1>
            <div className="mt-1 text-sm text-neutral-500">
              {selected?.subcounty ? `${selected.subcounty}, Nairobi City County` : "Nairobi City County"} &middot; {today}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 no-print">
            <button
              className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
              onClick={() => window.print()}
            >
              Print / Save as PDF
            </button>
            <Link className="text-sm text-neutral-600 underline hover:text-neutral-900" href="/">
              Back to map
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {!wardId ? (
          <div className="mt-8 rounded-xl border border-neutral-200 p-5 text-sm text-neutral-500">
            Open this page from the map by clicking <strong>Generate brief</strong> on a selected ward.
          </div>
        ) : !selected ? (
          <div className="mt-8 rounded-xl border border-neutral-200 p-5 text-sm text-neutral-500">
            Loading ward data…
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Priority Gap Score</div>
                <div className="mt-2 text-3xl font-bold">
                  {score ? `${(score.pgs * 100).toFixed(0)}` : "—"}
                </div>
                <div className="mt-1 text-xs text-neutral-400">0 (low priority) to 100 (high priority)</div>
              </div>
              <div className="rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nearest facility</div>
                <div className="mt-2 text-xl font-semibold">
                  {nearest && Number.isFinite(nearest.distanceKm) ? `${nearest.distanceKm.toFixed(2)} km` : "—"}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {nearest?.name ?? "Unnamed"} {nearest?.amenity ? `(${nearest.amenity})` : ""}
                </div>
              </div>
            </div>

            {indicator && (
              <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Key indicators</div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-400">Population proxy</span>
                    <p className="font-medium">{indicator.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Poverty proxy</span>
                    <p className="font-medium">{indicator.poverty_proxy}%</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Travel time proxy</span>
                    <p className="font-medium">{indicator.travel_time_to_facility_proxy} min</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Facility density proxy</span>
                    <p className="font-medium">{indicator.facility_density_proxy} /km²</p>
                  </div>
                </div>
              </div>
            )}

            {score && (
              <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">What drives this score</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                  {score.drivers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Limitations</div>
              <p className="mt-3 text-sm leading-6 text-neutral-700">
                This brief is a transparent, open-data snapshot. It indicates potential access constraints using verifiable
                proxies: distance from ward centroid to nearest mapped health facility, and indicator-based gap scoring.
                It does not measure quality of care, capacity, or clinical outcomes. Facility data is from OpenStreetMap
                and may be incomplete. Indicator data is synthetic for demonstration.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-200 p-5 print:border-black">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sources & licensing</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                <li>
                  Ward names + centroids:{" "}
                  <a className="underline" href="https://openadmindata.org/api/ke" target="_blank" rel="noreferrer">
                    Open Admin Data (Kenya)
                  </a>{" "}
                  &mdash; CC-BY-4.0
                </li>
                <li>
                  Facilities (points):{" "}
                  <a className="underline" href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">
                    OpenStreetMap
                  </a>{" "}
                  via Overpass API &mdash; ODbL
                </li>
                <li>
                  Indicators:{" "}
                  <span className="text-neutral-500">Demo/synthetic data — replace with real sources for production use.</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-neutral-400">
                Citation suggestion: &ldquo;Nairobi Health Equity Map, brief generated {today}, sources as listed above.&rdquo;
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
