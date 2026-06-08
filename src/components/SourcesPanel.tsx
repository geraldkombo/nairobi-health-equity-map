"use client";

import type { SourceEntry } from "@/lib/adapters";
import { REAL_SOURCES } from "@/lib/adapters";

const SECTION_LABELS: Record<string, string> = {
  counties: "County boundaries",
  facilities: "Health facilities",
  indicators: "Population and poverty indicators",
  methods: "Spatial modelling methods",
};

export default function SourcesPanel({
  sources = REAL_SOURCES,
}: {
  sources?: Record<string, SourceEntry[]>;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-stone-800 select-none">Data sources</summary>
        <p className="mt-2 text-xs leading-5 text-stone-500">
          This platform aggregates statistics from validated national and international public health databases.
        </p>
        <div className="mt-3 space-y-4">
          {Object.entries(sources).map(([key, items]) => {
            const label = SECTION_LABELS[key] ?? key;
            return (
              <div key={key}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</h4>
                <ul className="mt-1 space-y-1">
                  {items.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-stone-600 underline underline-offset-2 hover:text-stone-800"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-stone-400">
          Inquiries and Data Corrections{" "}
          <a
            href="https://wa.me/254706813068"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
          >
            Contact via WhatsApp
          </a>
        </p>
      </details>
    </div>
  );
}
