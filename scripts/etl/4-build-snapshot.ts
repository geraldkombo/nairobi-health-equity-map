import fs from "fs";
import path from "path";
import { z } from "zod";
import { parse } from "csv-parse/sync";
import { CountySnapshotArraySchema } from "./lib/zod-schemas";
import { sanitizeCountyName, createCountyId, toTitleCase } from "./lib/county-names";

interface GeoPoint { type: "Point"; coordinates: number[]; }
interface GeoFeature { type: "Feature"; geometry: GeoPoint | null; properties: Record<string, any>; }
interface GeoFC { type: "FeatureCollection"; features: GeoFeature[]; }

const RAW_DIR = path.join(import.meta.dirname, "raw-data");
const SNAPSHOT_DIR = path.join(import.meta.dirname, "../../data/snapshots");

interface KnbsRecord {
  county_name: string;
  population: number;
  poverty_rate: number;
}

interface TravelTimeRecord {
  county_name: string;
  mean_travel_time: number;
}

function loadJSON<T>(file: string): T[] {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function main() {
  console.log("4-build-snapshot.ts — County Indicators Aggregator\n");

  // 1. KNBS demographics
  const knbsFile = path.join(RAW_DIR, "knbs_demographics.json");
  if (!fs.existsSync(knbsFile)) {
    console.error("Missing knbs_demographics.json. Run 2-extract-knbs.ts first.");
    process.exit(1);
  }
  const knbs = loadJSON<KnbsRecord>(knbsFile);
  console.log(`KNBS demographics: ${knbs.length} counties`);

  // 2. Travel times
  const travelFile = path.join(RAW_DIR, "county_travel_times.json");
  if (!fs.existsSync(travelFile)) {
    console.error("Missing county_travel_times.json. Run 3-extract-spatial.ts first.");
    process.exit(1);
  }
  const travelRows = loadJSON<TravelTimeRecord>(travelFile);
  const travelMap: Record<string, number> = {};
  for (const r of travelRows) {
    travelMap[sanitizeCountyName(r.county_name)] = r.mean_travel_time;
  }
  console.log(`Travel times: ${Object.keys(travelMap).length} counties`);

  // 3a. KDHS indicators (immunization, SBA) from indicators CSV
  const indicatorsCsv = path.join(import.meta.dirname, "../../data/indicators/county_indicators.csv");
  const kdhsMap: Record<string, { immunization_coverage: number; skilled_birth_attendance: number }> = {};
  if (fs.existsSync(indicatorsCsv)) {
    const csvRaw = fs.readFileSync(indicatorsCsv, "utf-8");
    const records: Record<string, string>[] = parse(csvRaw, { columns: true, skip_empty_lines: true });
    for (const r of records) {
      const key = sanitizeCountyName(r.county_name);
      kdhsMap[key] = {
        immunization_coverage: parseFloat(r.immunization_coverage) || 0,
        skilled_birth_attendance: parseFloat(r.skilled_birth_attendance) || 0,
      };
    }
    console.log(`KDHS indicators: ${Object.keys(kdhsMap).length} counties`);
  } else {
    console.warn("Missing county_indicators.csv — immunization/SBA will remain 0");
  }

  // 3b. KMHFR facilities
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
  const unmatched: string[] = [];
  const snapshot = knbs.map((county) => {
    const key = sanitizeCountyName(county.county_name);
    const facCount = facilityCounts[key] || 0;
    const pop = county.population;
    const facilitiesPer10k = pop > 0 ? (facCount / pop) * 10000 : 0;
    const travelTime = travelMap[key] ?? 60;

    if (facCount === 0) unmatched.push(county.county_name);

    const kdhs = kdhsMap[key] ?? { immunization_coverage: 0, skilled_birth_attendance: 0 };

    return {
      county_code: createCountyId(key),
      county_name: toTitleCase(key),
      population: pop,
      facility_count: facCount,
      facility_density_proxy: Math.round(facilitiesPer10k * 100) / 100,
      poverty_proxy: county.poverty_rate,
      travel_time_to_facility_proxy: Math.round(travelTime),
      immunization_coverage: kdhs.immunization_coverage,
      skilled_birth_attendance: kdhs.skilled_birth_attendance,
      updated_at: new Date().toISOString().slice(0, 10),
    };
  });

  if (unmatched.length > 0) {
    console.warn(`\nZero facilities for: ${unmatched.join(", ")}`);
  }

  // 5. Zod validation
  const validated = CountySnapshotArraySchema.parse(snapshot);
  console.log(`\nValidated ${validated.length} county records.`);

  // 6. Write county indicators
  if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const outPath = path.join(SNAPSHOT_DIR, "county_indicators.json");
  fs.writeFileSync(outPath, JSON.stringify(validated, null, 2));
  console.log(`Written to ${outPath}`);

  // 7. Copy facilities as GeoJSON to snapshot dir
  const facRaw = path.join(RAW_DIR, "kmhfr_facilities_raw.json");
  const facOut = path.join(SNAPSHOT_DIR, "facilities.json");
  if (fs.existsSync(facRaw)) {
    const facilities = JSON.parse(fs.readFileSync(facRaw, "utf-8"));
    const fc: GeoFC = {
      type: "FeatureCollection",
      features: facilities
        .filter((f: any) => f.lat != null && f.long != null)
        .map((f: any) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [f.long, f.lat],
          },
          properties: {
            FNO: f.code,
            F_NAME: f.name,
            F_TYPE: f.keph_level_name === "Level 5" ? 1 : f.keph_level_name === "Level 4" ? 2 : f.keph_level_name === "Level 3" ? 3 : 4,
            AGENCY: f.owner_name === "Ministry of Health" ? "MOH" : f.owner_name,
            COUNTY: f.county_name,
            DISTRICT: f.county_name,
          },
        })),
    };
    fs.writeFileSync(facOut, JSON.stringify(fc));
    console.log(`Written ${fc.features.length} facilities to ${facOut}`);
  }
}

main();
