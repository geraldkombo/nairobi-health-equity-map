"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { normalizeCounty } from "@/lib/normalize";
import Link from "next/link";

interface CountyDetailsProps {
  county: CountyRecord;
  indicators: IndicatorRecord[];
}

function ProgressBar({ label, value, max, invert }: { label: string; value: number; max: number; invert?: boolean }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const displayPct = invert ? 100 - pct : pct;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-600">{label}</span>
        <span className="font-medium text-stone-700">{invert ? 100 - pct : pct}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-stone-600 transition-all duration-300"
          style={{ width: `${displayPct}%` }}
        />
      </div>
    </div>
  );
}

export default function CountyDetails({ county, indicators }: CountyDetailsProps) {
  const indicator = indicators.find((i) => i.county_code === county.id);

  const score = useMemo(() => {
    if (!indicator) return null;
    const norm = normalizeCounty(indicator);
    return computePGS(county.id, norm, DEFAULT_WEIGHTS);
  }, [indicator, county.id]);

  const narrative = score
    ? score.drivers.length > 0
      ? score.drivers.length === 1
        ? `This county's priority score is driven by ${score.drivers[0].toLowerCase().replace(/^is /, "")}.`
        : `This county's priority score is driven by multiple factors: ${score.drivers.map((d) => d.toLowerCase().replace(/^is /, "")).join("; ")}.`
      : "All indicator proxies are within typical national range."
    : null;

  const nationalAvg = useMemo(() => {
    if (indicators.length === 0) return null;
    return {
      population: indicators.reduce((s, i) => s + i.population, 0) / indicators.length,
      poverty: indicators.reduce((s, i) => s + i.poverty_proxy, 0) / indicators.length,
      facilities: indicators.reduce((s, i) => s + i.facility_count, 0) / indicators.length,
    };
  }, [indicators]);

  const pgsClass = score
    ? score.pgs >= 0.7 ? "text-stone-50 bg-[#78350F]"
      : score.pgs >= 0.5 ? "text-white bg-[#EA580C]"
      : score.pgs >= 0.3 ? "text-stone-800 bg-[#F59E0B]"
      : "text-stone-800 bg-[#FDE68A]"
    : "";

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 transition-all duration-200 ease-in-out hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-800">{county.name}</h2>
          <p className="text-sm text-stone-500">
            County &middot; Kenya
          </p>
        </div>
        {score && (
          <div className={`rounded-lg px-3 py-1.5 text-right ${pgsClass}`}>
            <div className="text-xl font-bold tracking-tight">{(score.pgs * 100).toFixed(0)}</div>
            <div className="text-[10px] font-medium opacity-80">PGS</div>
          </div>
        )}
      </div>

      {narrative && (
        <div className="mt-4 rounded-lg bg-stone-50 p-4 text-sm leading-6 text-stone-700 border border-stone-100" role="note">
          <strong>What this means:</strong> {narrative}
        </div>
      )}

      {indicator && nationalAvg && (
        <div className="mt-5 space-y-3 border-t border-stone-100 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Component breakdown</h4>
          <ProgressBar label="Travel time proxy" value={indicator.travel_time_to_facility_proxy} max={100} />
          <ProgressBar label="Poverty proxy" value={indicator.poverty_proxy} max={100} />
          <ProgressBar label="Population pressure" value={indicator.population} max={5_000_000} />
          <ProgressBar
            label="Facility density"
            value={indicator.facility_density_proxy}
            max={1}
            invert
          />
        </div>
      )}

      {indicator && nationalAvg && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-stone-100 pt-4">
          <div>
            <div className="text-[11px] font-semibold text-stone-500">Population</div>
            <div className="mt-0.5 text-sm font-medium text-stone-800">{indicator.population.toLocaleString()}</div>
            <div className="text-[10px] text-stone-400">Nat&apos;l avg: {Math.round(nationalAvg.population).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500">Facilities</div>
            <div className="mt-0.5 text-sm font-medium text-stone-800">{indicator.facility_count}</div>
            <div className="text-[10px] text-stone-400">Nat&apos;l avg: {nationalAvg.facilities.toFixed(1)}</div>
          </div>
        </div>
      )}

      {indicator && (
        <div className="mt-4 border-t border-stone-100 pt-3">
          <p className="text-[10px] leading-4 text-stone-400">
            Population:{" "}
            <a href="https://www.knbs.or.ke/census-2019/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>
            {" · "}Poverty:{" "}
            <a href="https://www.knbs.or.ke/kihbs-2015-16/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>
            {" · "}Facilities:{" "}
            <a href="https://geoportal.icpac.net/layers/geonode:kenya_health_facilities" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI</a>
            {" · "}Modelling:{" "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod</a>
          </p>
        </div>
      )}
      {indicator && (
        <div className="mt-3 flex gap-2">
          <Link
            href={`/brief?county=${county.id}`}
            className="rounded-lg bg-stone-800 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-700 transition-colors"
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
            className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
}
