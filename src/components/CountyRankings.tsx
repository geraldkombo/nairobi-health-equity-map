"use client";

import { useMemo } from "react";
import type { CountyRecord, IndicatorRecord } from "@/lib/adapters";
import { normalizeCounty } from "@/lib/normalize";
import { computePGS, DEFAULT_WEIGHTS } from "@/lib/scoring";

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
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-stone-100"
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
        const ind = indicators.find((i) => i.county_code === c.id);
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
    if (s >= 70) return "#78350F";
    if (s >= 50) return "#EA580C";
    if (s >= 30) return "#F59E0B";
    return "#FDE68A";
  }

  if (rankings.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm text-stone-400">Loading rankings...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-800">County rankings</h3>
      <p className="mt-1 text-[10px] text-stone-400">Highest and lowest Priority Gap Scores</p>

      <div className="mt-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Highest PGS</h4>
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
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Lowest PGS</h4>
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
