# ETL Pipeline — Kenya Health Equity Map

Data transformation scripts that convert raw Kenyan health data into the
JSON snapshots consumed by the frontend.

## Scripts

| Script | Stage | Source | Output |
|--------|-------|--------|--------|
| `fetch-knbs.ts` | Extract | KNBS ward-level CSV (`data/raw/kenya_wards.csv`) | `data/raw/wards_clean.csv` |
| `aggregate-wards.ts` | Transform | Clean ward data → county rollup (population-weighted) | `data/raw/county_indicators.csv` |
| `build-snapshots.ts` | Load | Aggregated data → frontend JSON (Zod-validated) | `data/snapshots/*.json` |

## Usage

```bash
# Full pipeline (fetch → aggregate → build)
npm run etl

# Individual stages
npm run etl:fetch    # Validate and clean raw KNBS ward CSV
npm run etl:aggregate # Aggregate wards to county level
npm run etl:build    # Zod-validate and emit JSON snapshots

# Build the site after refresh
npm run build
```

## Real Data Sources (June 2026)

### Population (ward-level)
**Primary:** [OCHA HDX Kenya Population Statistics](https://data.humdata.org/dataset/kenya-population-statistics) — KNBS-derived ward population CSV. Columns: `ADM3_EN` (Ward Name), `ADM3_PCODE` (Ward Code), `T_TL` (Total Population). No authentication required.
**Alternative:** [KNBS Microdata Portal](https://statistics.knbs.or.ke/) — requires data access request.

### Poverty / Wealth
**Primary:** [KDHS 2022](https://dhsprogram.com/data/dataset/Kenya_Standard-DHS_2022.cfm) — Kenya Demographic and Health Survey wealth quintile data. Register a project on the DHS Program portal, download as .dta or .csv. Replaces dated KIHBS 2015/16.

### Health Facilities
**Primary:** [KMHFR](https://kmhfr.health.go.ke/) — navigate to Facilities tab, click "Export to CSV". ~16,000+ facilities with GPS, KEPH level, ownership, operational status.
**API:** `https://fhirapi.nphl.go.ke/api/` — FHIR R4, requires OAuth token from helpdesk@nphl.go.ke.
**Fallback:** [ICPAC GeoPortal](https://geoportal.icpac.net/layers/geonode:kenya_health_facilities) — 200+ facilities, CC-BY-4.0, no auth required.

### Travel Time
**Self-modelled:** [WHO AccessMod 5](https://www.accessmod.org/) + [Geofabrik OSM Kenya](https://download.geofabrik.de/africa/kenya.html) + [ESA WorldCover](https://worldcover.esa.int/). Run AccessMod least-cost path algorithm over combined transport network to generate county-level travel time rasters.
**Research data:** [KEMRI/Wellcome Trust](https://kemri-wellcome.org/programmes/geographic-access/) — friction surfaces available upon request.

## Data Flow

1. Download ward population CSV from HDX to `data/raw/kenya_wards.csv`
2. Download facility CSV from KMHFR export to `data/raw/facilities.csv`
3. Download wealth/poverty data from DHS Program to `data/raw/kdhs_2022.csv`
4. `fetch-knbs.ts` validates the CSVs with Zod and writes `data/raw/wards_clean.csv`
5. `aggregate-wards.ts` groups wards by county, applies population weighting, and writes `data/raw/county_indicators.csv`
6. `build-snapshots.ts` reads the county CSV, validates every field with Zod, and emits `data/snapshots/county_indicators.json`

### Required columns for `kenya_wards.csv`
- `ward_code` — unique ward identifier
- `ward_name` — ward name (ADM3_EN)
- `county_code` — county code (ADM1_PCODE prefix)
- `county_name` — county name
- `population` — total population (T_TL)
- `poverty_rate` — poverty headcount ratio (0-100)
- `facility_count` — number of health facilities in ward
- `travel_time_minutes` — modelled travel time to nearest facility

## Validation

All data is validated using [Zod](https://zod.dev) schemas at every stage:
- Ward rows: `WardRowSchema` — checks required fields, numeric bounds
- Indicator records: `IndicatorRecordSchema` — validates county_code, population range, poverty 0-100%, facility counts, travel time, coverage rates, date format

## Adding a new data source

1. Create a `fetch-<source>.ts` script that writes to `data/raw/`
2. Update `aggregate-wards.ts` to read the new field
3. Update `build-snapshots.ts` to emit the new field into `county_indicators.json`
4. Update `IndicatorRecord` in `src/lib/adapters.ts`
