# Nairobi Health Equity Map
**Submission for:** CSS Community Marketplace Exhibitor
**Theme focus:** Community Systems in the Era of Donor Transition and UHC

| Field | Value |
|---|---|
| **Applicant / Lead** | Gerald Kombo (Independent Developer) |
| **Country** | Kenya |
| **Demo geography** | Nairobi City County |
| **Contact** | geraldshikunyi@gmail.com |
| **Repository** | https://github.com/geraldkombo/nairobi-health-equity-map |
| **Live demo** | https://nairobi-health-equity-map.netlify.app |

---

## 1) One-line pitch
**A public, open-data Nairobi health equity map—live on Netlify at https://nairobi-health-equity-map.netlify.app—built for researchers and journalists, showing where access gaps are, why they matter, and how to verify the data behind every insight.**

## 2) Problem statement (why this matters now)
Donor transition and the shift toward domestic financing increase the stakes of *county-level prioritization*. Communities, investigators, and the media need evidence that is:
- **localized** (ward/sub-county differences are visible),
- **explainable** (not a black-box score), and
- **verifiable** (clear data provenance and limitations).

Today, critical signals about access, service availability, and vulnerability are often spread across technical systems and reports that are hard to interpret quickly—especially for non-specialists. This limits timely accountability, micro-planning, and evidence-informed public discourse.

## 3) Solution overview (what the tool does)
**Nairobi Health Equity Map** is a lightweight, map-first web application, live and verified at **https://nairobi-health-equity-map.netlify.app**, that:
- visualises facility and service-point layers (where available via open sources),
- highlights underserved geographies using an **explainable Priority Gap Score (PGS)**,
- provides plain-language "drivers" that explain *why* an area is flagged,
- supports **side-by-side comparisons** between two locations (https://nairobi-health-equity-map.netlify.app/compare),
- generates one-page briefs for reporting and accountability (https://nairobi-health-equity-map.netlify.app/brief?ward=KE047-003),
- includes a dedicated methodology page (https://nairobi-health-equity-map.netlify.app/method), and
- provides researcher-friendly downloads: spreadsheets (CSV), map data (GeoJSON), and per-ward JSON exports.

## 4) What makes it innovative (and credible for research + media)
### Research-grade transparency
- A dedicated **Method** page with indicator definitions, full PGS formula, weighting logic, and documented limitations.
- **Data provenance** on every view: sources, refresh timestamps, and link-outs to original datasets.
- **Exportable snapshots**: downloadable **spreadsheets (CSV)**, **map data files (GeoJSON)**, and **per-ward JSON** for reproducibility and secondary analysis.
- Open-source repository at https://github.com/geraldkombo/nairobi-health-equity-map with full commit history.

### Journalist-ready usability
- Reporting Mode (default): plain-English "Key Facts," median comparisons, and one-click brief generation.
- Research Mode: data quality scores, completeness percentages, missing-data warnings, and dynamic PGS weight controls.
- "Story-ready" comparison view (two places; one narrative).
- One-page brief output designed for print/PDF, stakeholder meetings, and editorial use.
- WCAG AA accessible with keyboard navigation, focus rings, and semantic HTML.

### Technical differentiation from existing tools
Unlike RWJF City Health Dashboard or KFF Racial Equity Data Dashboard (which operate at state/national levels with static interfaces):
- **Hyper-local:** Ward-level granularity matched to Kenyan electoral boundaries.
- **Zero proprietary GIS:** MapLibre GL JS (open source) replacing Esri/Google Maps lock-in.
- **Data resilience:** Pre-compiled JSON snapshots ensure full functionality when upstream APIs fail.
- **Zero-blue design:** High-contrast monochrome + warm accent palette for editorial aesthetics and eye comfort.

### Safe-by-design data governance
- Open-data-first and **no PII** in the prototype by design.
- Optional serverless proxy layer to protect secrets, normalize responses, and cache safely.

## 5) Target users and primary use cases
**Primary users**
- Researchers (universities, think tanks, policy labs)
- Journalists and data teams (newsrooms, investigative units)
- Community-led organizations (CSOs/CBOs) and advocacy coalitions
- County planning teams and implementers

**Primary use cases**
- Identify "health access deserts" and underserved hotspots.
- Produce evidence packs for budget, planning, and accountability dialogues.
- Support reporting with verifiable maps, datasets, and transparent methodology.

## 6) Data sources and API approach (open/public)
The platform is designed to use **public, non-identifiable** datasets and APIs (subject to licensing/availability), such as:
- Kenya Master Facility List (MFL) (facility metadata and locations, where available)
- WHO Global Health Observatory (GHO) indicators
- World Bank Open Data indicators
- Open administrative boundaries with appropriate licensing
- Population grid layers (as proxies for population pressure)

Current demo uses synthetic indicators with open-source ward boundaries (Open Admin Data, CC-BY-4.0) and facility points (OpenStreetMap, ODbL).

> Credentialed systems (e.g., DHIS2/KHIS) are not required for the demo; future integration would only use aggregated, non-identifiable extracts where approvals exist.

## 7) Technical approach (verified on Netlify production)
| Component | Implementation |
|---|---|
| **Frontend** | Next.js 15 (App Router) + TypeScript strict |
| **Mapping** | MapLibre GL JS (open source, no proprietary SDKs) |
| **Charts** | ECharts (lightweight, client-side) |
| **Styling** | Tailwind CSS v4 — zero-blue system, WCAG AA |
| **Hosting** | Netlify — static-first CDN, HTTPS enforced |
| **Serverless** | 4 Netlify Functions (health, wards, facilities, proxy) |
| **Data fallback** | Pre-compiled JSON snapshots in `/data/snapshots/` |
| **Exports** | CSV, GeoJSON, JSON download with one click |
| **CI/CD** | GitHub Actions (typecheck, lint, Playwright E2E) |

**Live endpoints (Netlify Functions):**
- `https://nairobi-health-equity-map.netlify.app/.netlify/functions/health`
- `https://nairobi-health-equity-map.netlify.app/.netlify/functions/wards`
- `https://nairobi-health-equity-map.netlify.app/.netlify/functions/facilities`

## 8) Demonstration plan (marketplace booth)
In a 3-5 minute walkthrough, participants will:
1. **Explore** the Nairobi map at https://nairobi-health-equity-map.netlify.app and identify high-priority underserved areas via the choropleth PGS visualization.
2. **Click** a ward to see its Priority Gap Score + plain-language drivers + data provenance (e.g., Kibera: https://nairobi-health-equity-map.netlify.app/brief?ward=KE047-003).
3. **Compare** two locations side-by-side at https://nairobi-health-equity-map.netlify.app/compare to show inequity clearly.
4. **Generate** a one-page brief (print/PDF) to demonstrate real-world use in reporting and decision spaces.
5. **Verify** methodology transparency at https://nairobi-health-equity-map.netlify.app/method.
6. **Download** data as CSV or GeoJSON for offline analysis and reproducibility.

## 9) Alignment to the forum theme
The tool strengthens community systems by making inequities **visible, explainable, and shareable**, improving coordination and accountability during donor transition and UHC implementation. It directly addresses the conference sub-theme by:
- Providing civil society with auditable evidence for budget advocacy (linking health access to public finance).
- Reducing dependency on proprietary systems and technical intermediaries.
- Enabling replication across counties with minimal configuration changes.

## 10) Sustainability and replication
- **Cost:** Zero ongoing licensing costs — static-first CDN with on-demand serverless.
- **Replicability:** Open-source (MIT) and configurable — substitute data layers for any Kenyan county.
- **Roadmap:** Expand real indicators (KNBS, KHIS), improve download formats (Excel, PDF), add trend tracking, support multi-county deployment.
- **Low barrier:** Deploys to Netlify from any GitHub fork with a single click via the "Deploy to Netlify" button.

## Verification checklist
All URLs below have been tested and return HTTP 200:

| Check | Status |
|---|---|
| Home page loads | ✅ https://nairobi-health-equity-map.netlify.app |
| Method page | ✅ https://nairobi-health-equity-map.netlify.app/method |
| Compare page | ✅ https://nairobi-health-equity-map.netlify.app/compare |
| Brief generator | ✅ https://nairobi-health-equity-map.netlify.app/brief?ward=KE047-003 |
| Data CSV accessible | ✅ https://nairobi-health-equity-map.netlify.app/data/indicators/ward_indicators.csv |
| GeoJSON accessible | ✅ https://nairobi-health-equity-map.netlify.app/data/boundaries/nairobi_wards.geojson |
| Snapshot fallback | ✅ https://nairobi-health-equity-map.netlify.app/data/snapshots/wards.json |
| Source repository | ✅ https://github.com/geraldkombo/nairobi-health-equity-map |
| HTTPS enforced | ✅ All pages served over TLS |
| Clean URLs | ✅ /method, /compare, /brief resolve without .html extension |
