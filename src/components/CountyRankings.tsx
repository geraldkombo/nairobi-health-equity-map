"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS, getPGSColor } from "@/lib/scoring";
import { matchCountyName } from "@/lib/county-names";

interface CountyRankingsProps {
  counties: CountyRecord[];
  indicators: IndicatorRecord[];
  onCountyClick: (code: string) => void;
}

function RankedCounty({
  rank,
  name,
  score,
  color,
  onClick,
}: {
  rank: number;
  name: string;
  score: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md border border-stone-200 bg-white px-2.5 py-2 text-left text-xs shadow-sm transition-colors hover:border-stone-400 hover:bg-stone-50 active:bg-stone-100"
    >
      <span className="w-5 text-center font-mono text-[10px] font-semibold text-stone-400">{rank}</span>
      <span className="flex-1 truncate font-medium text-stone-700">{name}</span>
      <span
        className="rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
        style={{ backgroundColor: color, color: score >= 50 ? "#fff" : "#292524" }}
      >
        {score}
      </span>
    </button>
  );
}

export default function CountyRankings({ counties, indicators, onCountyClick }: CountyRankingsProps) {
  const rankings = useMemo(() => {
    if (!counties || indicators.length === 0) return [];
    return counties
      .map((c) => {
        const ind = indicators.find((i) => matchCountyName(i.county_name, c.name));
        if (!ind) return { id: c.id, name: c.name, score: 0 };
        const norm = normalizeCounty(ind);
        const { pgs } = computePGS(c.id, norm, DEFAULT_WEIGHTS);
        return { id: c.id, name: c.name, score: pgs };
      })
      .sort((a, b) => b.score - a.score);
  }, [counties, indicators]);

  const top5 = rankings.slice(0, 5);
  const bottom5 = rankings.slice(-5).reverse();

  function scoreColor(s: number): string {
    return getPGSColor(s);
  }

  if (rankings.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm text-stone-400">Loading statistical rankings...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-800">Counties by priority need</h3>
      <p className="mt-1 text-[10px] text-stone-400">Highest Priority Gap Scores — counties needing urgent resource allocation</p>

      <div className="mt-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Most underserved</h4>
        <div className="mt-1 space-y-0.5">
          {top5.map((c, i) => (
            <RankedCounty
              key={c.id}
              rank={i + 1}
              name={c.name}
              score={c.score}
              color={scoreColor(c.score)}
              onClick={() => onCountyClick(c.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Best served</h4>
        <div className="mt-1 space-y-0.5">
          {bottom5.map((c, i) => (
            <RankedCounty
              key={c.id}
              rank={rankings.length - 4 + i}
              name={c.name}
              score={c.score}
              color={scoreColor(c.score)}
              onClick={() => onCountyClick(c.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
