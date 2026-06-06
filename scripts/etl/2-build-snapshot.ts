import fs from "fs";
import path from "path";
import { z } from "zod";
import { KnbsRowSchema, TravelTimeRowSchema, CountySnapshotArraySchema } from "./lib/zod-schemas";
import { sanitizeCountyName, createCountyId, toTitleCase } from "./lib/county-names";

const RAW_DIR = path.join(import.meta.dirname, "../../raw-data");
const SNAPSHOT_DIR = path.join(import.meta.dirname, "../../data/snapshots");

function loadCSV<T>(file: string, schema: z.ZodSchema<T>): T[] {
  const text = fs.readFileSync(file, "utf-8").trim();
  const lines = text.split("\n").filter(Boolean);
  const [header, ...rows] = lines;
  const cols = header.split(",").map((c) => c.trim());

  const results: T[] = [];
  for (let i = 0; i < rows.length; i++) {
    const vals = rows[i].split(",").map((v) => v.trim());
    const obj: Record<string, string> = {};
    cols.forEach((c, idx) => { obj[c] = vals[idx] ?? ""; });

    const parsed = schema.safeParse(obj);
    if (parsed.success) {
      results.push(parsed.data);
    } else {
      console.warn(`  row ${i + 2}: ${parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
    }
  }
  return results;
}

function loadJSON<T>(file: string): T[] {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function main() {
  console.log("2-build-snapshot.ts — County Indicators Aggregator\n");

  // 1. KNBS demographics
  const knbsFile = path.join(RAW_DIR, "knbs_demographics.csv");
  if (!fs.existsSync(knbsFile)) {
    console.error("Missing knbs_demographics.csv. Place it in raw-data/.");
    process.exit(1);
  }
  const knbs = loadCSV(knbsFile, KnbsRowSchema);
  console.log(`KNBS demographics: ${knbs.length} counties`);

  // 2. Travel times
  const travelFile = path.join(RAW_DIR, "county_travel_times.csv");
  if (!fs.existsSync(travelFile)) {
    console.error("Missing county_travel_times.csv. Place it in raw-data/.");
    process.exit(1);
  }
  const travelRows = loadCSV(travelFile, TravelTimeRowSchema);
  const travelMap: Record<string, number> = {};
  for (const r of travelRows) {
    travelMap[sanitizeCountyName(r.county_name)] = r.mean_travel_time;
  }
  console.log(`Travel times: ${Object.keys(travelMap).length} counties`);

  // 3. KMHFR facilities
  const kmhfrFile = path.join(RAW_DIR, "kmhfr_facilities_raw.json");
  if (!fs.existsSync(kmhfrFile)) {
    console.error("Missing kmhfr_facilities_raw.json. Run 1-extract-kmhfr.ts first.");
    process.exit(1);
  }
  const facilities = loadJSON(kmhfrFile);
  const facSchema = z.object({ county_name: z.string() }).passthrough();
  const validFacilities = z.array(facSchema).parse(facilities);

  const facilityCounts: Record<string, number> = {};
  for (const f of validFacilities) {
    const key = sanitizeCountyName(f.county_name);
    facilityCounts[key] = (facilityCounts[key] || 0) + 1;
  }
  console.log(`Facilities: ${Object.keys(facilityCounts).length} counties with facilities`);

  // 4. Merge
  const snapshot = knbs.map((county) => {
    const key = sanitizeCountyName(county.county_name);
    const facCount = facilityCounts[key] || 0;
    const pop = county.population;
    const facilitiesPer10k = pop > 0 ? (facCount / pop) * 10000 : 0;
    const travelTime = travelMap[key] ?? 60;

    if (facCount === 0) {
      console.warn(`  zero facilities for ${county.county_name} — check name match`);
    }

    return {
      county_code: createCountyId(key),
      county_name: toTitleCase(key),
      population: pop,
      facility_count: facCount,
      facility_density_proxy: Math.round(facilitiesPer10k * 100) / 100,
      poverty_proxy: county.poverty_rate,
      travel_time_to_facility_proxy: Math.round(travelTime),
      immunization_coverage: 0,
      skilled_birth_attendance: 0,
      updated_at: new Date().toISOString().slice(0, 10),
    };
  });

  // 5. Zod validation
  const validated = CountySnapshotArraySchema.parse(snapshot);
  console.log(`\nValidated ${validated.length} county records.`);

  // 6. Write
  if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const outPath = path.join(SNAPSHOT_DIR, "county_indicators.json");
  fs.writeFileSync(outPath, JSON.stringify(validated, null, 2));
  console.log(`Written to ${outPath}`);
}

main();
