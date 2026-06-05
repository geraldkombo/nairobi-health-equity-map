import type { WardRecord, IndicatorRecord, FacilitiesGeoJSON } from "@/lib/adapters";

export async function fetchWards(): Promise<{ wards: WardRecord[]; source: "live" | "snapshot" }> {
  try {
    const res = await fetch("/api/wards");
    const data = await res.json();
    return { wards: data.wards ?? data, source: "live" };
  } catch {
    const snap = await fetch("/data/snapshots/wards.json").then((r) => r.json());
    return { wards: snap.wards, source: "snapshot" };
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
  const res = await fetch("/data/indicators/ward_indicators.csv");
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
      ward_code: record.ward_code,
      population: Number(record.population),
      poverty_proxy: Number(record.poverty_proxy),
      travel_time_to_facility_proxy: Number(record.travel_time_to_facility_proxy),
      facility_density_proxy: Number(record.facility_density_proxy),
      updated_at: record.updated_at,
    };
  });
}
