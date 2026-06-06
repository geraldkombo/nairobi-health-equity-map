You are a brilliant, creative product-minded engineer. This is the **Kenya Health Equity Map** — a static Next.js 15 site mapping health equity across Kenya's 47 counties. It's working but it's *boring*. Make it extraordinary.

**Live site**: https://geraldkombo.github.io/nairobi-health-equity-map/
**GitHub**: https://github.com/geraldkombo/nairobi-health-equity-map

## What Exists

Static SSG export (zero API routes). MapLibre GL (CartoDB tiles), ECharts, Zod ETL pipeline. Deployed via GitHub Actions with `basePath`. Netlify credits are exhausted (token: `nfp_Ypr3vPSipcSRBUAQzVBxWxtiobCJ3pDn0422`).

**All files are in**: `C:\Users\Rosemary\Downloads\New folder (5)\nairobi-health-equity-map\`

**Full project structure**:
```
src/app/          — 6 pages + error + sitemap, layout.tsx
src/components/   — MapView, CountyRankings, CountyDetails, CompareView, ScoreBadge
src/lib/          — scoring, normalize, geo, data-fetch, county-names, adapters
scripts/etl/      — 1-extract-kmhfr → 2-extract-knbs → 3-extract-spatial → 4-build-snapshot
data/             — boundaries/, facilities/, indicators/, snapshots/
public/           — manifest.json, sw.js, icons/
```

**ETL runs end-to-end** with 47 counties using real KNBS 2019 population, KNBS 2021 poverty, Macharia 2022 travel times, KDHS 2022 immunization/SBA. Facilities are synthetic (4,668 with coords from county centroids). PGS scoring (0-100) with absolute thresholds.

**Commands**:
- `npm run etl` — run full ETL
- `npm run build` — build site
- `npm run dev` — dev server
- `git push origin master` — auto-deploy to GitHub Pages

## Your Mission

Read every file in the project. Understand it deeply. Then make it **great**.

You are NOT limited to a boring checklist. You have complete autonomy. Here are directions you might explore, but you should discover what matters most:

- **Data soul**: The facilities are synthetic — that's embarrassing. Find real facility data. OSM Overpass API, published research datasets, anything. A map with fake dots is a demo; real data makes it a tool.
- **Visual storytelling**: The map is flat. How do you make someone *feel* the inequity? Animations? Transitions between views? A narrative mode that walks through Kenya's health divide?
- **Offline-first**: This is a PWA. Make it actually work offline. Cache the GeoJSON boundaries, the snapshots, everything. Make it installable and snappy on slow connections.
- **Comparison tools**: The compare page exists but is basic. Let users overlay two counties visually. Side-by-side radar charts, split maps, whatever makes disparities visceral.
- **County briefs**: The brief page loads a single county. What if it felt like a mini-report? PDF-printable layout, key insights highlighted, trend sparklines, nearest hospital info.
- **Search**: 47 counties — let users type to find one. Fuzzy search, keyboard-first.
- **Mobile**: The map on a phone needs to feel native, not cramped. Tap targets, gesture handling, bottom sheets instead of side panels.
- **Ward-level data**: Nairobi wards GeoJSON exists. Ward indicators CSV exists. Make it come alive.
- **The index**: The PGS is a single number. Show its components visually. Let users tweak the weights. Show what drives the score for each county.
- **Performance**: The facilities GeoJSON is 4,600+ features on the map. Optimize. Pre-cluster. Load data smarter.
- **Data freshness**: Add a "last updated" indicator per data source. Show when the KNBS census was vs the KDHS survey. Build trust through transparency.
- **Shareability**: Every county brief should have a shareable URL. OG images for each county. Deep links.
- **Accessibility**: Screen reader support for the map. Keyboard navigation. Colorblind-friendly palette.
- **Personality**: The current design is sterile. Can it feel more Kenyan? Warm amber tones. The map tiles could be warmer. The typography could have more character.

## How To Work

1. **Read first**. Every file. Understand what each piece does.
2. **Form a vision**. What 3-5 changes would make this go from boring to impressive?
3. **Implement**. Change files directly. Work iteratively.
4. **Run commands**: `npm run etl` after data changes, `npm run build` after any code change. Never leave the build broken.
5. **Verify**: Check the built site works. No 404s, no console errors.
6. **Commit**: After significant milestones, commit and push.

## Guidelines

- Read files before editing them
- No code comments (they're noise)
- Match existing code conventions
- Prefer real data over synthetic — always
- If an API fails, document what you tried and move on
- Don't touch GitHub Actions workflow or netlify.toml
- Never leave the build broken — if `npm run build` fails, fix it before anything else

Make this something you'd be proud to show someone. Make it not boring.
