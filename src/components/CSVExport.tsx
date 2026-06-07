"use client";

import type { IndicatorRecord } from "@/lib/adapters";

interface CSVExportProps {
  indicators: IndicatorRecord[];
}

export default function CSVExport({ indicators }: CSVExportProps) {
  const download = () => {
    const headers = ["county", "population", "poverty_rate", "travel_time_min", "facility_count", "facility_density_per_10k"];
    const rows = indicators.map((i) =>
      [
        i.county_name,
        i.population,
        i.poverty_proxy,
        i.travel_time_to_facility_proxy,
        i.facility_count,
        (i.facility_count / i.population * 10000).toFixed(4),
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kenya-health-equity-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
    >
      Download all data (CSV)
    </button>
  );
}
