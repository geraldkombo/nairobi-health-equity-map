"use client";

import { REAL_SOURCES } from "@/lib/adapters";

function SourceList({ label, items }: { label: string; items: { name: string; url: string; license: string; note: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((s, i) => (
          <li key={i} className="text-xs leading-5 text-neutral-600">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-neutral-900"
            >
              {s.name}
            </a>
            <span className="ml-1 text-neutral-400">({s.license})</span>
            {s.note && <p className="mt-0.5 text-neutral-400">{s.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SourcesPanel() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-neutral-800">Data sources & provenance</h3>
      <div className="mt-4 space-y-4">
        <SourceList label="Boundaries" items={REAL_SOURCES.counties} />
        <SourceList label="Facilities" items={REAL_SOURCES.facilities} />
        <SourceList label="Indicators" items={REAL_SOURCES.indicators} />
      </div>
      <p className="mt-4 border-t border-neutral-100 pt-3 text-xs text-neutral-400">
        All data sourced from official Kenyan open-data repositories.
      </p>
    </div>
  );
}
