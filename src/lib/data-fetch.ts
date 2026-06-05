import type { CountyRecord, IndicatorRecord, FacilitiesGeoJSON } from "@/lib/adapters";

export async function fetchCounties(): Promise<{ counties: CountyRecord[]; source: "live" | "snapshot" }> {
  try {
    const res = await fetch("/api/wards");
    const data = await res.json();
    return { counties: data.counties ?? data, source: "live" };
  } catch {
    const snap = await fetch("/data/snapshots/counties.json").then((r) => r.json());
    return { counties: snap, source: "snapshot" };
  }
}

export async function fetchFacilities(): Promise<{ geojson: FacilitiesGeoJSON; source: "live" | "snapshot" }> {
  try {
    const res = await fetch("/api/facilities");
    const data = await res.json();
    return { geojson: data.geojson ?? data, source: "live" };
  } catch {
    const snap = await fetch("/data/snapshots/facilities.json").then((r) => r.json());
    return { geojson: snap, source: "snapshot" };
  }
}

export async function fetchIndicators(): Promise<IndicatorRecord[]> {
  const res = await fetch("/data/indicators/county_indicators.csv");
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line: string) => {
    const vals = line.split(",");
    const record: Record<string, string> = {};
    headers.forEach((h: string, i: number) => {
      record[h.trim()] = vals[i]?.trim() ?? "";
    });
    return {
      county_code: record.county_code,
      county_name: record.county_name,
      population: Number(record.population),
      poverty_proxy: Number(record.poverty_proxy),
      facility_count: Number(record.facility_count),
      facility_density_proxy: Number(record.facility_density_proxy),
      travel_time_to_facility_proxy: Number(record.travel_time_to_facility_proxy),
      immunization_coverage: Number(record.immunization_coverage),
      skilled_birth_attendance: Number(record.skilled_birth_attendance),
      updated_at: record.updated_at,
    };
  });
}
