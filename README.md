# Kenya Health Equity Map

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9bf4da5c-326a-400e-8bb3-5548fc58994e/deploy-status)](https://ke-health-equity.netlify.app)
[![Node](https://img.shields.io/badge/Node-22-339933?logo=node.js)](.nvmrc)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)](package.json)
[![MapLibre](https://img.shields.io/badge/MapLibre-GL-7cb342?logo=maplibre)](package.json)

Map-first civic intelligence platform visualising health access inequities across Kenya's 47 counties using transparent open data.

**Production URL:** https://ke-health-equity.netlify.app

## Data Sources

| Source | Data | License |
|--------|------|---------|
| KNBS 2019 Census | County population | Open Data |
| KDHS 2022 | Poverty estimates | Restricted (registered) |
| KMHFR / ICPAC-KEMRI | Health facility locations | CC-BY-4.0 |
| IEBC / KNBS GIS | County boundaries | Open Data / CC-BY-4.0 |
| WHO AccessMod | Travel time methodology | GPL-3.0 |
| OSM / ESA WorldCover | Road network, land cover | ODbL-1.0 / CC-BY-4.0 |

## Architecture

- **Frontend:** Next.js 15 static export + MapLibre GL JS + Tailwind CSS 4
- **Data Pipeline:** Zod-validated ETL scripts in `scripts/etl/`
- **Backend:** Zero runtime backend — all data is static JSON at build time
- **Deployment:** GitHub Actions → Netlify

## Quick Start

```bash
npm install
npm run etl        # Extract, validate, build county indicators
npm run build      # Static export to out/
npx serve out      # Preview locally
```

## Project Structure

```
src/
├── app/           # Next.js pages (/, /brief, /compare, /method, /dua)
├── components/    # MapView, CountyDetails, CompareView, etc.
└── lib/           # scoring.ts, normalize.ts, adapters.ts, data-fetch.ts
scripts/etl/       # ETL pipeline (extract → validate → build snapshot)
data/snapshots/    # Validated county indicators as JSON
```

## License

MIT — see [LICENSE](LICENSE).

## Attribution

Data sourced from KNBS, ICPAC/KEMRI, OSM, ESA, and WHO. See the [Data Use Agreement](https://ke-health-equity.netlify.app/dua) for full attribution requirements.
