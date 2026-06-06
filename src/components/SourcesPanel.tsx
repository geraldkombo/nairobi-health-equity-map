"use client";

import type { SourceEntry } from "@/lib/adapters";
import { REAL_SOURCES } from "@/lib/adapters";

const TYPE_COLORS: Record<string, string> = {
  api: "bg-stone-200 text-stone-700",
  download: "bg-stone-100 text-stone-600",
  website: "bg-stone-100 text-stone-600",
  research: "bg-stone-100 text-stone-600",
};

function SourceCard({ item }: { item: SourceEntry }) {
  return (
    <div className="rounded-lg border border-stone-100 bg-stone-50 p-4 transition-colors hover:border-stone-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-stone-800 underline underline-offset-2 hover:text-stone-900"
          >
            {item.name}
          </a>
          <p className="mt-1 text-xs leading-5 text-stone-600">{item.note}</p>
        </div>
        <span className={`flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-medium uppercase leading-4 ${TYPE_COLORS[item.type] ?? "bg-stone-100 text-stone-500"}`}>
          {item.type}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        {item.licenseUrl ? (
          <a
            href={item.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-medium text-stone-400 underline underline-offset-2 hover:text-stone-600"
          >
            {item.license}
          </a>
        ) : (
          <span className="text-[10px] font-medium text-stone-400">{item.license}</span>
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-stone-400 underline underline-offset-2 hover:text-stone-600"
        >
          {item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
      </div>
    </div>
  );
}

function SourceSection({ label, items }: { label: string; items: SourceEntry[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</h4>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <SourceCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function SourcesPanel({
  sources = REAL_SOURCES,
}: {
  sources?: Record<string, SourceEntry[]>;
}) {

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-800">Data sources & provenance</h3>
      <p className="mt-1 text-xs leading-5 text-stone-500">
        Every dataset on this platform is linked to its source, license, and download location.
        All data is sourced from official Kenyan open-data repositories and international research
        programmes.
      </p>
      <div className="mt-4 space-y-5">
        {Object.entries(sources).map(([key, items]) => {
          const label =
            key === "counties" ? "County boundaries"
            : key === "facilities" ? "Health facilities"
            : key === "indicators" ? "Population & poverty indicators"
            : key === "methods" ? "Spatial modelling methods"
            : key;
          return <SourceSection key={key} label={label} items={items} />;
        })}
      </div>
      <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-400">
        Suggested citation: &ldquo;Kenya Health Equity Map, https://kenya-health-equity.netlify.app. Sources as listed above. Accessed {new Date().toISOString().slice(0, 10)}.&rdquo;
      </p>
    </div>
  );
}
