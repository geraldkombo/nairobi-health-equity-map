# AI Agent: Kenya Health Equity Map — Complete to Production

Take this project from its current state to a complete, production-grade, institutional-quality civic intelligence platform for health equity across Kenya's 47 counties. All data must be real, verifiable, sourced from official Kenyan open data repositories and international research programmes. No mock data. No placeholders. No demos. Finish it once and for all.

---

## About the Project

Map-first civic intelligence platform that visualises health access inequities across Kenya's 47 counties using transparent open data. Built with Next.js 15 (static export), MapLibre GL JS, Tailwind CSS, and Zod.

**Production URL:** `https://ke-health-equity.netlify.app`

**Critical: Give it the best name possible.** `ke-health-equity` is a placeholder. Choose the best name autonomously — Netlify subdomain or custom domain, whatever you judge most authoritative and memorable. Must project institutional credibility for government and development stakeholders.

### Architecture

- **Frontend**: Next.js 15 static export, MapLibre GL JS, Tailwind CSS 4, Zod at data boundary
- **Backend**: Zero runtime backend. ETL pipeline runs pre-build as Node/TypeScript scripts
- **Data**: Static JSON in `public/data/snapshots/`, hydrated at build time
- **Deployment**: Netlify CLI — `netlify deploy --prod --dir=out`
- **Constraint**: No server-side rendering, no API routes, no serverless functions at request time

### Core Logic

- **Priority Gap Score (PGS)**: Composite index 0-100 combining accessibility (40%), vulnerability (30%), population pressure (30%)
- **Normalisation**: Absolute-threshold denominators — travel time/100, poverty/100, population per facility/10000, facilities per 10k people/4 inverted
- **PGS thresholds**: Low (<30), Medium (30-49), High (50-69), Critical (70+)
- **CountyDetails**: Computes percentile rank vs all 47 counties for comparative narrative
- **Choropleth colours**: `#FDE68A`/`#F59E0B`/`#EA580C`/`#78350F`
- **Map tiles**: CartoDB Positron (raster)

---

## Current State

### ETL Pipeline (`scripts/etl/`)

```
scripts/etl/
├── 1-extract-kmhfr.ts     # Paginates KMHFR API → raw-data/kmhfr_facilities_raw.json
├── 2-extract-knbs.ts       # Parses KNBS Census CSV → raw-data/knbs_demographics.json
├── 3-extract-spatial.ts    # Parses travel time CSV → raw-data/county_travel_times.json
├── 4-build-snapshot.ts     # Joins all 3 → data/snapshots/county_indicators.json
├── lib/
│   ├── api-client.ts       # fetchWithRetry() exponential backoff
│   ├── county-names.ts     # Sanitizer, ID creator, title case
│   └── zod-schemas.ts      # Zod schemas for every data boundary
└── raw-data/               # Git-ignored staging
```

Run via `npm run etl` (sequential: extract → knbs → spatial → build).

### Data Sources Status

| Source | Status | Action Needed |
|--------|--------|---------------|
| KNBS 2019 Census (population) | DONE — 47-county CSV | Verified |
| KDHS 2022 (poverty rates) | DONE — 47-county CSV | Verified |
| KMHFR API (facilities) | BLOCKED — `https://api.kmhfr.health.go.ke/api/facilities/facilities/` returns 401 | Needs credentials from `helpdesk@nphl.go.ke`; falls back to synthetic (5,069 facilities) |
| ICPAC/KEMRI facilities | NOT USED — 200 facilities at `https://geoportal.icpac.net/layers/geonode:kenya_health_facilities` | Alternative to KMHFR |
| Travel times | DONE — CSV with literature-based estimates | Replace with real AccessMod outputs |
| County boundaries GeoJSON | DONE — 185 KB (simplified 92%) | Verified |
| Facility GPS coordinates | NOT DONE — no points layer on map | Need real data from #1 |

### Current Snapshot Output (47 counties)

```json
{
  "county_code": "turkana",
  "county_name": "Turkana",
  "population": 926976,
  "facility_count": 67,
  "facility_density_proxy": 0.72,
  "poverty_proxy": 79.4,
  "travel_time_to_facility_proxy": 125,
  "immunization_coverage": 0,
  "skilled_birth_attendance": 0,
  "updated_at": "2026-06-06"
}
```

`immunization_coverage` and `skilled_birth_attendance` are set to 0 and unused in UI — populate from KNBS/KDHS or remove from schema.

---

## What Must Be Completed (Execution Order)

### 1. LIVE HEALTH FACILITY DATA (Highest Priority)

Unblock the KMHFR API (401 Unauthorized). Two paths:
- **Path A**: Obtain API credentials from `helpdesk@nphl.go.ke`, add as env vars to `1-extract-kmhfr.ts`
- **Path B**: Switch to ICPAC/KEMRI dataset — download GeoJSON from `https://geoportal.icpac.net/layers/geonode:kenya_health_facilities`, write `1b-extract-icpac.ts`

Target: ~8,000-9,000 operational public/faith-based facilities.

### 2. FACILITY POINTS MAP LAYER

Add Maplibre GL points layer from facility data:
- Colour-coded by KEPH level (Level 2 dispensary, Level 3 health centre, Level 4/5 hospital)
- Clickable popup: name, type, owner, ward
- Clustered at low zoom (Maplibre GL cluster source)
- Filterable by facility type from a legend
- `src/lib/data-fetch.ts` already has `fetchFacilities()` — wire it up

### 3. REAL TRAVEL TIME RASTERS

Replace literature-based CSV with modelled data:
- Download friction surface from KEMRI/Wellcome Trust
- Run WHO AccessMod 5 least-cost path algorithm → county-level mean travel times
- Update `county_travel_times.csv`
- Or: source published county-level travel time estimates from KEMRI/Wellcome Trust research

### 4. GITHUB ACTIONS CI/CD

Automated deploy pipeline:
- On push to `master`: `npm run etl` → `npm run build` → `netlify deploy --prod --dir=out`
- Secrets: `NETLIFY_AUTH_TOKEN = nfp_vaFgTwyn4sDj1LaZEuDf1stxaUCzaqZ86f7f`, `NETLIFY_SITE_ID = 9bf4da5c-326a-400e-8bb3-5548fc58994e`
- Scheduled weekly ETL to refresh facility data

### 5. PWA OFFLINE SUPPORT

Service Worker with IndexedDB:
- Cache map tiles (CartoDB Positron via CDN)
- Cache `county_indicators.json` and boundaries GeoJSON
- Register via `next-pwa` or custom `sw.js`
- Critical for ASAL regions with poor connectivity

### 6. OPEN GRAPH + SOCIAL SHARING

- Unique OG image per county (county name + PGS score + map thumbnail)
- JSON-LD structured data via `next-seo` or manual `<script>` injection
- Twitter/Facebook social preview cards

### 7. PROTOTILES VECTOR TILES

Replace CartoDB Positron raster with self-hosted Protomaps `.pmtiles`:
- Download Kenya OSM from Geofabrik
- Run `planetiler` → Kenya `.pmtiles`
- Host on Netlify, serve via `pmtiles` protocol in MapLibre
- Removes CDN dependency, improves offline capability

### 8. DATA USE AGREEMENT PAGE

Create `/dua` route with:
- Plain-language data use agreement
- Every data source cited: URL, license, access date
- Attribution requirements for KNBS, KEMRI, MoH, ICPAC, ESA, OSM
- Suggested citation format

### 9. ADDRESS LIMITATIONS IN UI

| Current Limitation | Mitigation |
|--------------------|------------|
| Proxy indicators, not clinical outcomes | Add disclaimer; link to MoH KHIS Portal for clinical data |
| Facility coverage limited to ICPAC/KEMRI | Fix by completing #1 |
| County-level masks within-county disparities | Add ward-level tab when data available; note in UI |
| No quality-of-care dimension | Link to WHO SARA assessment reports |
| Default weights unvalidated | Add stakeholder config panel to tweak weights |
| Travel time uncertainty | Show confidence intervals or data vintage on method page |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `scripts/etl/1-extract-kmhfr.ts` | KMHFR API extraction with retry + synthetic fallback |
| `scripts/etl/4-build-snapshot.ts` | Final aggregator joining all 3 sources |
| `scripts/etl/lib/zod-schemas.ts` | All Zod schemas for data validation |
| `scripts/etl/lib/county-names.ts` | County name sanitizer (handles Murang'a, Tharaka-Nithi, etc.) |
| `src/lib/scoring.ts` | PGS engine with 0-100 output |
| `src/lib/normalize.ts` | Absolute-threshold normalisation |
| `src/lib/adapters.ts` | TypeScript interfaces + REAL_SOURCES citations |
| `src/lib/data-fetch.ts` | Client-side data loading from `/data/snapshots/` |
| `src/components/MapView.tsx` | MapLibre GL map with resize handler |
| `src/components/CountyDetails.tsx` | County sidebar with percentile-rank narrative |
| `src/components/SourcesPanel.tsx` | Collapsible source link list |
| `src/app/page.tsx` | Home page with legend + dashboard |
| `netlify.toml` | Build config, CSP headers, redirects |
| `package.json` | Scripts: `etl`, `build`, `dev` |

---

## Verification Steps

After each change:
1. `npm run etl` — must exit 0 with 47 counties validated
2. `npm run build` — must exit 0 with 0 errors, 6 static routes
3. `netlify deploy --prod --dir=out` — must succeed, HTTP 200 on production URL
4. Visit every route: `/`, `/method`, `/compare`, `/brief?county=1`, `/dua`
5. Test on mobile Chrome, desktop Firefox, print PDF brief
6. Verify all data points have source URLs in SourcesPanel
7. Verify no em dashes or hyphens in user-facing text
8. Verify GeoJSON boundary codes match county_codes in snapshot

## Credentials

- **Netlify token**: `nfp_vaFgTwyn4sDj1LaZEuDf1stxaUCzaqZ86f7f`
- **Netlify site ID**: `9bf4da5c-326a-400e-8bb3-5548fc58994e`
- **Production URL**: `https://ke-health-equity.netlify.app`
- **KMHFR API**: `https://api.kmhfr.health.go.ke/api/facilities/facilities/` — contact `helpdesk@nphl.go.ke` for credentials
