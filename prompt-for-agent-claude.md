# Kenya Health Equity Map — Agent Briefing

## Project Overview

Static Next.js 15 site (SSG + client hydration) mapping health equity across Kenya's 47 counties using the **Priority Gap Score (PGS)** — a composite 0-100 index weighted from 4 normalized proxies: facility density, travel time, poverty rate, population pressure.

- **GitHub Pages**: https://geraldkombo.github.io/nairobi-health-equity-map/ (basePath: `/nairobi-health-equity-map`)
- **Netlify**: https://kenya-health-equity-map.netlify.app (no basePath)
- **Stack**: Next.js 15, MapLibre GL JS (CartoDB Positron tiles), ECharts, Zod-validated ETL pipeline

## Issues to Fix

### Critical

#### 1. Nairobi facility cluster circle is too large on map

In `src/components/MapView.tsx`, the facility clustering makes a big circle over Nairobi because:
- `clusterRadius: 50` groups facilities within 50px
- Circle radius step: `[15, 10, 20, 50, 25]` — clusters with ≥50 facilities get radius 25
- Nairobi has 136 facilities (94 with coordinates) in `data/facilities/facilities.geojson`, so its cluster gets the max radius
- At initial zoom 5.2, this obscures the county boundary

**Fix**: Reduce cluster circle radii (e.g., max 12-15), increase clusterMaxZoom to 14, or use smaller clusterRadius (e.g., 30). Consider hiding cluster circles below a zoom threshold or using a heatmap layer instead. Reference MapLibre GL clustering docs: https://maplibre.org/maplibre-gl-js/docs/examples/clusters/

#### 2. KMHFR API blocked (401), synthetic facilities have null lat/long

`scripts/etl/1-extract-kmhfr.ts` tries `https://api.kmhfr.health.go.ke/api/facilities/facilities/` but API returns 401. Falls back to `generateSyntheticFacilities()` which creates ~4,800 facilities **with null lat/long** — they cannot render on the map.

**What to try**:
- Scrape KMHFR via alternative endpoints or with different auth (some public health APIs use tokens)
- Try the Health Kenya FHIR API or HMIS portal
- Try the HKHIS API: https://hiskenya.org/api/
- If API truly unavailable, use the existing `data/facilities/facilities.geojson` (155 facilities, 108 with coordinates) as the base and improve facility distribution by allocating coordinates per county
- **Minimum viable fix**: Replace the synthetic generator with a script that assigns realistic coordinates to facilities within each county polygon, distributed proportionally by population

#### 3. ETL pipeline cannot run end-to-end

Refer to `package.json` scripts:
```
npm run etl  → etl:extract → etl:knbs → etl:spatial → etl:build
```

Two scripts require CSV input files that do not exist:
- `scripts/etl/2-extract-knbs.ts` needs `scripts/etl/raw-data/knbs_demographics.csv` (47 rows: county_name, population, poverty_rate)
- `scripts/etl/3-extract-spatial.ts` needs `scripts/etl/raw-data/county_travel_times.csv` (47 rows: county_name, mean_travel_time)

**Data to find**:
- **KNBS demographics**: Kenya National Bureau of Statistics 2019 census population by county + poverty rates from KNBS/KDHS. Source: https://www.knbs.or.ke/county-statistics-at-a-glance/ or https://www.knbs.or.ke/download/2019-kenya-population-and-housing-census-volume-ii-distribution-of-population-by-administrative-units/
- **Travel times**: Mean travel time to nearest health facility by county. Try: https://malariaatlas.org/ (MAP project travel time rasters), or use WHO/UNICEF data. If unavailable, use a reasonable proxy based on road density/population.
- **KDHS immunization + SBA**: Already in `data/indicators/county_indicators.csv` from KDHS 2022. Validate values against: https://dhsprogram.com/data/ (Kenya DHS 2022)

#### 4. `data/raw/county_indicators.csv` schema is wrong

Only 3 entries with misordered columns (county_code and county_name swapped, SBA/immunization columns broken). This file should match the schema in `data/indicators/county_indicators.csv` which has all 47 counties with correct values. Consider replacing or deleting `data/raw/county_indicators.csv`.

### Important

#### 5. Facilities GeoJSON limited coverage

`data/facilities/facilities.geojson` has only 155 facilities from a 2008 ICPAC dataset, concentrated in 4 areas (Nairobi=136, Kiambu=15, Kajiado=2, Machakos=1, Thika=1). 47 have null coordinates.

- **Fix**: Merge with ~400 facilities from the HMIS/KHIS portal or use OpenStreetMap health facilities for Kenya: https://overpass-api.de/api/interpreter
- Overpass query: fetch all `amenity=hospital|clinic|health_post` in Kenya

#### 6. County boundary GeoJSON quality

Check `data/boundaries/counties_simplified.geojson` and `data/boundaries/counties.geojson`:
- Do they have all 47 counties with correct county_code?
- Are the geometries simplified enough for web rendering?
- Source should be: https://data.humdata.org/dataset/kenya-administrative-boundaries or ILRI

#### 7. PGS scoring uses synthetic proxies

`src/lib/scoring.ts` computes PGS from normalized components. The raw values come from the ETL snapshot (`county_indicators.json`). Currently:
- `population` from KNBS 2019 census (should be validated)
- `facility_count` from KMHFR (currently synthetic)
- `travel_time_to_facility_proxy` synthetic (defaults to 60 for missing counties)
- `poverty_proxy` needs source verification
- `immunization_coverage` from KDHS 2022 (validated)
- `skilled_birth_attendance` from KDHS 2022 (validated)

#### 8. Source citation URLs need verification

All DUA page citations in `src/app/dua/page.tsx` should have working, permanent URLs. Verify:
- KNBS census data links
- KDHS indicator links
- KMHFR facility registry links

## How to Work

1. **Read first**: All ETL scripts, components, lib files are in `scripts/etl/`, `src/components/`, `src/lib/`, `src/app/`
2. **Data investigations**: Use web search/fetch to find real data sources. Document each source URL found.
3. **Make changes**: Edit files directly — the entire project is local at `C:\Users\Rosemary\Downloads\New folder (5)\nairobi-health-equity-map`
4. **Run ETL after changes**: `npm run etl:extract` (or each step individually), then `npm run etl:build`
5. **Rebuild site after fixes**: `npm run build` generates `out/` folder. Verify with `npx serve out`
6. **Deploy**: CLI deploys both to GitHub Pages (via `git push`) and Netlify (via `netlify deploy --dir=out --site-name=kenya-health-equity-map --auth=<token> --prod --no-build`)

## Useful Commands

```bash
npm run etl:extract   # Step 1: KMHFR facilities
npm run etl:knbs      # Step 2: KNBS demographics (needs CSV)
npm run etl:spatial   # Step 3: Travel times (needs CSV)
npm run etl:build     # Step 4: Build snapshot
npm run etl           # All 4 steps
npm run build         # Build Next.js site
```

## Netlify Token

`nfp_Ypr3vPSipcSRBUAQzVBxWxtiobCJ3pDn0422` (account: pressbeatbroadcasting@gmail.com, ~100 credits remaining)

## Key Files

| File | Purpose |
|------|---------|
| `scripts/etl/1-extract-kmhfr.ts` | KMHFR API fetch + synthetic fallback |
| `scripts/etl/4-build-snapshot.ts` | Merges all data into final snapshot |
| `data/indicators/county_indicators.csv` | KDHS immunization + SBA (47 counties, real data) |
| `data/facilities/facilities.geojson` | 155 ICPAC facilities (limited coverage) |
| `src/lib/scoring.ts` | PGS computation logic |
| `src/lib/county-names.ts` | County name normalization/matching |
| `src/components/MapView.tsx` | MapLibre GL map with facility clusters |
| `src/app/layout.tsx` | Base layout, metadata, PWA registration |
| `public/manifest.json` | PWA manifest (relative paths) |
| `data/boundaries/counties_simplified.geojson` | County boundaries for map |
| `data/snapshots/county_indicators.json` | Final merged data used by frontend |

## Priority Order

1. **Fix Nairobi cluster circle** — quick visual fix, map-centric improvement
2. **Fix KMHFR facility data** — get real facilities with coordinates (this is the core data gap)
3. **Create KNBS demographics CSV** — find real population + poverty data
4. **Create travel times CSV** — find or estimate travel times
5. **Run complete ETL pipeline** — regenerate snapshot with real data
6. **Validate all citations** — ensure DUA page links work

## Success Criteria

- `npm run etl` completes with 47 counties and no warnings
- Facilities are visible on map with real coordinates
- Nairobi cluster circle no longer obscures county boundaries
- All 47 counties have non-zero facility counts
- No synthetic data remains (all values have verified sources)
