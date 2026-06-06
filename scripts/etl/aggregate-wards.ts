import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const RAW_DIR = join(import.meta.dirname, "../../data/raw");

const COUNTY_HEADER = "county_code,county_name,population,poverty_proxy,facility_count,facility_density_proxy,travel_time_to_facility_proxy,immunization_coverage,skilled_birth_attendance,updated_at";

interface WardRow {
  ward_code: string;
  ward_name: string;
  county_code: string;
  county_name: string;
  population: number;
  poverty_rate: number;
  facility_count: number;
  travel_time_minutes: number;
}

interface CountyAggregate {
  county_code: string;
  county_name: string;
  total_population: number;
  total_facilities: number;
  weighted_poverty: number;
  weighted_travel_time: number;
}

function loadCSV(path: string): Record<string, string>[] {
  const text = readFileSync(path, "utf-8").trim();
  const [header, ...rows] = text.split("\n");
  if (!header) return [];
  const cols = header.split(",");
  return rows.map((row) => {
    const vals = row.split(",");
    const obj: Record<string, string> = {};
    cols.forEach((c, i) => { obj[c.trim()] = vals[i]?.trim() ?? ""; });
    return obj;
  });
}

function parseWards(rows: Record<string, string>[]): WardRow[] {
  return rows.map((r) => ({
    ward_code: r.ward_code ?? "",
    ward_name: r.ward_name ?? "",
    county_code: r.county_code ?? "",
    county_name: r.county_name ?? "",
    population: Number(r.population) || 0,
    poverty_rate: Number(r.poverty_rate) || 0,
    facility_count: Number(r.facility_count) || 0,
    travel_time_minutes: Number(r.travel_time_minutes) || 0,
  }));
}

function main() {
  const inputPath = join(RAW_DIR, "wards_clean.csv");
  if (!existsSync(inputPath)) {
    console.error(`Clean ward data not found at: ${inputPath}`);
    console.error("Run 'npm run etl:fetch' first to generate wards_clean.csv");
    process.exit(1);
  }

  const rawRows = loadCSV(inputPath);
  if (rawRows.length === 0) {
    console.error("No data found in wards_clean.csv");
    process.exit(1);
  }

  const wards = parseWards(rawRows);
  console.log(`Read ${wards.length} ward records`);

  const grouped = new Map<string, WardRow[]>();
  for (const w of wards) {
    const existing = grouped.get(w.county_code) ?? [];
    existing.push(w);
    grouped.set(w.county_code, existing);
  }

  const counties: CountyAggregate[] = [];

  for (const [countyCode, wardList] of grouped) {
    const countyName = wardList[0].county_name;
    const totalPop = wardList.reduce((s, w) => s + w.population, 0);

    const weightedPoverty = wardList.reduce((s, w) => s + w.poverty_rate * w.population, 0) / totalPop;
    const weightedTravelTime = wardList.reduce((s, w) => s + w.travel_time_minutes * w.population, 0) / totalPop;
    const totalFacilities = wardList.reduce((s, w) => s + w.facility_count, 0);

    counties.push({
      county_code: countyCode,
      county_name: countyName,
      total_population: totalPop,
      total_facilities: totalFacilities,
      weighted_poverty: Math.round(weightedPoverty * 10) / 10,
      weighted_travel_time: Math.round(weightedTravelTime * 10) / 10,
    });
  }

  const maxFacilities = Math.max(...counties.map((c) => c.total_facilities), 1);

  const today = new Date().toISOString().slice(0, 10);
  const lines = [COUNTY_HEADER];

  for (const c of counties) {
    const densityProxy = Math.round((1 - Math.min(1, c.total_facilities / maxFacilities)) * 1000) / 1000;
    lines.push(`${c.county_code},${c.county_name},${c.total_population},${c.weighted_poverty},${c.total_facilities},${densityProxy},${c.weighted_travel_time},0,0,${today}`);
  }

  const outPath = join(RAW_DIR, "county_indicators.csv");
  writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`\n✓ Wrote ${counties.length} county aggregates to data/raw/county_indicators.csv`);
  for (const c of counties) {
    console.log(`  ${c.county_name}: pop=${c.total_population.toLocaleString()}, poverty=${c.weighted_poverty}%, facilities=${c.total_facilities}, travel=${c.weighted_travel_time}min`);
  }
}

main();
