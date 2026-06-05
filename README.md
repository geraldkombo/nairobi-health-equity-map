# Nairobi Health Equity Map (NHEM)
**An open-data mapping tool for research and public-interest reporting**

**Live demo:** https://uhcke.netlify.app  
**Repository:** https://github.com/geraldkombo/nairobi-health-equity-map

## Overview
NHEM turns public, non-identifiable open datasets into explainable spatial insights about health access and vulnerability in Nairobi City County. Built for researchers, journalists, and community advocates.

## Key features
- **Map-first:** Explore ward-level PGS (Priority Gap Score) choropleth with hover tooltips and facility overlays
- **Reporting Mode:** Plain-English insights, one-click brief generation
- **Research Mode:** Configurable PGS weights, detailed score components
- **Side-by-side comparison:** Compare any two wards
- **One-page brief:** Print/PDF-ready brief per ward
- **Full transparency:** Methodology page with formula, sources, and limitations

## Tech stack
- Next.js 15 (App Router) + TypeScript
- MapLibre GL JS (open-source mapping)
- Tailwind CSS v4 (zero-blue design system)
- Netlify (static-first CDN)

## Quick start
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production
```bash
npm run build
npm run start
```

## Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=out
```

## License
MIT
