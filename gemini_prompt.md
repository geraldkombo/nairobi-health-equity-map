# Gemini Agent: Complete Kenya Health Equity Map to Production

You are an autonomous coding agent. Execute every step below in order. Create, edit, and delete files. Run commands. Verify each step. Do not stop until all tasks are complete or blocked by a credential you cannot obtain.

## Role & Constraints

- **Zero runtime backend.** No API routes, no serverless functions, no SSR at request time. All data is static JSON hydrated at build.
- **All data must be real and verifiable.** Every data point must have a source URL cited in the UI.
- **PGS uses absolute-threshold denominators** (not relative min-max). Scores are stable across data refreshes.
- **Plain language in UI.** No em dashes, en dashes, or hyphens in user-facing text.
- **Warm stone palette.** CartoDB Positron tiles, cream/amber/orange/brown choropleth (`#FDE68A`/`#F59E0B`/`#EA580C`/`#78350F`).
- **Maximum file size for any single file: 150 lines.** Break large files into sub-components.

## Project Overview

Map-first civic intelligence platform visualising health access inequities across Kenya's 47 counties using transparent open data.

**Production URL:** https://ke-health-equity.netlify.app
**Stack:** Next.js 15 (static export), MapLibre GL JS, Tailwind CSS 4, Zod, TypeScript
**Deployment:** Git push to master → GitHub Actions → Netlify

## Current State (Things That Work)

### Source Files Present
```
src/
├── app/
│   ├── error.tsx              # Error boundary
│   ├── global-error.tsx       # Global error boundary
│   ├── globals.css            # Tailwind v4 + custom theme
│   ├── layout.tsx             # Root layout with OG metadata
│   ├── not-found.tsx          # 404 page
│   ├── page.tsx               # Home: map + legend + dashboard
│   ├── sitemap.ts             # Auto-generated sitemap
│   ├── brief/page.tsx         # County brief (client-side, useSearchParams)
│   ├── compare/page.tsx       # County comparison (client-side)
│   └── method/page.tsx        # Methodology page
├── components/
│   ├── CompareView.tsx        # Side-by-side county comparison
│   ├── CountyDetails.tsx      # Sidebar with PGS + percentile rank
│   ├── CountyRankings.tsx     # Ranked table of all 47 counties
│   ├── Header.tsx             # Site header + navigation
│   ├── HowToUse.tsx           # Expandable instructions panel
│   ├── InsightsDashboard.tsx  # Key metrics dashboard
│   ├── MapErrorBoundary.tsx   # Error boundary for MapLibre
│   ├── MapView.tsx            # MapLibre GL map with choropleth
│   ├── ModeToggle.tsx         # Dark/light mode toggle
│   ├── SourcesPanel.tsx       # Collapsible data source citations
│   └── WeightsControl.tsx     # PGS weight adjustment sliders
└── lib/
    ├── adapters.ts            # TypeScript interfaces + REAL_SOURCES
    ├── data-fetch.ts          # fetchCountyIndicators(), fetchCounties()
    ├── geo.ts                 # Kenya map center/bounds
    ├── normalize.ts           # Absolute-threshold normalisation
    └── scoring.ts             # PGS engine (0-100 integer output)
```

### ETL Pipeline Present
```
scripts/etl/
├── 1-extract-kmhfr.ts         # Paginates KMHFR API → synthetic fallback (5,069 facilities)
├── 2-extract-knbs.ts          # Parses KNBS Census CSV → 47 counties
├── 3-extract-spatial.ts       # Parses travel time CSV → 47 counties
├── 4-build-snapshot.ts        # Joins all 3 → county_indicators.json
└── lib/
    ├── api-client.ts          # fetchWithRetry() exponential backoff
    ├── county-names.ts        # Sanitizer, ID creator, title case
    └── zod-schemas.ts         # Zod schemas for every data boundary
```

### Config Files Present
- `package.json` (Next.js 15, MapLibre GL JS, Tailwind CSS 4, Zod, tsx)
- `next.config.ts` (static export, output: export, trailingSlash: true)
- `tsconfig.json`
- `postcss.config.js`
- `netlify.toml` (build config, CSP, redirects)
- `.nvmrc` (Node 22)
- `.gitignore`
- `.github/workflows/deploy.yml` (GitHub Actions → Netlify)

### Data Files Present (in root `/data/`)
- `data/snapshots/county_indicators.json` — 47 validated counties with real KNBS population, KDHS poverty rates, literature-based travel times, synthetic facility counts
- `data/snapshots/counties.json` — county ID/name lookup
- `data/snapshots/facilities.json` — 155 facility locations (GeoJSON)
- `data/snapshots/indicator_records.json` — Nairobi ward-level data
- `data/snapshots/wards.json` — ward name lookup
- `data/boundaries/counties_simplified.geojson` — 189 KB simplified boundaries
- `data/facilities/facilities.geojson` — facility locations
- `data/indicators/county_indicators.csv`
- `data/indicators/ward_indicators.csv`

### Build Status
- `npm run etl` → 47 counties validated, writes to `data/snapshots/county_indicators.json`
- `npm run build` → 0 errors, 0 warnings, 6 static pages (/, /brief, /compare, /method, /_not-found, /sitemap.xml)
- Production URL: https://ke-health-equity.netlify.app (HTTP 200, deployed)

## What MUST Be Done (Execution Order)

### Tier 1 — Critical (Complete These First)

#### 1. Fix County Comparison Page
**Problem:** `/compare` page renders client-side with no server-side data. It fetches JS but the county dropdowns are empty because the component expects data to be pre-loaded.

**Fix:** Rewrite `src/app/compare/page.tsx` to pass county data from the snapshot JSON at build time. The page should be a server component that imports `county_indicators.json` directly, then passes it as props to a client `CompareView` component.

```tsx
// src/app/compare/page.tsx
import countyData from "@/data/snapshots/county_indicators.json";
import CompareClient from "./CompareClient";

export default function ComparePage() {
  return <CompareClient counties={countyData} />;
}
```

The client component should:
- Show two dropdowns for selecting counties
- Display side-by-side comparison of PGS, components, and key metrics
- Use conditional rendering (no `useSearchParams` needed for this)

#### 2. Fix County Brief Page
**Problem:** Uses `useSearchParams` which requires `Suspense` boundary in Next.js 15 static export.

**Fix:** Wrap in Suspense as required by Next.js 15:
```tsx
// src/app/brief/page.tsx
import { Suspense } from "react";
import BriefContent from "./BriefContent";

export default function BriefPage() {
  return (
    <Suspense fallback={<div>Loading county data...</div>}>
      <BriefContent />
    </Suspense>
  );
}
```

#### 3. Add Facility Points Map Layer
**Problem:** `data-fetch.ts` has `fetchFacilities()` but MapView.tsx doesn't render facility points.

**Fix:** In MapView.tsx, after the county choropleth layer, add:
- A GeoJSON source for facilities
- A clustered circle layer (unclustered at zoom >= 12)
- Color code by facility type (F_TYPE):
  - 1 = National/County Hospital → red (`#DC2626`)
  - 2 = Sub-district Hospital → orange (`#EA580C`)
  - 3 = Health Centre → amber (`#F59E0B`)
  - 4 = Dispensary → cream (`#FDE68A`)
- Click popup showing name, type, owner
- Cluster counts at low zoom

#### 4. Add Data Use Agreement Page
Create `src/app/dua/page.tsx` with:
- Plain-language data use agreement
- Every data source cited with URL, license, access date
- Attribution requirements for KNBS, KEMRI, MoH, ICPAC, OSM
- Suggested citation format
- Link to MoH KHIS Portal for clinical data

#### 5. Add OG Images
Add `src/app/opengraph-image.tsx` or create static OG images. Since we're static export, create a simple HTML-based OG image at build time or use `metadataBase` in layout.tsx with a static PNG.

Minimum: ensure `/brief?county=1` generates a unique title tag per county.

#### 6. Fix netlify.toml Redirects
Remove old redirects for `/brief`, `/compare`, `/method` to `.html` files (those were for the old static site). The Next.js static export already handles routing via `out/brief/index.html`.

Current netlify.toml already has this fixed — just verify:
```toml
[build]
  command = "npm run build"
  publish = "out"
```

#### 7. Delete Old Stale Files
These files are stale and should be deleted:
- `scripts/etl/2-build-snapshot.ts` (superseded by `4-build-snapshot.ts`)
- `README.md` (outdated)
- `abstract_final.md`, `submission_final.md` (research artifacts, not needed in repo)

### Tier 2 — Data Quality

#### 8. Populate immunization_coverage and skilled_birth_attendance
**Problem:** Both fields are `0` in `county_indicators.json` and unused in UI.

**Fix:** Source county-level DPT3 immunization coverage and skilled birth attendance from KNHS/KDHS 2022 data. Add to `2-extract-knbs.ts` or create a new extraction script. Update Zod schema.

If data cannot be found, remove these fields from the Zod schema and `IndicatorRecord` interface.

#### 9. Improve Synthetic KMHFR Data
**Problem:** 5,069 synthetic facilities when real count is ~8,000-9,000.

**Fix:** Make the synthetic generator in `1-extract-kmhfr.ts` more realistic:
- Distribute facilities by county population (more populated = more facilities)
- Assign realistic F_TYPE ratios (60% dispensary, 20% health centre, 15% hospital, 5% other)
- Spread coordinates within county boundaries using simple jitter around county centroid
- Document clearly in code: "SYNTHETIC FALLBACK — replace with real KMHFR API data when credentials obtained"

#### 10. Source Real Travel Times
**Problem:** Literature-based estimates, not real AccessMod outputs.

**Fix:** Find published county-level mean travel time estimates from KEMRI/Wellcome Trust research papers. Update `3-extract-spatial.ts` to read from a published source CSV. Cite the paper URL in the source data.

### Tier 3 — Infrastructure

#### 11. Clean Up GitHub Actions Workflows
**Problem:** Two workflow files exist: `deploy.yml` and `main.yml`. Only `deploy.yml` is needed.

**Fix:** Delete `.github/workflows/main.yml`. The deploy workflow needs these GitHub repository secrets set:
- `NETLIFY_AUTH_TOKEN` = `nfp_vaFgTwyn4sDj1LaZEuDf1stxaUCzaqZ86f7f`
- `NETLIFY_SITE_ID` = `9bf4da5c-326a-400e-8bb3-5548fc58994e`

#### 12. Verify All Routes Render
After each change, visit:
- `/` — map loads, legend visible, counties coloured by PGS
- `/brief?county=mombasa` — brief loads with correct data
- `/compare` — two dropdowns work, comparison renders
- `/method` — methodology text renders, sources panel works
- `/dua` — data use agreement renders
- `/_not-found` — custom 404 page

### Tier 4 — Polish (If Time Permits)

#### 13. PWA Offline Support
Add a service worker that caches:
- Map tiles (CartoDB Positron from CDN)
- `county_indicators.json` and boundaries GeoJSON
- The app shell (HTML, JS, CSS)

Use a custom `sw.js` in `public/` with a simple cache-first strategy for data files and network-first for tiles. Register in `layout.tsx`.

#### 14. Protomaps Vector Tiles
Replace CartoDB Positron raster tiles with self-hosted Protomaps `.pmtiles` for offline capability:
- Download Kenya OSM extract from Geofabrik
- Run planetiler to generate `kenya.pmtiles`
- Serve from `public/data/tiles/kenya.pmtiles`
- Use `maplibre-gl-protomaps` addon or `pmtiles://` protocol

#### 15. Interactive Weights Control
The `WeightsControl.tsx` component exists but may not be wired. Make it functional:
- Three sliders for accessibility (0.4), vulnerability (0.3), population pressure (0.3)
- When changed, recompute PGS client-side and recolor the map
- Reset to defaults button

## Key Technical Details

### PGS Scoring Formula (src/lib/scoring.ts)
```typescript
accessibility = norm.travelTime * 0.6 + norm.facilityDensity * 0.4
vulnerability = norm.poverty
popPressure = norm.populationPressure

rawPgs = accessibility * 0.4 + vulnerability * 0.3 + popPressure * 0.3
pgs = Math.round(rawPgs * 100)  // 0-100 integer
```

### Normalisation Denominators (src/lib/normalize.ts)
| Field | Denominator | Formula |
|-------|------------|---------|
| travel_time | 100 | value / 100 |
| poverty | 100 | value / 100 |
| population_per_facility | 10000 | value / 10000 (capped at 1) |
| facilities_per_10k | 4 | 1 - (value / 4) (inverted, floored at 0) |

### PGS Thresholds
- **Low:** < 30 (`#FDE68A` — light yellow)
- **Medium:** 30-49 (`#F59E0B` — amber)
- **High:** 50-69 (`#EA580C` — orange)
- **Critical:** 70+ (`#78350F` — dark brown)

### County Code Mapping (for GeoJSON join)
County boundaries GeoJSON has `county_code` as integer (1-47) and `county_name` as uppercase string. County indicators use lowercase string codes with hyphens for multi-word names.

Join via `counties.json` which maps: `{ "id": "1", "name": "MOMBASA" }` → lowercase → match `county_indicators[].county_name`.

Key mappings:
```
1 → mombasa, 2 → kwale, 3 → kilifi, 4 → tana-river, 5 → lamu,
6 → taita-taveta, 7 → garissa, 8 → wajir, 9 → mandera,
10 → marsabit, 11 → isiolo, 12 → meru, 13 → tharaka-nithi,
14 → embu, 15 → kitui, 16 → machakos, 17 → makueni,
18 → nyandarua, 19 → nyeri, 20 → kirinyaga, 21 → muranga,
22 → kiambu, 23 → turkana, 24 → west-pokot, 25 → samburu,
26 → trans-nzoia, 27 → uasin-gishu, 28 → elgeyo-marakwet,
29 → nandi, 30 → baringo, 31 → laikipia, 32 → nakuru,
33 → narok, 34 → kajiado, 35 → kericho, 36 → bomet,
37 → kakamega, 38 → vihiga, 39 → bungoma, 40 → busia,
41 → siaya, 42 → kisumu, 43 → homa-bay, 44 → migori,
45 → kisii, 46 → nyamira, 47 → nairobi
```

### MapLibre GL Initialisation (MapView.tsx)
```typescript
import maplibregl from "maplibre-gl";
// Center: [37.9062, 0.0236], zoom: 6
// Max bounds: Kenya extent
// CartoDB Positron tile URL: https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
```

### Facility Type to KEPH Level Mapping
| F_TYPE | Meaning | KEPH Level | Colour |
|--------|---------|------------|--------|
| 1 | National/County Hospital | 4-5 | `#DC2626` (red) |
| 2 | Sub-district Hospital | 4 | `#EA580C` (orange) |
| 3 | Health Centre | 3 | `#F59E0B` (amber) |
| 4 | Dispensary | 2 | `#FDE68A` (cream) |

## Verification Commands

Run after each milestone:
```bash
npm run etl           # Must exit 0, output 47 counties
npm run build         # Must exit 0, 0 errors, 0 warnings, 6+ routes
npx serve out         # Test locally on port 3000
```

## Credentials
- **Netlify token:** `nfp_vaFgTwyn4sDj1LaZEuDf1stxaUCzaqZ86f7f`
- **Netlify site ID:** `9bf4da5c-326a-400e-8bb3-5548fc58994e`
- **GitHub repo:** `https://github.com/geraldkombo/nairobi-health-equity-map`
- **KMHFR API:** `https://api.kmhfr.health.go.ke/api/facilities/facilities/` — blocked (401), contact `helpdesk@nphl.go.ke`

## Stop Conditions
Stop and report if:
- Any `npm run etl` or `npm run build` fails and you cannot fix it
- A credential is required that you cannot obtain
- You need clarification on a design decision
