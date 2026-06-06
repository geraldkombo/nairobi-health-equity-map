import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import type { CountyRecord } from "../../src/lib/adapters";

const IndicatorRecordSchema = z.object({
  county_code: z.string().min(1),
  county_name: z.string().min(1),
  population: z.number().nonnegative(),
  poverty_proxy: z.number().min(0).max(100),
  facility_count: z.number().int().nonnegative(),
  facility_density_proxy: z.number().min(0).max(1),
  travel_time_to_facility_proxy: z.number().min(0).max(100),
  immunization_coverage: z.number().min(0).max(100),
  skilled_birth_attendance: z.number().min(0).max(100),
  updated_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type ValidatedIndicator = z.infer<typeof IndicatorRecordSchema>;

const RAW_DIR = join(import.meta.dirname, "../../data/raw");
const SNAPSHOTS_DIR = join(import.meta.dirname, "../../data/snapshots");
const BOUNDARIES_DIR = join(import.meta.dirname, "../../data/boundaries");
const FACILITIES_DIR = join(import.meta.dirname, "../../data/facilities");

function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function loadJSON<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return null;
  }
}

function loadCSV(path: string): Record<string, string>[] {
  try {
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
  } catch {
    return [];
  }
}

async function main() {
  ensureDir(SNAPSHOTS_DIR);

  // ── Counties ──────────────────────────────────────────────
  const boundariesRaw = loadJSON<{ features: { properties: { county_code: number; county_name: string } }[] }>(
    join(BOUNDARIES_DIR, "counties.geojson"),
  );
  const counties: CountyRecord[] =
    boundariesRaw?.features.map((f) => ({
      id: String(f.properties.county_code),
      name: f.properties.county_name,
    })) ?? [];

  if (counties.length === 0) {
    console.error("No counties found in boundaries GeoJSON.");
    process.exit(1);
  }
  writeFileSync(join(SNAPSHOTS_DIR, "counties.json"), JSON.stringify(counties, null, 2));
  console.log(`✓ counties.json — ${counties.length} counties`);

  // ── County indicators ─────────────────────────────────────
  const csvPath = join(RAW_DIR, "county_indicators.csv");
  if (!existsSync(csvPath)) {
    console.error(`County indicators CSV not found at: ${csvPath}`);
    console.error("Run 'npm run etl:aggregate' first.");
    process.exit(1);
  }
  const csvData = loadCSV(csvPath);
  const rawIndicators = csvData.map((row) => ({
    county_code: row.county_code ?? "",
    county_name: row.county_name ?? "",
    population: Number(row.population) || 0,
    poverty_proxy: Number(row.poverty_proxy) || 0,
    facility_count: Number(row.facility_count) || 0,
    facility_density_proxy: Number(row.facility_density_proxy) || 0,
    travel_time_to_facility_proxy: Number(row.travel_time_to_facility_proxy) || 0,
    immunization_coverage: Number(row.immunization_coverage) || 0,
    skilled_birth_attendance: Number(row.skilled_birth_attendance) || 0,
    updated_at: row.updated_at ?? new Date().toISOString().slice(0, 10),
  }));

  const validated: ValidatedIndicator[] = [];
  const errors: string[] = [];
  for (let i = 0; i < rawIndicators.length; i++) {
    const result = IndicatorRecordSchema.safeParse(rawIndicators[i]);
    if (result.success) {
      validated.push(result.data);
    } else {
      errors.push(`Row ${i + 2} (${rawIndicators[i].county_name}): ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
    }
  }
  if (errors.length > 0) {
    console.error(`\nValidation errors (${errors.length}):`);
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  writeFileSync(join(SNAPSHOTS_DIR, "county_indicators.json"), JSON.stringify(validated, null, 2));
  console.log(`✓ county_indicators.json — ${validated.length} counties (Zod-validated)`);

  // ── Facilities ────────────────────────────────────────────
  const facilitiesRaw = loadJSON<{ type: string; features: unknown[] }>(
    join(FACILITIES_DIR, "facilities.geojson"),
  );
  if (facilitiesRaw) {
    writeFileSync(join(SNAPSHOTS_DIR, "facilities.json"), JSON.stringify(facilitiesRaw, null, 2));
    console.log(`✓ facilities.json — ${facilitiesRaw.features.length} features`);
  } else {
    console.warn("⚠ No facilities.geojson found — skipping");
  }

  console.log("\nAll snapshots built successfully.");
}

main().catch(console.error);
