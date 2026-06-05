# Nairobi Health Equity Map: an open-data mapping tool for research and public-interest reporting

**Submission type:** CSS Community Marketplace Exhibitor / Abstract  
**Theme/Sub-theme:** Strengthening Community Systems in the Changing Global Health Landscape (Community Systems in the Era of Donor Transition and UHC)  

**Applicant/Lead:** Gerald Kombo (Independent Developer)  
**Country:** Kenya  
**Demo geography:** Nairobi City County  
**Contact:** geraldshikunyi@gmail.com  
**Repository:** https://github.com/geraldkombo/nairobi-health-equity-map  
**Live demo (Netlify):** https://uhcke.netlify.app  

## Abstract
Kenya's push toward Universal Health Coverage (UHC) is accelerating at the same time external donor financing tightens. In this transition, community systems are expected to do more with less—yet evidence to guide decisions and accountability is often fragmented across technical dashboards, spreadsheets, and closed reports. This creates an information gap that affects both **researchers** (who need transparent, reproducible methods) and **journalists** (who need clear, verifiable stories grounded in credible data).

**Nairobi Health Equity Map** is an open-source, map-first web application that turns **public, non-identifiable open datasets** into explainable spatial insights about health access and vulnerability in Nairobi City County. The platform overlays facility and service-point registries (e.g., Kenya Master Facility List, where available), administrative boundaries, population pressure proxies, and selected socio-economic/health indicators to generate a transparent **Priority Gap Score**. Every score is accompanied by plain-language "drivers" and a data provenance panel (sources, timestamps, indicator definitions, and limitations) to support scientific and journalistic verification.

The tool is designed around outputs that are directly usable beyond the screen: side-by-side comparisons between locations, downloadable one-page briefs for meetings and reporting, and research-friendly exports (**downloadable spreadsheets (CSV)** and **map data files (GeoJSON)** plus a clear methodology page) that enable reproducibility and secondary analysis. The demo runs "static-first" on Netlify with optional serverless functions for caching and safe API consumption, keeping operating costs low and facilitating replication across other Kenyan counties.

**Keywords:** UHC, community systems strengthening, open data, geospatial analysis, health equity, research reproducibility, public-interest journalism

## Provenance & verification
All data, methodology, and source code are publicly accessible:

| Resource | URL |
|---|---|
| Live platform | https://uhcke.netlify.app |
| Source repository | https://github.com/geraldkombo/nairobi-health-equity-map |
| Methodology & PGS formula | https://uhcke.netlify.app/method |
| Ward comparison tool | https://uhcke.netlify.app/compare |
| One-page brief generator | https://uhcke.netlify.app/brief?ward=KE047-003 |
| Data sources documentation | `/docs/DATA_SOURCES.md` in repository |

## Technical stack (verified on Netlify production)
- **Framework:** Next.js 15 (App Router) + TypeScript strict mode
- **Mapping:** MapLibre GL JS (open-source, zero proprietary GIS)
- **Styling:** Tailwind CSS v4 (zero-blue design system, WCAG AA)
- **Hosting:** Netlify (static-first CDN delivery, HTTPS enforced)
- **Edge functions:** 4 Netlify Functions (health check, wards API, facilities API, upstream proxy)
- **Data resilience:** Pre-compiled JSON snapshots fallback when upstream APIs are unavailable
- **Exports:** CSV ("Download spreadsheet"), GeoJSON ("Download map data"), per-ward JSON
