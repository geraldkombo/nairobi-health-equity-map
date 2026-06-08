"use client";

import { DEFAULT_WEIGHTS, type PGSWeights } from "@/lib/scoring";

interface WeightsControlProps {
  weights: PGSWeights;
  onChange: (w: PGSWeights) => void;
}

const labels: Record<keyof PGSWeights, string> = {
  accessibility: "Accessibility weight",
  populationPressure: "Population pressure weight",
  vulnerability: "Vulnerability weight",
};

export default function WeightsControl({ weights, onChange }: WeightsControlProps) {
  function handleChange(key: keyof PGSWeights, value: number) {
    const next = { ...weights, [key]: value };
    const sum = next.accessibility + next.populationPressure + next.vulnerability;
    if (sum > 0) {
      next.accessibility /= sum;
      next.populationPressure /= sum;
      next.vulnerability /= sum;
    }
    onChange(next);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Metric Weight Configuration</h3>
      <p className="mt-1 text-xs text-neutral-400">
        Adjust the relative importance of specific indicators to calculate the Priority Gap Score.
      </p>
      <div className="mt-4 space-y-4">
        {(Object.keys(DEFAULT_WEIGHTS) as (keyof PGSWeights)[]).map((key) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`weight-${key}`} className="text-neutral-700">
                {labels[key]}
              </label>
              <span className="font-mono text-xs text-neutral-500">{(weights[key] * 100).toFixed(0)}%</span>
            </div>
            <input
              id={`weight-${key}`}
              type="range"
              min={0}
              max={100}
              value={Math.round(weights[key] * 100)}
              onChange={(e) => handleChange(key, Number(e.target.value) / 100)}
              className="mt-1 w-full accent-accent-600"
              aria-label={`${labels[key]} slider`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
