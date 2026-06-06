import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const RAW_DIR = join(import.meta.dirname, "../../data/raw");

const WardRowSchema = z.object({
  ward_code: z.string().min(1),
  ward_name: z.string().min(1),
  county_code: z.coerce.string().min(1),
  county_name: z.string().min(1),
  population: z.coerce.number().nonnegative(),
  poverty_rate: z.coerce.number().min(0).max(100),
  facility_count: z.coerce.number().int().nonnegative(),
  travel_time_minutes: z.coerce.number().nonnegative(),
});

type WardRow = z.infer<typeof WardRowSchema>;

const HEADER = "ward_code,ward_name,county_code,county_name,population,poverty_rate,facility_count,travel_time_minutes";

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

function main() {
  const inputPath = join(RAW_DIR, "kenya_wards.csv");
  if (!existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    console.error("Place your KNBS ward-level CSV at data/raw/kenya_wards.csv");
    console.error("Expected columns: ward_code, ward_name, county_code, county_name, population, poverty_rate, facility_count, travel_time_minutes");
    process.exit(1);
  }

  const rows = loadCSV(inputPath);
  console.log(`Read ${rows.length} rows from kenya_wards.csv`);

  const valid: WardRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = WardRowSchema.safeParse(rows[i]);
    if (result.success) {
      valid.push(result.data);
    } else {
      errors.push(`Row ${i + 2}: ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nValidation errors (${errors.length}):`);
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  const lines = [HEADER];
  for (const row of valid) {
    lines.push(`${row.ward_code},${row.ward_name},${row.county_code},${row.county_name},${row.population},${row.poverty_rate},${row.facility_count},${row.travel_time_minutes}`);
  }

  const outPath = join(RAW_DIR, "wards_clean.csv");
  writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`\n✓ Wrote ${valid.length} clean ward records to data/raw/wards_clean.csv`);

  const counties = new Set(valid.map((r) => `${r.county_code} ${r.county_name}`));
  console.log(`  Counties: ${[...counties].sort().join(", ")}`);
  console.log(`  Total population: ${valid.reduce((s, r) => s + r.population, 0).toLocaleString()}`);
}

main();
