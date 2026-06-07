"use client";

import { useMemo, useState } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { computePGS, DEFAULT_WEIGHTS, getPGSBadgeClass } from "@/lib/scoring";
import { normalizeCounty } from "@/lib/normalize";
import { matchCountyName } from "@/lib/county-names";
import Link from "next/link";
import ShareButton from "./ShareButton";

interface CountyDetailsProps {
  county: CountyRecord;
  indicators: IndicatorRecord[];
}

function InfoIcon({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-stone-300 text-[9px] font-bold text-white hover:bg-stone-500 focus:outline-none"
        aria-label={text}
        title={text}
      >
        ?
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-10 mb-1 w-56 -translate-x-1/2 rounded-md bg-stone-800 px-3 py-2 text-[10px] leading-4 text-white shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

function ProgressBar({ label, value, max, invert, info }: { label: string; value: number; max: number; invert?: boolean; info?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const displayPct = invert ? 100 - pct : pct;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-600">{label}{info && <InfoIcon text={info} />}</span>
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
  const indicator = indicators.find((i) => matchCountyName(i.county_name, county.name));

  const score = useMemo(() => {
    if (!indicator) return null;
    const norm = normalizeCounty(indicator);
    return computePGS(county.id, norm, DEFAULT_WEIGHTS);
  }, [indicator, county.id]);

  const nationalAvg = useMemo(() => {
    if (indicators.length === 0) return null;
    return {
      population: indicators.reduce((s, i) => s + i.population, 0) / indicators.length,
      poverty: indicators.reduce((s, i) => s + i.poverty_proxy, 0) / indicators.length,
      facilities: indicators.reduce((s, i) => s + i.facility_count, 0) / indicators.length,
    };
  }, [indicators]);

  const comparisons = useMemo(() => {
    if (!indicator || indicators.length === 0) return null;
    const sorted = (field: keyof IndicatorRecord) =>
      [...indicators].sort((a, b) => (a[field] as number) - (b[field] as number));
    const pctRank = (field: keyof IndicatorRecord) => {
      const arr = sorted(field);
      const idx = arr.findIndex((i) => matchCountyName(i.county_name, county.name));
      return idx >= 0 ? Math.round((idx / arr.length) * 100) : null;
    };
    return {
      travelTime: pctRank("travel_time_to_facility_proxy"),
      poverty: pctRank("poverty_proxy"),
      population: pctRank("population"),
      facilityDensity: pctRank("facility_density_proxy"),
    };
  }, [indicator, indicators, county]);

  const narrativeLines = useMemo(() => {
    if (!comparisons || !indicator || !nationalAvg) return [];
    const lines: string[] = [];
    if (comparisons.travelTime !== null && comparisons.travelTime >= 70) {
      lines.push(`Travel time is longer than ${comparisons.travelTime}% of counties - people take too long to reach a clinic.`);
    }
    if (comparisons.poverty !== null && comparisons.poverty >= 70) {
      lines.push(`Poverty is higher than ${comparisons.poverty}% of counties - many families struggle to afford care.`);
    }
    if (comparisons.population !== null) {
      if (comparisons.population >= 80) {
        lines.push(`Population is bigger than ${comparisons.population}% of counties - more people competing for the same health services.`);
      } else if (comparisons.population <= 20) {
        lines.push(`Population is smaller than ${100 - comparisons.population}% of counties - less pressure on health services.`);
      }
    }
    if (comparisons.facilityDensity !== null && comparisons.facilityDensity <= 20) {
      lines.push(`Fewer clinics per person than ${100 - comparisons.facilityDensity}% of counties - not enough facilities to go around.`);
    }
    if (lines.length === 0) {
      lines.push("All measures are within the normal range compared to other counties.");
    }
    return lines;
  }, [comparisons, indicator, nationalAvg]);

  const pgsClass = score ? getPGSBadgeClass(score.pgs) : "";

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
            <div className="text-xl font-bold tracking-tight">{score.pgs}</div>
            <div className="text-[10px] font-medium opacity-80">Gap Score</div>
          </div>
        )}
      </div>

      {narrativeLines.length > 0 && (
        <div className="mt-4 rounded-lg bg-stone-50 p-4 text-sm leading-6 text-stone-700 border border-stone-100" role="note">
          <strong>How this county compares:</strong>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {narrativeLines.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      )}

      {indicator && nationalAvg && (
        <div className="mt-5 space-y-3 border-t border-stone-100 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Score breakdown</h4>
          <ProgressBar label="Travel time" value={indicator.travel_time_to_facility_proxy} max={100} />
          <ProgressBar label="Poverty rate" value={indicator.poverty_proxy} max={100} />
          <ProgressBar label="People per facility" value={indicator.population / Math.max(indicator.facility_count, 1)} max={10000} />
          <ProgressBar
            label="Facilities per 10K people"
            value={(Math.max(indicator.facility_count, 1) / indicator.population) * 10000}
            max={4}
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
            <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/116" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>
            {" · "}Poverty:{" "}
            <a href="https://statistics.knbs.or.ke/nada/index.php/catalog/13" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>
            {" · "}Facilities:{" "}
            <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI</a>
            {" · "}Modelling:{" "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod</a>
          </p>
        </div>
      )}
      {score && (
        <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <h4 className="text-xs font-semibold text-amber-900">What you can do with this data:</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[11px] text-amber-800">
            <li>Use this score to show your CHMT that {county.name} needs more health resources.</li>
            <li>Print the county brief and submit it as evidence during CHMT planning meetings and public participation forums.</li>
            <li>Compare {county.name} with a neighboring county to highlight inequity.</li>
          </ul>
        </div>
      )}

      {indicator && (
        <div className="mt-3 flex gap-2">
          <ShareButton
            title={`${county.name} County - Kenya Health Equity Map`}
            text={`${county.name} scores ${score?.pgs ?? "?"} on the Priority Gap Score (0-100). View the full county brief.`}
            url={`https://geraldkombo.github.io/kenya-health-equity-map/brief?county=${county.id}`}
          />
          <Link
            href={`/brief?county=${county.id}`}
            className="rounded-lg bg-stone-800 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-700 transition-colors"
          >
            Generate brief
          </Link>
        </div>
      )}
    </div>
  );
}
