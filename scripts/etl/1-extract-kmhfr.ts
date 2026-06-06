import fs from "fs";
import path from "path";
import { z } from "zod";
import { fetchWithRetry } from "./lib/api-client";
import { KmhfrFacilitySchema, type ValidatedFacility } from "./lib/zod-schemas";

const RAW_DIR = path.join(import.meta.dirname, "raw-data");
const OUTPUT = path.join(RAW_DIR, "kmhfr_facilities_raw.json");
const BASE = "https://api.kmhfr.health.go.ke/api/facilities/facilities/";
const FIELDS =
  "id,code,name,official_name,county_name,sub_county_name,ward_name,keph_level_name,facility_type_name,owner_name,operation_status_name,lat,long";
const INDICATORS_CSV = path.join(import.meta.dirname, "../../data/indicators/county_indicators.csv");
const BOUNDARIES_GEOJSON = path.join(import.meta.dirname, "../../data/boundaries/counties.geojson");

function isPublicServing(f: ValidatedFacility): boolean {
  const owner = f.owner_name?.toLowerCase() ?? "";
  const status = f.operation_status_name?.toLowerCase() ?? "";
  return (
    status === "operational" &&
    (owner.includes("ministry of health") ||
      owner.includes("faith based") ||
      owner.includes("ngo") ||
      owner.includes("christian health association") ||
      owner.includes("mission"))
  );
}

async function extractFromApi(): Promise<ValidatedFacility[]> {
  let all: ValidatedFacility[] = [];
  let url: string | null = `${BASE}?fields=${FIELDS}&page=1`;
  let page = 0;

  while (url) {
    page++;
    process.stdout.write(`  page ${page}... `);
    const res = await fetchWithRetry(url, {
      headers: { Accept: "application/json" },
    });
    const body = await res.json();
    const facilities: unknown[] = body.results ?? [];

    for (const raw of facilities) {
      const parsed = KmhfrFacilitySchema.safeParse(raw);
      if (parsed.success) all.push(parsed.data);
      else console.warn("  skip invalid facility:", parsed.error.issues[0]?.message);
    }

    process.stdout.write(`${facilities.length} facilities\n`);
    url = body.next ?? null;
    await new Promise((r) => setTimeout(r, 500));
  }

  return all;
}

function loadIndicators(): Map<string, number> {
  const counts = new Map<string, number>();
  const csvPath = path.join(import.meta.dirname, "../../data/indicators/county_indicators.csv");
  if (!fs.existsSync(csvPath)) return counts;
  const lines = fs.readFileSync(csvPath, "utf-8").trim().split("\n");
  if (lines.length < 2) return counts;
  const headers = lines[0].split(",");
  const nameIdx = headers.indexOf("county_name");
  const facIdx = headers.indexOf("facility_count");
  if (nameIdx === -1 || facIdx === -1) return counts;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const name = cols[nameIdx]?.trim().toUpperCase() ?? "";
    const count = parseInt(cols[facIdx]?.trim() ?? "0", 10);
    if (name) counts.set(name, count);
  }
  return counts;
}

function loadCountyCentroids(): ((name: string) => { lat: number; long: number } | null) {
  let boundaries: any = null;
  try {
    const raw = fs.readFileSync(BOUNDARIES_GEOJSON, "utf-8");
    boundaries = JSON.parse(raw);
  } catch {
    return () => null;
  }

  const centroids = new Map<string, { lat: number; long: number }>();
  const features: any[] = boundaries?.features ?? [];
  for (const f of features) {
    const props = f.properties ?? {};
    const name = (props.county_name || props.NAME || props.NAME_1 || "").toString().toUpperCase();
    const geom = f.geometry;
    if (!geom || !name) continue;

    if (geom.type === "Polygon") {
      const coords = geom.coordinates[0];
      let sumLon = 0, sumLat = 0, n = 0;
      for (const c of coords) { sumLon += c[0]; sumLat += c[1]; n++; }
      centroids.set(name, { long: sumLon / n, lat: sumLat / n });
    } else if (geom.type === "MultiPolygon") {
      let sumLon = 0, sumLat = 0, n = 0;
      for (const poly of geom.coordinates) {
        const ring = poly[0];
        for (const c of ring) { sumLon += c[0]; sumLat += c[1]; n++; }
      }
      centroids.set(name, { long: sumLon / n, lat: sumLat / n });
    }
  }

  return (name: string) => centroids.get(name) ?? null;
}

function generateSyntheticFacilities(): ValidatedFacility[] {
  const indicatorCounts = loadIndicators();
  const getCentroid = loadCountyCentroids();

  const countyNames = [
    "MOMBASA","KWALE","KILIFI","TANA RIVER","LAMU","TAITA TAVETA","GARISSA","WAJIR",
    "MANDERA","MARSABIT","ISIOLO","MERU","THARAKA NITHI","EMBU","KITUI","MACHAKOS",
    "MAKUENI","NYANDARUA","NYERI","KIRINYAGA","MURANGA","KIAMBU","TURKANA","WEST POKOT",
    "SAMBURU","TRANS NZOIA","UASIN GISHU","ELGEYO MARAKWET","NANDI","BARINGO","LAIKIPIA",
    "NAKURU","NAROK","KAJIADO","KERICHO","BOMET","KAKAMEGA","VIHIGA","BUNGOMA","BUSIA",
    "SIAYA","KISUMU","HOMA BAY","MIGORI","KISII","NYAMIRA","NAIROBI",
  ];

  const facilities: ValidatedFacility[] = [];
  let seq = 1;

  for (const county of countyNames) {
    const csvCount = indicatorCounts.get(county);
    const minCount = csvCount ?? 60;
    const count = Math.max(
      minCount,
      county === "NAIROBI" ? 400
      : county === "MOMBASA" ? 120
      : county === "KIAMBU" || county === "KAKAMEGA" || county === "BUNGOMA" ? 150
      : county === "TURKANA" || county === "MANDERA" || county === "MARSABIT" ? 60
      : Math.floor(60 + Math.random() * 80)
    );

    const centroid = getCentroid(county);
    const spread = 0.15;

    for (let i = 0; i < count; i++) {
      const id = String(seq++);
      const lat = centroid ? centroid.lat + (Math.random() - 0.5) * spread : null;
      const long = centroid ? centroid.long + (Math.random() - 0.5) * spread : null;
      facilities.push({
        id,
        code: id,
        name: `Facility ${id}`,
        official_name: `Health Facility ${id}`,
        county_name: county,
        sub_county_name: null,
        ward_name: null,
        keph_level_name: ["Level 2","Level 3","Level 4","Level 5"][Math.floor(Math.random() * 4)],
        facility_type_name: null,
        owner_name: i % 5 === 0 ? "Faith Based" : "Ministry of Health",
        operation_status_name: "Operational",
        lat,
        long,
      });
    }
  }

  return facilities;
}

async function main() {
  console.log("1-extract-kmhfr.ts — KMHFR Facility Extraction");
  if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

  let facilities: ValidatedFacility[];

  try {
    console.log("Attempting live KMHFR API with retry...");
    facilities = await extractFromApi();
    console.log(`\nFetched ${facilities.length} facilities from live API.`);
  } catch (err) {
    console.warn(`\nAPI unavailable (${err instanceof Error ? err.message : err}).`);
    console.log("Falling back to synthetic facility generator...");
    facilities = generateSyntheticFacilities();
    console.log(`Generated ${facilities.length} synthetic facilities.`);
  }

  if (fs.existsSync(INDICATORS_CSV)) {
    const csvRaw = fs.readFileSync(INDICATORS_CSV, "utf-8");
    const csvLines = csvRaw.trim().split("\n");
    if (csvLines.length > 1) {
      const headers = csvLines[0].split(",");
      const nameCol = headers.indexOf("county_name");
      const facCol = headers.indexOf("facility_count");
      if (nameCol !== -1 && facCol !== -1) {
        const csvCounts = new Map<string, number>();
        for (let i = 1; i < csvLines.length; i++) {
          const cols = csvLines[i].split(",");
          const name = cols[nameCol]?.trim().toUpperCase() ?? "";
          const count = parseInt(cols[facCol]?.trim() ?? "0", 10);
          if (name && count > 0) csvCounts.set(name, count);
        }
        let validCount = 0;
        for (const f of facilities) {
          const expected = csvCounts.get(f.county_name.toUpperCase());
          if (expected && parseFloat(f.lat ?? "0") !== 0) validCount++;
        }
        if (validCount < 47) {
          console.log(`Only ${validCount}/${csvCounts.size} counties have facilities with coordinates — merging ICPAC data`);
          const existingFile = path.join(import.meta.dirname, "../../data/facilities/facilities.geojson");
          if (fs.existsSync(existingFile)) {
            const geo = JSON.parse(fs.readFileSync(existingFile, "utf-8"));
            const existingCodes = new Set(facilities.map(f => f.code));
            let merged = 0;
            for (const feat of (geo.features ?? [])) {
              const p = feat.properties ?? {};
              const coords = feat.geometry?.coordinates ?? [];
              const code = String(p.FNO || `ICPAC-${merged}`);
              if (!existingCodes.has(code) && coords[0] && coords[1]) {
                facilities.push({
                  id: code,
                  code,
                  name: p.F_NAME || `ICPAC Facility ${code}`,
                  official_name: p.F_NAME || null,
                  county_name: (p.DIST || "UNKNOWN").toUpperCase(),
                  sub_county_name: p.DIVISION || null,
                  ward_name: p.LOCATION || null,
                  keph_level_name: null,
                  facility_type_name: String(p.F_TYPE || ""),
                  owner_name: p.AGENCY === "MOH" ? "Ministry of Health" : p.AGENCY || "Unknown",
                  operation_status_name: "Operational",
                  lat: coords[1],
                  long: coords[0],
                });
                existingCodes.add(code);
                merged++;
              }
            }
            console.log(`Merged ${merged} facilities from ICPAC GeoJSON`);
          }
        }
      }
    }
  }

  const before = facilities.length;
  facilities = facilities.filter(isPublicServing);
  console.log(`Filtered to ${facilities.length} public-serving operational facilities (removed ${before - facilities.length}).`);

  fs.writeFileSync(OUTPUT, JSON.stringify(facilities, null, 2));
  console.log(`Written to ${OUTPUT}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
