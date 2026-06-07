"use client";

import { useMemo, useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS, getPGSColor } from "@/lib/scoring";
import type { IndicatorRecord, CountyRecord } from "@/lib/adapters";
import { fetchCounties, fetchIndicators } from "@/lib/data-fetch";
import { matchCountyName } from "@/lib/county-names";

function DriverBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.round(value * 100));
  return (
    <div className="break-inside-avoid">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="text-stone-500">{pct}%</span>
      </div>
      <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-stone-100 print:bg-stone-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function PrintableBrief({
  county,
  indicator,
  nationalAvg,
}: {
  county: CountyRecord;
  indicator: IndicatorRecord;
  nationalAvg: { population: number; poverty: number; facilities: number; travelTime: number; populationPressure: number };
}) {
  const norm = normalizeCounty(indicator);
  const score = computePGS(county.id, norm, DEFAULT_WEIGHTS);

  const accessibility = norm.travelTime * 0.6 + norm.facilityDensity * 0.4;

  const narrative = useMemo(() => {
    const parts: string[] = [];
    const pct = Math.round(score.pgs);
    const natPct = Math.round(
      ((nationalAvg.travelTime / 100) * 0.6 + (1 - nationalAvg.facilities / 100) * 0.4) * 0.4 +
        (nationalAvg.poverty / 100) * 0.3 +
        nationalAvg.populationPressure * 0.3
    );

    if (pct > natPct + 10) {
      parts.push(`${county.name} registers a Priority Gap Score of ${pct}/100, notably above the national average of ${natPct}/100.`);
    } else if (pct < natPct - 10) {
      parts.push(`${county.name} registers a Priority Gap Score of ${pct}/100, below the national average of ${natPct}/100, meaning less pressure on health infrastructure.`);
    } else {
      parts.push(`${county.name} registers a Priority Gap Score of ${pct}/100, broadly in line with the national average of ${natPct}/100.`);
    }

    if (norm.travelTime > 0.6) {
      parts.push(`Travel time to the nearest health facility is elevated at ${indicator.travel_time_to_facility_proxy} minutes, suggesting geographic access constraints in peripheral wards.`);
    }
    if (norm.poverty > 0.6) {
      parts.push(`The poverty rate is ${indicator.poverty_proxy}%, above the national county average of ${nationalAvg.poverty.toFixed(1)}%.`);
    }
    if (indicator.facility_count < nationalAvg.facilities) {
      parts.push(`With ${indicator.facility_count} mapped facilities against a national county average of ${nationalAvg.facilities.toFixed(1)}, facility density remains a limiting factor.`);
    }
    if (indicator.population > nationalAvg.population) {
      parts.push(`Population (${indicator.population.toLocaleString()}) is above the national county average, intensifying demand on existing health infrastructure.`);
    }

    if (parts.length === 1) {
      parts.push("All measures are within the typical national range.");
    }

    return parts.join(" ");
  }, [county, indicator, score, norm, nationalAvg]);

  const hasAccessibility = accessibility > 0;
  const hasVulnerability = norm.poverty > 0;
  const hasPopPressure = norm.populationPressure > 0;

  return (
    <div className="space-y-6">
      {/* ── Print Header ── */}
      <div className="break-inside-avoid border-b-2 border-stone-800 pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Kenya Health Equity Map</div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">{county.name}</h1>
            <p className="mt-1 text-sm text-stone-500">County, Kenya</p>
          </div>
          <div className="flex flex-col items-center rounded-lg px-4 py-2" style={{ backgroundColor: getPGSColor(score.pgs) }}>
            <span className="text-2xl font-bold tracking-tight" style={{ color: score.pgs >= 50 ? "white" : "#292524" }}>
              {score.pgs}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: score.pgs >= 50 ? "rgba(255,255,255,0.8)" : "#57534E" }}>
              PGS / 100
            </span>
          </div>
        </div>
      </div>

      {/* ── Baseline Narrative ── */}
      <div className="break-inside-avoid rounded-lg border border-stone-200 bg-stone-50 p-5 print:border-black print:bg-transparent">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500">Baseline Narrative</h2>
        <p className="mt-3 text-sm leading-7 text-stone-800">{narrative}</p>
        <p className="mt-2 text-[10px] leading-5 text-stone-400">
          <strong>Data sources:</strong> County populations from{" "}
          <a href="https://www.knbs.or.ke/census/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Kenya Census</a>.
          Poverty rates from{" "}
          <a href="https://www.knbs.or.ke/kihbs/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16 county estimates</a>.
          Health facility locations from{" "}
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI Kenya Health Facilities</a>
          {" "}(CC-BY-4.0). Travel time estimates derived from cost and distance modelling
          (<a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod</a>)
          using{" "}
          <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">OSM road networks</a>
          {" "}and{" "}
          <a href="https://esa-worldcover.org/en" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ESA WorldCover land cover</a>.
        </p>
      </div>

      {/* ── Driver Decomposition ── */}
      <div className="driver-section break-inside-avoid rounded-lg border border-stone-200 p-5 print:border-black">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500">Driver Decomposition</h2>
        <p className="mt-1 text-[11px] text-stone-400">How each part adds to the final Priority Gap Score</p>
        <div className="mt-4 space-y-4">
          <DriverBar label="Accessibility (travel time + facility density)" value={hasAccessibility ? accessibility : 0} color="#8C2D04" />
          <DriverBar label="Vulnerability (poverty rate)" value={hasVulnerability ? norm.poverty : 0} color="#D95F0E" />
          <DriverBar label="Population pressure" value={hasPopPressure ? norm.populationPressure : 0} color="#FEC44F" />
        </div>
      </div>

      {/* ── Key Indicators ── */}
      <div className="break-inside-avoid rounded-lg border border-stone-200 p-5 print:border-black">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500">Key Indicators</h2>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">Population</span>
            <span className="font-semibold text-stone-900">{indicator.population.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">National avg.</span>
            <span className="font-semibold text-stone-900">{Math.round(nationalAvg.population).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">Poverty rate</span>
            <span className="font-semibold text-stone-900">{indicator.poverty_proxy}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">National avg.</span>
            <span className="font-semibold text-stone-900">{nationalAvg.poverty.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">Facilities mapped</span>
            <span className="font-semibold text-stone-900">{indicator.facility_count}</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">National avg.</span>
            <span className="font-semibold text-stone-900">{nationalAvg.facilities.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">Travel time</span>
            <span className="font-semibold text-stone-900">{indicator.travel_time_to_facility_proxy} min</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:border-stone-300">
            <span className="text-stone-500">National avg.</span>
            <span className="font-semibold text-stone-900">{nationalAvg.travelTime.toFixed(1)} min</span>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-5 text-stone-400">
          Travel time and facility density modelled via cost and distance proximity analysis
          (<a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod</a>;
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI facilities</a>).
          Poverty data from{" "}
          <a href="https://www.knbs.or.ke/kihbs/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16 county poverty estimates</a>.
          Population from{" "}
          <a href="https://www.knbs.or.ke/census/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>.
        </p>
      </div>

      {/* ── CLM Action ── */}
      <div className="break-inside-avoid rounded-lg border border-amber-200 bg-amber-50 p-5 print:border-black print:bg-transparent">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-900">How communities can use this brief</h2>
        <ul className="mt-3 list-none space-y-2 text-sm leading-6 text-amber-800">
          <li className="flex gap-2"><span className="text-amber-600 font-bold">✓</span> <strong>Quarterly meetings:</strong> Present to CHMTs to demand targeted resources.</li>
          <li className="flex gap-2"><span className="text-amber-600 font-bold">✓</span> <strong>Budget hearings:</strong> Submit to the county health department as formal evidence.</li>
          <li className="flex gap-2"><span className="text-amber-600 font-bold">✓</span> <strong>Accountability:</strong> Use as a baseline to track whether access improves year over year.</li>
          <li className="flex gap-2"><span className="text-amber-600 font-bold">✓</span> <strong>Mobilization:</strong> Share with peer networks to coordinate advocacy across sub-counties.</li>
        </ul>
      </div>

      {/* ── Limitations ── */}
      <div className="break-inside-avoid rounded-lg border border-stone-200 p-5 print:border-black">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500">Limitations</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          This brief is a transparent, open data snapshot. It indicates potential access constraints using verifiable proxies: travel time estimates, facility density, and indicator based gap scoring. It does not measure quality of care, clinical capacity, or health outcomes. Facility data from ICPAC/KEMRI may be incomplete for some counties. Population figures reflect the 2019 KNBS Census; intercensal growth is not modelled at ward level.
        </p>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          <strong>Travel time methodology:</strong> Average travel time is derived from cost and distance spatial
          modelling algorithms
          (<a href="https://kemri-wellcome.org/press-release-launch-of-comprehensive-public-health-facility-inventory-for-sub-saharan-africa/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">KEMRI-Wellcome Trust</a>
          {" / "}
          <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">AccessMod</a>).
It does not rely on straight line Euclidean distance. Instead, it calculates the lowest cost
path by simulating a combined transport model, factoring in walking speeds across varied
land cover (<a href="https://esa-worldcover.org/en" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">ESA WorldCover</a>)
and topography, combined with motorized and manual transport travel along primary, secondary, and rural
road networks (<a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">OSM Kenya</a>).
        </p>
        <p className="mt-2 text-[10px] leading-5 text-stone-400">
          Suggested citation: Kenya Health Equity Map, <a href="https://geraldkombo.github.io/kenya-health-equity-map/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">geraldkombo.github.io/kenya-health-equity-map</a>.
          {county.name} County Brief. Sources:{" "}
          <a href="https://www.knbs.or.ke/census/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>;
          <a href="https://www.knbs.or.ke/kihbs/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>;
          <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI Health Facilities</a>.
        </p>
      </div>
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

  const nationalAvg = useMemo(() => {
    if (indicators.length === 0) return null;
    return {
      population: indicators.reduce((s, i) => s + i.population, 0) / indicators.length,
      poverty: indicators.reduce((s, i) => s + i.poverty_proxy, 0) / indicators.length,
      facilities: indicators.reduce((s, i) => s + i.facility_count, 0) / indicators.length,
      travelTime: indicators.reduce((s, i) => s + i.travel_time_to_facility_proxy, 0) / indicators.length,
      populationPressure: indicators.reduce((s, i) => {
        const popPerFac = i.population / Math.max(i.facility_count, 1);
        return s + Math.min(popPerFac / 10000, 1);
      }, 0) / indicators.length,
    };
  }, [indicators]);

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
        {/* ── Screen controls ── */}
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
              className="rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Download PDF
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-stone-500 underline underline-offset-2 hover:text-stone-800 transition-colors"
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
        ) : !selected || !indicator || !nationalAvg ? (
          <div className="mt-8 rounded-xl border border-stone-200 p-6 text-sm text-stone-500 print:hidden">
            Loading county data&hellip;
          </div>
        ) : (
          <div ref={printRef}>
            <PrintableBrief
              county={selected}
              indicator={indicator}
              nationalAvg={nationalAvg}
            />
          </div>
        )}

        {/* ── Print footer (screen only) ── */}
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
