# Nairobi Health Equity Map

A hyper-local, map-first civic intelligence platform built for journalists, researchers, and public finance advocates. The Nairobi Health Equity Map visualises health-access inequities across city wards using transparent, reproducible open data.

While many global dashboards map disparities, this tool is specifically engineered to bridge the gap between observation and accountability, outputting publication-ready briefs and data narratives to support municipal budget tracking and civic reporting.

## Key features

- **Ward-level precision:** Evaluates spatial health access using a transparent Priority Gap Score (PGS) aligned with Nairobi county boundaries.
- **Newsroom-ready outputs:** Instantly generates one-page print/PDF briefs and plain-English "What this means" summaries for immediate editorial use.
- **Auditable evidence:** Always-visible sources panel detailing dataset provenance, update timestamps, and missing-data caveats.
- **Built for resilience:** Optimised for low-bandwidth environments with local data fallbacks.
- **Compare view:** Side-by-side comparison of two wards with narrative summary.
- **Research mode:** Adjustable PGS weights and full score component breakdown.

## Tech stack

- Next.js 15 (App Router) + TypeScript (strict)
- MapLibre GL JS (open-source mapping)
- Tailwind CSS v4 (zero-blue design system)
- ECharts (charting)
- Netlify Functions (API proxy/caching)

## Quickstart

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Netlify dev

```bash
npm install -g netlify-cli
netlify dev
```

## Deploy to Netlify

### Static export (recommended, no auth required)

The project is pre-configured for static export:

```bash
npm run build
# deploy the `out/` directory
```

### Netlify deploy button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/geraldkombo/nairobi-health-equity-map)

### Manual deploy via CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

### Live demo

https://nairobi-health-equity-map.netlify.app

## Environment variables

None required for demo. Add as needed for upstream API keys:

| Variable | Purpose |
|---|---|
| `OVERPASS_API_KEY` | Optional Overpass API key |
| `MFL_API_TOKEN` | Optional MFL access token |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright E2E tests |

## API endpoints (Netlify Functions)

| Endpoint | Description |
|---|---|
| `/api/health` | Health check |
| `/api/wards` | Nairobi wards |
| `/api/facilities` | Facilities |
| `/api/proxy?url=...` | Upstream API proxy |

## Data resilience

The app ships with pre-compiled JSON snapshots in `data/snapshots/` to ensure the platform remains functional even if upstream APIs fail. A "data freshness" banner alerts users when snapshot data is being used.

## Project structure

```
├── data/
│   ├── boundaries/       # Ward polygons (GeoJSON)
│   ├── facilities/       # Facility points (GeoJSON)
│   ├── indicators/       # Ward indicators (CSV)
│   └── snapshots/        # Fallback JSON snapshots
├── docs/
│   ├── METHOD.md         # PGS methodology
│   └── DATA_SOURCES.md   # Data source documentation
├── netlify/functions/    # Netlify Functions
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Core utilities (scoring, geo, etc.)
│   └── data-adapters/    # Demo and remote data adapters
└── tests/e2e/            # Playwright smoke tests
```

## License

MIT
