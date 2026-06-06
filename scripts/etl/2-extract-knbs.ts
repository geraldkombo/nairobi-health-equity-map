import fs from "fs";
import path from "path";
import { KnbsRowSchema, type KnbsRow } from "./lib/zod-schemas";

const RAW_DIR = path.join(import.meta.dirname, "raw-data");
const CSV_FILE = path.join(RAW_DIR, "knbs_demographics.csv");
const OUTPUT = path.join(RAW_DIR, "knbs_demographics.json");

function loadCSV<T>(file: string, schema: typeof KnbsRowSchema): KnbsRow[] {
  const text = fs.readFileSync(file, "utf-8").trim();
  const lines = text.split("\n").filter(Boolean);
  const [header, ...rows] = lines;
  const cols = header.split(",").map((c) => c.trim());

  const results: KnbsRow[] = [];
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

async function main() {
  console.log("2-extract-knbs.ts — KNBS Demographics Extraction\n");

  if (!fs.existsSync(CSV_FILE)) {
    console.error(`KNBS CSV not found at ${CSV_FILE}`);
    console.error("Place knbs_demographics.csv in scripts/etl/raw-data/");
    process.exit(1);
  }

  const rows = loadCSV(CSV_FILE, KnbsRowSchema);
  console.log(`Parsed ${rows.length} county records from CSV.`);

  if (rows.length !== 47) {
    console.warn(`Expected 47 counties, got ${rows.length}. Verify the CSV.`);
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(rows, null, 2));
  console.log(`Written to ${OUTPUT}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
