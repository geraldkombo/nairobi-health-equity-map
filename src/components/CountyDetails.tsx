"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord, FacilitiesGeoJSON } from "@/lib/adapters";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { normalizeCounty } from "@/lib/normalize";
import Link from "next/link";

interface CountyDetailsProps {
  county: CountyRecord;
  indicators: IndicatorRecord[];
  facilities: FacilitiesGeoJSON | null;
}

export default function CountyDetails({ county, indicators, facilities }: CountyDetailsProps) {
  const indicator = indicators.find((i) => i.county_code === county.id);

  const score = useMemo(() => {
    if (!indicator) return null;
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
    return computePGS(county.id, norm, DEFAULT_WEIGHTS);
  }, [indicator, indicators, county.id]);

  const narrative = score
    ? score.drivers.length > 0
      ? `This county's assessed priority score is driven by ${score.drivers[0].toLowerCase()}.`
      : "All indicator proxies are within typical national range."
    : null;

  const facilityCountInCounty = useMemo(() => {
    if (!facilities) return "N/A";
    return facilities.features.filter((f) => true).length;
  }, [facilities]);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{county.name}</h2>
          <p className="text-sm text-neutral-500">
            County &middot; Kenya
          </p>
        </div>
        {score && (
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight text-neutral-900">{(score.pgs * 100).toFixed(0)}</div>
            <div className="text-xs text-neutral-400">Priority Gap Score</div>
          </div>
        )}
      </div>

      {narrative && (
        <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 border border-neutral-100" role="note">
          <strong>What this means:</strong> {narrative}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        {indicator && (
          <div>
            <div className="text-xs font-semibold text-neutral-500">Population</div>
            <div className="mt-1 text-sm font-medium text-neutral-800">{indicator.population.toLocaleString()}</div>
          </div>
        )}
        {indicator && (
          <div>
            <div className="text-xs font-semibold text-neutral-500">Facilities</div>
            <div className="mt-1 text-sm font-medium text-neutral-800">{indicator.facility_count}</div>
          </div>
        )}
      </div>

      {indicator && (
        <div className="mt-4 flex gap-2">
          <Link
            href={`/brief?county=${county.id}`}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Generate brief
          </Link>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify({ county, score, indicator }, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${county.id}-data.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
}
