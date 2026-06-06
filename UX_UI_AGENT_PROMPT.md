# UX/UI Agent: Kenya Health Equity Map — Best Netlify UX/UI Possible

**Give it the best name possible.** `ke-health-equity` is a placeholder. Choose the best name autonomously — Netlify subdomain or custom domain, whatever you judge most authoritative and memorable. Must project institutional credibility for government and development stakeholders.

## Funding Qualification

Make the project qualify for these with flying colours — handle autonomously:

- **Cesium Ecosystem Grant** ($5K-$15K): Make it visibly use CesiumJS for 3D geospatial capability. Add a 3D terrain view or globe mode that showcases Cesium integration on the method or map page. Mention Cesium in the tech stack documentation. The grant committee reads the site and codebase.
- **Netlify Open Source Plan**: Ensure the project clearly presents itself as open source (LICENSE file, repo link in footer, open source badges). Netlify reviews the site for eligibility.
- **Umbrella Fund Geospatial**: Polish the data citation layer and institutional design. They fund projects that look like they belong in a ministry of health — clean, authoritative, well-sourced.

Make this the best possible Netlify-deployed experience. Leverage everything the platform offers.

## Design

- Polished, professional, trustworthy — for government and development stakeholders
- WCAG AA everywhere. Colour contrast, focus rings, screen reader labels, semantic HTML
- Responsive: map fills width on mobile, sidebar becomes bottom sheet or overlay
- Loading skeletons for every async section, not spinners
- Empty states with guidance (no county selected? show rankings)
- Error states with retry actions
- Toast/snackbar for ephemeral feedback
- Dark mode via `prefers-color-scheme` media query
- Print layout polished for every page, not just brief
- Map canvas resizes cleanly when sidebar opens/closes (no WebGL stretch)
- Touch: swipe to close sidebar, pinch-zoom on map, no 300ms tap delay

## Netlify-specific

- **Deploy Previews**: Every branch push gets a unique preview URL. Use this for stakeholder review before merging to production
- **Branch subdomains**: `staging.ke-health-equity.netlify.app` for UAT, `production` for live
- **Split Testing**: Run A/B tests on PGS weighting schemes or UI layouts — Netlify handles traffic splitting natively
- **Netlify Forms**: Collect feedback from stakeholders via a form on `/feedback` — no backend needed, submissions go to Netlify dashboard or email
- **Edge Functions**: Personalise the landing page message based on visitor geography (geolocation via `Context.geo`) — e.g., "Welcome, visitor from [county]" with that county pre-selected on the map
- **Redirects**: SEO-friendly URLs, language prefixes if needed, proper 404 page
- **Headers**: CSP, HSTS, Permissions-Policy already set — audit and tighten
- **Plugin**: `netlify-plugin-缓存` or similar for optimal CDN caching of static assets
- **On-demand Builders**: Not applicable (static export), but ensure prebuild copies `data/` → `public/data/` correctly

## Performance

- Bundle under 150 KB First Load JS (currently 112 KB — maintain or shrink)
- Lazy-load MapLibre GL JS (already dynamic import — verify)
- Preload critical data (`/data/snapshots/county_indicators.json`) via `<link rel="preload">`
- Optimise GeoJSON boundaries (already 185 KB — could be further simplified at low zoom)
- Font subsetting for the stone palette
- No render-blocking resources

## Verdict

Make government officials, county health officers, and the Ministry of Health feel like they're using a serious institutional tool, not a demo. Every pixel should signal authority and care.
