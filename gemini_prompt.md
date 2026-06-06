# Gemini Autonomous Guidance: Kenya Health Equity Map

## Current State

**Live URL:** https://kenya-health-equity.netlify.app
**Stack:** Next.js 15 (static export), Tailwind v4, TypeScript, deployed on Netlify
**Data:** Synthetic sample data for 47 Kenyan counties in `/data/snapshots/`

### What Exists

1. **Map** — CartoDB Positron base tiles, hover tooltips with PGS color swatch, click-to-select
2. **County sidebar** — PGS badge, comparative narrative (% rank vs other counties), component breakdown bars (travel time, poverty, population, facility density), raw stats with national averages, source attributions, Generate Brief + Download JSON buttons
3. **County rankings** — Top 5 / Bottom 5 by PGS, clickable rows
4. **Insights dashboard** — Summary cards (counties covered, facilities mapped, high-priority count)
5. **Compare page** — `/compare` with county-to-county table
6. **Methodology page** — `/method` documenting PGS formula, travel time modelling (KEMRI/AccessMod least-cost path), proxy rationale, limitations
7. **Regional Briefs** — `/brief?county=X` with A4 printable PDF layout (react-to-print), driver decomposition bars, limitations, inline citations
8. **Sources panel** — Collapsible grouped links (county boundaries, health facilities, population/poverty indicators, spatial modelling methods)
9. **Priority Gap Score** — Absolute-threshold normalization (travel_time/100, poverty/100, population/5M, facility_density/1 inverted) with fixed weights (40% accessibility, 30% vulnerability, 30% population pressure). Z-score variant also available.
10. **Travel time methodology** — KEMRI/Wellcome Trust friction surfaces + WHO AccessMod combined transport network model (walking speeds from ESA WorldCover land cover, motorized/manual speeds from OSM road classification, 100 m grid resolution)
11. **10 verified data sources** — Each with URL, license badge, inline citation; all cited in methodology, briefs, and footer

### What Is Sample / Not Yet Real

- All county indicator values are fabricated for demo (3 counties only: Mombasa, Nairobi, Kiambu — but the pipeline handles all 47)
- Travel time data is synthetic (no real AccessMod rasters processed)
- Facility data is simulated (no real KMHFR export ingested)
- Poverty proxies are fabricated (no real KIHBS/KDHS download)

### Code Architecture (Key Files)

- `src/lib/normalize.ts` — `normalizeCounty()` absolute thresholds, `normalizeCountyZScore()` + `computeZScoreParams()`
- `src/lib/scoring.ts` — `computePGS()` with `DEFAULT_WEIGHTS = { accessibility: 0.4, vulnerability: 0.3, populationPressure: 0.3 }`
- `src/lib/adapters.ts` — `REAL_SOURCES` with 10 `SourceEntry` objects (name, url, license, note, type)
- `src/lib/data-fetch.ts` — reads from `/data/snapshots/county_indicators.json` directly (no API proxy)
- `src/components/CountyDetails.tsx` — sidebar panel with progress bars, comparative narrative (percentile rank vs other counties), Generate Brief + Download JSON
- `src/components/CountyRankings.tsx` — top 5 / bottom 5 leaderboard
- `src/components/MapView.tsx` — Maplibre GL, CartoDB Positron tiles, click handler
- `src/components/SourcesPanel.tsx` — collapsible grouped source links
- `src/app/page.tsx` — main page: map + sidebar + rankings + dashboard
- `src/app/brief/page.tsx` — printable brief with A4 print CSS
- `src/app/method/page.tsx` — methodology docs
- `src/app/compare/page.tsx` — compare table
- `data/boundaries/counties_simplified.geojson` — 185 KB, mapshaper-simplified (5% Visvalingam)
- `scripts/etl/` — Zod-validated ETL pipeline (fetch-knbs, aggregate-wards, build-snapshots)
- `netlify.toml` — build config, SITE_URL = `https://kenya-health-equity.netlify.app`

### Design Constraints

- No dash characters (hyphens, en-dashes, em-dashes) in user-facing text
- No GitHub link in UI — platform projects institutional authority
- No API proxy layer — static JSON from `/data/snapshots/` directly
- Absolute-threshold PGS (fixed denominators), not relative min-max
- Every data point must have a verifiable source URL cited inline
- All source data must be from official Kenyan repositories or reputable international research programmes
- Warm accessible palette: stone + amber/orange/brown choropleth

## Task for Gemini

Analyze the current state of this project and **autonomously determine what needs to be done next** to make it the best possible version of itself. You have full context of what exists, what's sample, and the constraints.

Consider every dimension:
- **Data:** How to get real data for all 47 counties (KMHFR facility export, KIHBS/KDHS poverty, KNBS census, AccessMod travel time rasters)
- **UX/UI:** What's missing, what's confusing, what would make it more useful for policymakers
- **Technical:** Performance, offline support, PWA, Protomaps vector tiles, accessibility (screen readers, keyboard nav)
- **Analytics:** What additional metrics would add value (maternal health, immunization, bed net coverage)
- **Deployment:** CI/CD, GitHub Actions, edge caching
- **Credibility:** What would make this platform trusted by Ministry of Health stakeholders
- **Scale:** Beyond 47 counties — ward-level analysis? East Africa region?

Do NOT just list what I already know. Be creative, specific, and actionable. Prioritize ruthlessly — what are the top 3 things that would transform this from a demo into a real decision-support tool? For each recommendation, explain the why, the how, and the effort level.

Also flag anything that should be removed, renamed, or radically simplified.

Respond as a clear-headed strategic advisor, not a cheerleader. Be critical where warranted.
