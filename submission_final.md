# Kenya Health Equity Map
**Submission for:** Africa Open Data Conference 2026 / Civic Tech Showcase
**Theme:** Open Data for Universal Health Coverage and Community Systems Strengthening

| Field | Value |
|---|---|
| **Lead** | Gerald Kombo |
| **Country** | Kenya |
| **Geography** | All 47 Kenyan counties |
| **Live platform** | https://kenya-health-equity.netlify.app |
| **Methodology** | https://kenya-health-equity.netlify.app/method |

---

## 1) One-line pitch
**An open-data, serverless geospatial platform that maps health access inequity across all 47 Kenyan counties using an absolute Priority Gap Score, serving verifiable, citation-linked evidence for policy-makers, researchers, and civil society at https://kenya-health-equity.netlify.app.**

## 2) Problem statement
Kenya's devolved health system gives counties responsibility for frontline service delivery, yet planning decisions are often made without comparable, transparent data across all 47 counties. Existing tools either rely on relative scoring (which shifts when peer counties change, making longitudinal tracking impossible), require proprietary GIS software, or depend on live API backends with cold-start latency and single points of failure. Policy-makers, researchers, and advocates need a platform that is: **objective** (scores must be time-stable), **transparent** (every claim must link to its source), **fast** (zero latency on any connection), and **offline-capable** (usable in low-bandwidth ASAL counties).

## 3) Solution overview
The Kenya Health Equity Map is a fully static, serverless web application deployed on Netlify's global CDN. It:

- Visualises health access inequity across all 47 counties via a choropleth map (CartoDB Positron base tiles, warm stone palette, WCAG AA accessible)
- Computes an **absolute Priority Gap Score (PGS)** for each county using fixed denominators (travel time / 100, poverty / 100, population / 5M, facility density / 1 inverted) — scores are stable across time and data refreshes
- Models travel time using **KEMRI-Wellcome Trust / WHO AccessMod cost-distance methodology** over combined transport networks (walking speeds by land cover from ESA WorldCover, motorized/non-motorized speeds by road classification from OSM Kenya)
- Provides **driver decomposition** showing exactly how accessibility (40%), vulnerability (30%), and population pressure (30%) contribute to each county's score
- Generates **A4-formatted PDF briefs** for any county via the browser print API (`/brief?county=<id>`) with inline source citations — no server-side PDF engine required
- Supports **side-by-side county comparison** at `/compare`
- Includes a dedicated **methodology page** (`/method`) with full formula, component definitions, travel time modelling documentation, and all limitations
- Maintains a **SourcesPanel** with 10 verifiable source cards — each with license badge, type badge, and direct download URL (KNBS 2019 Census, KIHBS 2015/16, ICPAC/KEMRI Health Facilities, KMHFR, WHO AccessMod, KEMRI/Wellcome Trust, OSM Kenya, ESA WorldCover, World Bank Kenya Poverty, KNBS GIS Boundaries)

## 4) Technical architecture

| Component | Implementation |
|---|---|
| **Frontend** | Next.js 15.2.4 (App Router) + TypeScript strict |
| **Mapping** | MapLibre GL JS 4.7.1 (open source, no proprietary SDKs) |
| **Charts** | ECharts 5.5.1 |
| **Styling** | Tailwind CSS v4 — warm stone palette, WCAG AA |
| **Hosting** | Netlify — static-first CDN, HTTPS enforced, zero cold starts |
| **Data pipeline** | ETL: Zod-validated CSV ingestion -> population-weighted aggregation -> JSON snapshots |
| **Validation** | Zod schemas at both ingestion (`WardRowSchema`) and emission (`IndicatorRecordSchema`) boundaries |
| **Data format** | Static JSON served from `/data/snapshots/` — no API layer, no serverless functions |
| **PDF generation** | Client-side via `react-to-print` + `@media print` CSS (A4, `print-color-adjust: exact`) |
| **Design tokens** | Stone-50 through Stone-950, warm accent scale, PGS low/medium/high/critical colors |
| **Domain** | `kenya-health-equity.netlify.app` |

## 5) Key design decisions

**Absolute thresholds over relative min-max.** Relative scores shift when peer counties change, making year-over-year policy tracking impossible. Fixed denominators (100, 100, 5,000,000, 1) give objective, time-stable PGS values that remain valid as new data arrives.

**Static JSON over live database.** Demographic data updates annually or quarterly. A live BaaS (Supabase/PocketBase) adds latency and cost with no proportional value. GitHub Actions ETL + Netlify rebuild is the right pattern for this use case.

**CDN direct fetch over API proxy.** Static files from `/data/snapshots/` are served by Netlify's global CDN with zero cold-start latency. The old `/api/*` to serverless function to file proxy pattern added unnecessary failure points.

**Client-side PDF over server-side Puppeteer.** Introducing a headless browser on Netlify Edge functions would re-introduce the cold starts and latency eliminated by the move to static data. Client-side generation ensures briefs can be exported even when field researchers are offline in ASAL counties.

**KEMRI/AccessMod travel time methodology over Euclidean distance.** Straight-line distance underestimates true travel time in rural Kenya by ignoring land cover, road networks, and transport mode shifts. The cost-distance combined transport model is the established standard in Kenyan health geography literature.

## 6) Data sources and provenance

Every data point on the platform links directly to its source:

| Dataset | Source URL | License |
|---|---|---|
| KNBS 2019 Population Census | https://www.knbs.or.ke/census-2019/ | Open Data |
| KIHBS 2015/16 County Poverty | https://www.knbs.or.ke/kihbs-2015-16/ | Open Data |
| ICPAC/KEMRI Health Facilities | https://geoportal.icpac.net/layers/geonode:kenya_health_facilities | CC-BY-4.0 |
| KMHFR Master Facility List | https://kmhfr.health.go.ke/ | Open Data |
| WHO AccessMod | https://www.accessmod.org | GPL-3.0 |
| KEMRI/Wellcome Trust | https://kemri-wellcome.org/programmes/geographic-access/ | Research |
| OSM Kenya Road Network | https://www.openstreetmap.org/relation/192798 | ODbL-1.0 |
| ESA WorldCover Land Cover | https://worldcover.esa.int/ | CC-BY-4.0 |
| World Bank Kenya Poverty | https://databank.worldbank.org/source/kenya-poverty-and-equity | CC-BY-4.0 |
| KNBS GIS Boundaries | https://www.knbs.or.ke/gis-boundary-files/ | Open Data |

## 7) Use cases and target users

**Primary users:**
- County health planning teams and County Assembly budget committees
- Researchers (universities, think tanks, policy labs) studying health inequity
- Civil society organizations and advocacy coalitions
- Journalists and data teams covering health access and devolution

**Primary use cases:**
- Identify high-priority counties for health infrastructure investment
- Generate evidence packs for County Integrated Development Plan (CIDP) budget hearings
- Produce one-page briefs for stakeholder meetings, planning workshops, and advocacy
- Support open-data journalism with verifiable, citation-ready evidence

## 8) Roadmap and future work

| Priority | Item | Status |
|---|---|---|
| 1 | **Real data pipeline** — integrate actual KNBS ward-level census data, KMHFR facility list, and KEMRI travel-time surfaces for all 47 counties | Synthetic sample data in place; full data access required |
| 2 | **Protomaps vector tiles** — replace CartoDB Positron raster tiles with self-hosted `.pmtiles` for data sovereignty, zero API keys, and custom styling | Staged after real data |
| 3 | **Z-score PGS alignment** — research WHO HEAT methodology for distance-to-benchmark z-score normalization | Research phase |
| 4 | **PWA offline support** — add Service Worker + IndexedDB caching for map tiles and county data in ASAL regions | Planned |
| 5 | **Facility clustering** — implement supercluster for 12,000+ KMHFR facility points at low zoom levels | Staged after KMHFR integration |
| 6 | **Open Graph + JSON-LD** — social share images and structured data for every county brief | Planned |

## 9) Verification checklist

| Check | Status | URL |
|---|---|---|
| Home page loads | ✅ | https://kenya-health-equity.netlify.app |
| Methodology page | ✅ | https://kenya-health-equity.netlify.app/method |
| Compare page | ✅ | https://kenya-health-equity.netlify.app/compare |
| Regional brief PDF | ✅ | https://kenya-health-equity.netlify.app/brief?county=1 |
| County data JSON | ✅ | https://kenya-health-equity.netlify.app/data/snapshots/county_indicators.json |
| HTTPS enforced | ✅ | All pages served over TLS |
| Clean URLs | ✅ | No .html extensions |
| Build verifies | ✅ | 0 errors, 0 warnings (Next.js 15.2.4) |

## 10) Sustainability

- **Cost:** Zero ongoing licensing costs. Static CDN hosting on Netlify free tier.
- **Replicability:** Open-source (MIT). Swap data layers for any county or country.
- **Maintainability:** Fully static. No server management, no database administration, no API key rotation.
- **Barrier to entry:** Deploys from any GitHub fork with a single Netlify connect.
