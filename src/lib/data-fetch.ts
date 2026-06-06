import type { CountyRecord, IndicatorRecord, FacilitiesGeoJSON } from "@/lib/adapters";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function dataUrl(path: string): string {
  return BASE + path;
}

async function loadJSON<T>(path: string): Promise<T> {
  const url = dataUrl(path);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

export async function fetchCounties(): Promise<{ counties: CountyRecord[]; source: "live" | "snapshot" }> {
  const data = await loadJSON<CountyRecord[]>("/data/snapshots/counties.json");
  return { counties: data, source: "live" };
}

function cleanFacilities(raw: any): FacilitiesGeoJSON {
  const fc = raw.geojson ?? raw;
  if (!fc || !fc.features) return fc;
  return { ...fc, features: fc.features.filter((f: any) => f?.geometry?.type === "Point") };
}

export async function fetchFacilities(): Promise<{ geojson: FacilitiesGeoJSON; source: "live" | "snapshot" }> {
  const data = await loadJSON<any>("/data/snapshots/facilities.json");
  return { geojson: cleanFacilities(data), source: "live" };
}

export async function fetchIndicators(): Promise<IndicatorRecord[]> {
  const data = await loadJSON<IndicatorRecord[]>("/data/snapshots/county_indicators.json");
  return data;
}
