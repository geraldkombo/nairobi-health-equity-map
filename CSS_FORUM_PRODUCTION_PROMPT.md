# CSS FORUM 2026 — ABSOLUTE PRODUCTION PERFECTION

You are a senior full-stack engineer, UX architect, and digital health strategist combined. Your single mission: take the **Kenya Health Equity Map (KHEM)** to its **absolute theoretical peak** for the **3rd CSS Knowledge Dissemination Forum** at Lake Naivasha, Kenya (23–25 June 2026).

This is not polish. This is not cleanup. This is **ruthless, exhaustive perfection** across speed, stability, capability, accessibility, and exhibition-readiness. You will read every file, understand every component, optimize every bottleneck, and verify every claim. You have full autonomy to edit any file. You run `npm run build` after every change and fix any errors immediately.

---

## WHY THIS MATTERS (read this first)

This platform will be demonstrated **live on tablets** at a marketplace exhibition in Naivasha. AMREF programme officers, PEPFAR/Global Fund reviewers, Ministry of Health officials, and community health promoters from across Kenya will walk up to the booth, pick up a tablet, and test the tool.

**If it works flawlessly offline on the first tap:** they will carry printed briefs back to their County Health Management Teams and demand evidence-based resource allocation. The platform becomes a national CLM tool.

**If it stutters, crashes, or confuses:** the moment is lost. This is a once-a-year audience with the exact people who can scale this tool nationally.

The tool must be so intuitive that a first-time user with no instruction can: tap their county, see their PGS, enable airplane mode, confirm it still works, and print a brief — all within 60 seconds.

---

## EXACT PROJECT STATE

### Identity & URLs
- **Live URL:** https://geraldkombo.github.io/kenya-health-equity-map/
- **Source:** https://github.com/geraldkombo/kenya-health-equity-map
- **Developer:** Gerald Kombo — Independent Researcher and Developer
- **License:** MIT — open digital public good

### Stack (exact versions)
```
Next.js 15.2.4 (output: "export" — fully static, zero server)
React 19.0.0 + TypeScript 5.8.3
MapLibre GL JS 4.7.1 (interactive county choropleth)
ECharts 5.5.1 + echarts-for-react 3.0.2 (rankings, comparisons)
Tailwind CSS 4.1.6 (via @tailwindcss/postcss 4.1.6)
Fuse.js 7.4.2 (fuzzy county search)
Zod 4.4.3 (data boundary validation)
Turf.js 7.3.5 (geospatial calculations)
react-to-print 3.3.0 (A4 brief printing)
PMTiles 4.4.1 (map tile protocol)
Sharp 0.34.5 (icon generation)
```

### Architecture
```
Static export only — NO:
  - API routes, serverless functions, database
  - Authentication, cookies, analytics, tracking
  - Server-side rendering at request time

ETL pipeline (runs pre-build, not at runtime):
  scripts/etl/1-extract-kmhfr.ts  → paginates KMHFR API for facilities
  scripts/etl/2-extract-knbs.ts    → KNBS census + KIHBS poverty
  scripts/etl/3-extract-spatial.ts → spatial joins + travel model
  scripts/etl/4-build-snapshot.ts  → final JSON snapshots to public/data/

Data: static JSON in public/data/snapshots/
  - county_indicators.json
  - indicator_records.json
  - facilities.json
```

### All Source Files (read every one)

**Pages (src/app/):**
```
page.tsx              — Home: map + search + rankings + insights dashboard
brief/page.tsx        — Printable one-page A4 county brief (client component)
compare/page.tsx      — Compare entry (wraps CompareClient)
compare/CompareClient.tsx — Side-by-side comparison with spectrum bar
method/page.tsx       — Plain-language PGS methodology (server component)
dua/page.tsx          — Data sources and licenses (server component)
forum/page.tsx        — CSS Forum exhibition landing (server component)
layout.tsx            — Root layout: fonts, header, service worker
globals.css           — Tailwind v4 theme tokens, print styles, touch targets
not-found.tsx         — 404 fallback
error.tsx             — Runtime error boundary
global-error.tsx      — Layout-level error boundary
sitemap.ts            — SEO sitemap
```

**Components (src/components/):**
```
MapView.tsx           — MapLibre choropleth with county click handlers
CountyDetails.tsx     — County detail panel with all indicators
CompareView.tsx       — ECharts comparison charts
CountyRankings.tsx    — Sorted county ranking table
InsightsDashboard.tsx — Summary stats: facilities, counties, high-priority
SearchBar.tsx         — Fuse.js-powered county search with Cmd+K
Header.tsx            — Navigation header
HowToUse.tsx          — Quick-start instructions
SourcesPanel.tsx      — Data source citations
ShareButton.tsx       — Social sharing
WeightsControl.tsx    — PGS weight adjustment (for advanced users)
ModeToggle.tsx        — Light/dark mode toggle
MapErrorBoundary.tsx  — Error boundary for MapLibre crashes
```

**Core Logic (src/lib/):**
```
scoring.ts    — PGS calculation: accessibility * 0.4 + vulnerability * 0.3 + popPressure * 0.3
normalize.ts  — Normalizes raw indicators to 0-1 scale
adapters.ts   — TypeScript interfaces + Zod schemas for all data
data-fetch.ts — Fetch helpers for static JSON data
county-names.ts — County name matching
geo.ts        — Geospatial utilities
site.ts       — Site metadata config
```

**Data files:**
```
data/snapshots/county_indicators.json   — Per-county indicator values
data/snapshots/indicator_records.json   — All indicator data
data/snapshots/facilities.json          — 1,699 facility locations
data/boundaries/counties_simplified.geojson — County boundary geometries
```

**Config & Deploy:**
```
next.config.ts      — Static export config
package.json        — Dependencies and scripts
public/sw.js        — Service worker v4
public/manifest.json — PWA manifest
.github/workflows/pages.yml  — GitHub Pages deploy
.github/workflows/deploy.yml — Netlify deploy
netlify.toml        — Netlify config
```

### PGS Scoring (exact formula — do not change)
```
accessibility = travelTime * 0.6 + facilityDensity * 0.4
vulnerability = poverty (0-1)
popPressure = populationPressure (normalized)
rawPgs = accessibility * 0.4 + vulnerability * 0.3 + popPressure * 0.3
pgs = round(rawPgs * 100)
```

Thresholds: Low <30 (#FFF7BC), Medium 30-49 (#FEC44F), High 50-69 (#D95F0E), Critical 70+ (#8C2D04)

### Verified Data Points (ALL must match between code, live site, and abstract.md)
| Metric | Value |
|---|---|
| Nairobi PGS | 40 |
| Turkana PGS | 92 |
| Mandera PGS | 91 |
| Tana River PGS | 89 |
| Total mapped facilities | 1,699 |
| Total counties | 47 |
| Tana River poverty rate | 72.5% |
| Turkana home births | 47% |
| Mandera home births | 50% |
| Turkana hardcore poverty | 42.6% |
| Nairobi facilities | 618 |
| Nairobi poverty | 16.5% |
| PGS range | 40 (Nairobi) to 92 (Turkana) = 52-point gap |

### Design Tokens (from globals.css @theme — USE THESE EXACTLY)
```
--color-stone-50: #FAFAF9    (body background)
--color-stone-100: #F5F5F4   (card background)
--color-stone-200: #E7E5E4   (borders)
--color-stone-400: #A8A29E   (muted text)
--color-stone-500: #78716C   (medium text)
--color-stone-600: #57534E   (body text)
--color-stone-700: #44403C   (strong text)
--color-stone-800: #292524   (headings)
--color-stone-900: #1C1917   (dark headings)
--color-accent-600: #16A34A  (focus outlines, success indicators)
--color-warm-50: #FFF7ED    (light orange bg)
--color-warm-500: #F97316   (brand orange)
--color-warm-600: #EA580C   (brand orange darker)
--color-warm-800: #9A3412   (brand orange dark)
--color-warm-900: #7C2D12   (brand brown)
--color-pgs-low: #FFF7BC
--color-pgs-medium: #FEC44F
--color-pgs-high: #D95F0E
--color-pgs-critical: #8C2D04
--font-sans: Inter
--font-serif: Lora
```

Inter for UI, Lora for headings. 44px min touch targets. Focus-visible: 2px solid accent-600 with 2px offset.

---

## CSS FORUM CONTEXT (every detail matters)

### The Event
- **3rd CSS Knowledge Dissemination Forum** (23–25 June 2026)
- Lake Naivasha, Kenya — Lake Naivasha Resort
- Organized by Amref Health Africa in Kenya under the Global Fund CSS Project
- Official theme: "Strengthening Community Systems in the Changing Global Health Landscape"
- Theme: "Community Systems Strengthening — Community as Agents of Change"

### Your Track
**Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring**

The forum's evaluation criteria for this track:
1. **Measurable CLM outcomes** — Does the tool produce quantifiable evidence communities can use? The PGS must be frameable as a trackable CLM indicator for Global Fund reporting.
2. **Community data sovereignty** — Who controls the data? The answer must be "communities." Zero data extraction, zero surveillance.
3. **Digital inclusion** — Does it work for the most marginalised? Offline-first on basic smartphones. No login, no installation, no app store.
4. **Sustainability** — Can it outlive donor funding? Zero-cost static site, no server, no licensing.
5. **Transparency** — Is the methodology verifiable? PGS must be a pen-and-paper calculation, not a black-box algorithm.
6. **Integration with existing systems** — Does it complement eCHIS, iMonitor, DHIS2? Not replace them — add the spatial evidence layer they lack.

### The Exhibition Demo (this is THE moment)
A reviewer walks up to the booth. They see a tablet. They pick it up. The exact flow they will follow:

```
Step 1: TAP THEIR COUNTY
  → Map highlights their county
  → PGS badge appears (big number, color-coded)
  → Key indicators shown: poverty rate, facilities, travel time, home births

Step 2: TEST OFFLINE
  → They see an instruction card: "Enable Airplane Mode"
  → They toggle airplane mode
  → They tap the county again → data still loads
  → They navigate to Brief → still works
  → VERDICT: "This actually works offline"

Step 3: PRINT EVIDENCE
  → They tap "Print County Brief"
  → A clean A4 page appears with: PGS, indicators, source URLs
  → They air-drop or save it
  → VERDICT: "I can take this to my CHMT meeting"

Step 4: COMPARE
  → They select their county + a neighboring county
  → Side-by-side comparison shows the PGS gap
  → Advocacy takeaway text: "County A scores X points higher/lower than County B"
  → VERDICT: "Now I can show the disparity to budget planners"
```

**The entire demo must work in under 60 seconds with zero instruction.**

### The Audience (who you are convincing)
| Persona | What They Check | What Convinces Them |
|---|---|---|
| AMREF Programme Officer | CLM integration, ethics, community ownership | "Zero tracking, communities own the data" |
| PEPFAR/Global Fund Reviewer | Measurable indicators, sustainability | "PGS is a trackable CLM metric, zero hosting cost" |
| MOH/CHMT Official | Data credibility, source traceability | "Every number has a verified source URL" |
| Community Health Promoter | Offline reliability, simplicity | "Works on my phone without data" |
| Peer Network Coordinator | Multi-county comparison | "I can compare all 47 counties in minutes" |

---

## MEASURABLE TARGETS (these are your success criteria)

### Performance Targets
- **First Load JS shared:** < 90KB (currently 101KB — find savings)
- **Page-specific JS:** < 20KB per page (currently up to 22KB)
- **Lighthouse Performance:** > 90 (mobile)
- **Lighthouse Accessibility:** > 95
- **Lighthouse Best Practices:** > 95
- **Lighthouse PWA:** All PWA checks pass
- **Map tile load time:** < 2s on 3G
- **Time to interactive:** < 3s on 3G

### Code Quality Targets
- **TypeScript errors:** 0 (npx tsc --noEmit passes)
- **`any` types:** 0 in all source files
- **Lint errors:** 0 (npm run lint passes)
- **Build warnings:** 0

### UX Targets
- **Offline:** All pages work after airplane mode, no errors in console
- **Touch targets:** Every interactive element >= 44x44px
- **Keyboard:** Full keyboard navigation, visible focus ring on every element
- **Screen reader:** All dynamic content has aria-live, map has aria-label, icons have aria-hidden
- **Contrast:** All text meets WCAG AA (4.5:1 normal, 3:1 large)
- **320px width:** No horizontal scroll, no text overflow, every element visible

### Data Integrity Targets
- Every county PGS value in code matches abstract.md exactly
- Every data point in platform matches its source citation
- No missing data for any county
- All 47 counties render on the map

---

## EXECUTION PLAN (execute in this order, build after each step)

### PHASE 1: AUDIT & MEASURE (no changes yet)
1. Read every source file listed above
2. Run `npm run build` and record current bundle sizes
3. Run `npx tsc --noEmit` and count any type errors
4. Run `npm run lint` and count any warnings
5. Identify the 3 largest JS chunks and their contents
6. Check offline mode: load → airplane mode → test every page
7. Open `data/snapshots/indicator_records.json` and verify all 47 counties have valid data
8. Cross-check all data points against abstract.md

### PHASE 2: PERFORMANCE OPTIMIZATION
1. **ECharts split:** ECharts imports the full library. Change imports to only what KHEM uses (bar chart, line chart). Target: 53KB chunk → < 35KB.
2. **Dynamic imports:** Verify MapView is lazy-loaded with `next/dynamic` + `ssr: false`. Same for ECharts components.
3. **Font optimization:** Verify Inter + Lora use `display: "swap"` and subset only latin characters.
4. **Map tile bounds:** In MapView.tsx, set `maxBounds` to Kenya's bounding box so tiles outside Kenya aren't requested.
5. **Data prefetch:** Move county data fetch from useEffect to build-time import where possible.

### PHASE 3: STABILITY & ROBUSTNESS
1. **Error boundaries:** Ensure MapErrorBoundary catches MapLibre crashes. Add error boundary around ECharts components. Test by breaking data and confirming graceful fallback.
2. **Data validation:** Zod schemas in adapters.ts must validate every field. If validation fails, show "Data temporarily unavailable" not a blank page.
3. **Promise rejection handling:** Every fetch().catch() must have a handler. No unhandled promise rejections.
4. **Service worker:** Version bump to "ke-health-v5". Add /_not-found to shell precache. Handle failed cache fetches gracefully.
5. **Race conditions:** Ensure county selection state doesn't race with data loading. Use proper loading states.

### PHASE 4: EXHIBITION READINESS
1. **Forum page (src/app/forum/page.tsx):**
   - Hero section: app name + subtitle + airplane mode test with QR code (inline SVG — no external deps)
   - Three case study cards: Turkana (PGS 92), Mandera (PGS 91), Tana River (PGS 89)
   - Each card has a "View Brief" link
   - Marketplace exhibition flow: numbered steps 1-4
   - Professional tone, no tech jargon, addresses CSS reviewers directly
   - Meta tags set for social sharing during the forum

2. **Home page (src/app/page.tsx):**
   - First impression must be the map — it should occupy the prime visual space
   - County search bar prominent below the map legend
   - Quick stats bar: "47 Counties · 1,699 Facilities · PGS Range 40–92"
   - "How to Use" section with 3 simple steps
   - Data sources footer with clickable source URLs

3. **Brief page (src/app/brief/page.tsx):**
   - Exact one A4 page for every county
   - Content: County name, PGS badge (colored circle with score), 4 key indicators, source citations, generated date, platform URL footer
   - Print CSS: `@page A4 10mm margins`, hide nav/footer/buttons, no page breaks inside cards

4. **Compare page (src/app/compare/CompareClient.tsx):**
   - Two dropdowns with county names
   - "Reset Selection" clears both dropdowns
   - After comparing: show PGS gap prominently ("Turkana scores 52 points higher than Nairobi")
   - Show key indicators side-by-side
   - Neighbor suggestion chips (e.g., "Compare with Nairobi?")
   - Spectrum bar showing where each county falls (Low/Medium/High/Critical)

### PHASE 5: ACCESSIBILITY & INCLUSION
1. **Keyboard navigation:**
   - Tab order: Skip link → Search → Map → County cards → Rankings → Footer links
   - Search opens on Cmd+K / Ctrl+K
   - Arrow keys navigate search results
   - Escape closes search/modal
   - Enter selects highlighted result
   - All dropdowns keyboard-navigable

2. **Screen reader support:**
   - Map: `aria-label="Interactive map of Kenya showing health equity Priority Gap Scores by county"`
   - PGS badge: `aria-label="Priority Gap Score: 92 out of 100 — Critical"`
   - Search results: `role="listbox"` with `aria-live="polite"`
   - Dynamic panel: `aria-live="polite"` on county details panel
   - All SVG icons: `aria-hidden="true"`

3. **Color and contrast:**
   - Every text element must pass WCAG AA using the design tokens
   - PGS colors must be distinguishable with color blindness (add patterns or text labels)
   - Error states use both color AND icon (not color alone)
   - Links underlined (not just colored)

4. **Touch (320px mobile):**
   - No horizontal scroll at 320px width
   - All text readable without zooming (min 14px body text)
   - Bottom sheet drag handle at least 44px wide
   - Map legend wraps on small screens
   - Buttons don't overlap

### PHASE 6: PLAIN LANGUAGE AUDIT
Scan EVERY user-facing file and replace:

| Find | Replace With | Reason |
|---|---|---|
| "composite index" | "simple score" | A health promoter needs to understand it in 2 seconds |
| "normalisation" | "simple calculation" | Describes the math without jargon |
| "proxy indicators" | "travel time / poverty rate / facilities per 10,000 people" | Name the actual thing |
| "min-max" | "map-based comparison" | Plain language |
| "geospatial" | "travel time" | Specific, understandable |
| "algorithm" or "model" | "verifiable paper calculation" | Builds trust, not fear |
| "Next.js" / "MapLibre" / "Zod" / "Fuse" | Remove entirely from user-facing text | These mean nothing to the audience |
| "open source" | "freely available for any community to use" | Explains the benefit, not the mechanism |
| "PWA" / "Progressive Web App" | "works offline after one download" | Describes the experience |
| "static export" | "requires no server or database" | Explains the sustainability benefit |

### PHASE 7: SUBMISSION ARTIFACT ALIGNMENT
1. **abstract.md** — Must exactly follow the official AMREF CSS Forum template:
   ```
   Thematic area: [X] Community-led monitoring
   
   Title (max 25 words):
   Democratizing Evidence Generation: An Offline-First Civic Intelligence Platform
   for Community-Led Monitoring of Health Equity in Kenya
   
   Authors: Gerald Kombo — Independent Researcher and Developer, Kenya Health Equity Map
   
   Presenting author: Gerald Kombo — cssabstracts@amref.org
   
   Body (max 300 words):
   Introduction: (why this matters for CLM)
   Description of intervention: (what KHEM is and how it works)
   Findings and lessons learned: (key data, community validation results)
   Conclusion and next steps: (implications, sustainability, call to action)
   
   Keywords: Digital Health, Community-Led Monitoring, Health Equity, Civic Technology, Kenya
   ```

2. **email-body.md** — Resubmission email following the secretariat's instructions:
   - To: cssabstracts@amref.org
   - CC: Gregory.Onyango@amref.org, James.Oching@amref.org
   - Subject: REVISED SUBMISSION — [Title] — Gerald Kombo
   - Body: Brief note that this is a resubmission using the correct template
   - Attach: abstract.md formatted according to template

3. **submission.md** — Full narrative version for reference (not for submission)

### PHASE 8: PWA & DEPLOYMENT VERIFICATION
1. **manifest.json** must have:
   - `prefer_related_applications: false`
   - `categories: ["health", "maps", "civic-tech"]`
   - All icons present with correct sizes
   - `background_color: "#FAFAF9"`
   - `theme_color: "#78350F"`

2. **sw.js** must:
   - Cache all shell routes: /, /brief/, /compare/, /method/, /forum/, /dua/, /_not-found
   - Cache tile CDN origins
   - Version: CACHE = "ke-health-v5"
   - Handle failed cache writes gracefully

3. **Build verification:**
   - `npm run build` — 0 errors, 10/10 pages
   - `out/` contains all HTML, JS, CSS, data files
   - No stale/leftover files from previous builds

---

## EXACT OUTPUTS EXPECTED

For every component you touch, provide this level of quality:

**SearchBar example (target state):**
```
- Press Cmd+K → search modal opens instantly
- Type "elgeyo" → "Elgeyo-Marakwet" appears in results
- Arrow down → highlight moves
- Enter → county selected, search closes
- Escape → search closes
- All via keyboard, all accessible
- aria-label, role="combobox", aria-live="polite" on results
```

**County Brief example (target state):**
```
- A4 page, portrait, 10mm margins
- Top: County name + PGS badge (big colored circle)
- Middle: 4 indicator cards with source citations
- Bottom: "Generated by Kenya Health Equity Map · [date]"
- Print: no nav, no footer, no buttons
- Cards don't split across pages
- Font: 8pt print, readable
```

**Forum page example (target state):**
```
- Header: "Kenya Health Equity Map" + subtitle
- QR code section: "Scan or load, then enable Airplane Mode"
- 3 case study cards in grid: Turkana (92), Mandera (91), Tana River (89)
- Each card: county name, PGS badge, one-line description, "View Brief" link
- Exhibition flow: 4 numbered steps
- No tech jargon, no developer language
```

---

## RULES (non-negotiable)

1. **Read every file before editing it.** Do not assume you know the contents.
2. **Build after every single change.** Never make two changes without building between them.
3. **Zero regressions.** Never break a working feature. If you accidentally do, fix it immediately.
4. **Preserve the design system.** Use only colors, fonts, and spacing from globals.css @theme.
5. **Zero new dependencies.** Do not add packages to package.json. Use inline SVGs, not icon libraries.
6. **Zero tracking.** No analytics, no cookies, no user data collection of any kind.
7. **Offline-first must never break.** If a change breaks offline mode, revert the change.
8. **Do not touch .github/workflows/ files.** Deployment config is off limits.
9. **Do not fabricate data.** Never generate fake statistics. If data is stale or missing, note it in your report.
10. **Do not change the PGS formula.** The scoring logic is verified. Only change display/presentation.

---

## STOP CONDITIONS

Stop immediately and report to the user if:
1. Build fails and you cannot fix it within 3 attempts
2. A data integrity issue is discovered that requires new source data
3. Offline mode breaks and cannot be repaired
4. A change requires adding a new Googlenpm dependency
5. You find a security vulnerability (data leak, XSS, etc.)
6. You need clarification on a design decision or business rule

---

## FINAL VERIFICATION

Before declaring completion, verify EVERY item:

```
PERFORMANCE:
[  ] npm run build — 0 errors
[  ] npx tsc --noEmit — 0 errors
[  ] npm run lint — 0 errors
[  ] First Load JS < 90KB
[  ] No unoptimized images

OFFLINE:
[  ] Home page works in airplane mode
[  ] Map + county selection works in airplane mode
[  ] County brief loads in airplane mode
[  ] Compare page loads in airplane mode
[  ] Method page loads in airplane mode
[  ] Forum page loads in airplane mode

DATA INTEGRITY:
[  ] Nairobi PGS = 40 in code AND abstract.md
[  ] Turkana PGS = 92 in code AND abstract.md
[  ] Mandera PGS = 91 in code AND abstract.md
[  ] Tana River PGS = 89 in code AND abstract.md
[  ] Tana River poverty = 72.5% in code AND abstract.md
[  ] All 47 counties present with valid data

ACCESSIBILITY:
[  ] All touch targets >= 44x44px
[  ] Keyboard navigation works end-to-end
[  ] Map has aria-label
[  ] Dynamic content has aria-live
[  ] All icons have aria-hidden
[  ] Color contrast meets WCAG AA
[  ] 320px width: no horizontal scroll, no overflow
[  ] Skip-to-content link exists

PLAIN LANGUAGE:
[  ] No "composite index" anywhere in codebase
[  ] No "algorithm" or "model" in user-facing text
[  ] No tech stack names in user-facing text

PWA:
[  ] Manifest has prefer_related_applications: false
[  ] Service worker caches all shell routes
[  ] Service worker version bumped

ABSTRACT:
[  ] Follows CSS Forum template exactly
[  ] Body < 300 words
[  ] All data points match live platform
[  ] Keywords present (max 5)
```

---

## UPDATES SINCE LAST AUDIT (24+ issues fixed)

The following issues were found and fixed during a comprehensive audit. Do NOT re-fix these — they are already resolved:

### CRITICAL FIXES
- **Forum page brief links** (`src/app/forum/page.tsx`): Used county names (`county=Turkana`) instead of numeric IDs (`county=10`) — would have 404'd at exhibition. Changed to correct IDs: Turkana=10, Mandera=36, Tana River=41.
- **layout.tsx icon references**: Pointed to old filenames `icon-192.png`/`icon-512.png` but manifest now uses `icon-192x192.png`/`icon-512x512.png`. Updated metadata + apple-touch-icon.
- **dua/page.tsx factual error**: Listed "KDHS 2022" as poverty data source — KDHS provides clinical indicators, KIHBS provides poverty. Changed to correct KIHBS 2015/16 entry with correct URL.
- **iOS Safari tile failure**: Added MapLibre `error` event listener in MapView.tsx that detects HTTP 400+ tile errors. County outlines render from inline GeoJSON (not tiles), so they remain visible. Amber banner: "Map tiles unavailable offline. County outlines still visible." — non-blocking.

### PLAIN LANGUAGE FIXES
- **src/app/brief/page.tsx**: "Baseline Narrative" → "Baseline Summary". Overly complex paragraph rewritten in plain language.
- **src/components/CountyRankings.tsx**: "Critical intervention priority" → "Counties by priority need". "Maximum deficit" → "Most underserved". "Optimal access" → "Best served".
- **src/components/HowToUse.tsx**: "Utilize the search function to locate administrative regions" → "Use the search bar to find a county by name". "Compare multiple regions to analyze structural disparities" → "Compare two counties side-by-side to see where gaps are largest". "Generate an analytical brief for formal documentation" → "Print a one-page brief with source citations for CHMT meetings".
- **src/lib/scoring.ts**: "Travel duration to health facilities in this region exceeds that of 70 percent of comparable counties" → "Longer travel time to clinics than 70% of counties". "All measures are within the normal range" → "All measures are within typical range".
- **All `model`/`modelling` references in user-facing text** → `analysis` (5 occurrences in adapters.ts, 1 in method/page.tsx)
- **All `artificial` score references** (brief/page.tsx, method/page.tsx) → removed word "artificial" (implies manipulation)
- **`text-neutral-*` → `text-stone-*`**: In not-found.tsx, error.tsx, global-error.tsx — inconsistent with design system
- **error.tsx**: Stopped leaking `error.stack` to users

### ACCESSIBILITY FIXES
- **page.tsx mobile sheet close button**: Was `p-1` (too small), now `min-h-[44px] min-w-[44px] inline-flex items-center justify-center`
- **Header.tsx nav links**: Added `focus-visible` + `rounded px-1` to all three nav links
- **page.tsx bottom links** ("View sample brief" etc.): Added `focus-visible` outline classes
- **not-found.tsx/error.tsx/global-error.tsx buttons**: Added `focus-visible:outline-accent-600`
- **method/page.tsx**: `focus-visible:outline-[#EA580C]` → `focus-visible:outline-accent-600` (consistency)

### DESIGN CONSISTENCY
- **forum/page.tsx**: `text-blue-600` → `text-warm-600` (airplane mode heading — was using wrong brand color)
- **globals.css**: Removed `.maplibregl-marker { filter: hue-rotate(120deg); }` (debug artifact). Removed redundant media query wrapping 44px rule.
- **ShareButton.tsx**: "Distribute" → "Share" (standard UX term). "Copy hyperlink" → "Copy link".
- **SourcesPanel.tsx**: "Last Updated: October 2024" → "Last data refresh: June 2026" (was stale)
- **CompareClient.tsx**: Added missing neighbor entries for `ELGEYO-MARAKWET` (hyphenated) and `HOMABAY` (one word) — these name variants caused neighbor suggestions to silently fail.
- **CountyDetails.tsx**: "Generate analytical brief" → "Generate county brief"
- **page.tsx**: "Effective health monitoring requires reliable and accessible data" (cliché) → "Transparent evidence for CHMT planning and community-led advocacy"
- **apple-mobile-web-app-title**: "Health Map" → "KHEM" (match manifest short_name)
- **layout.tsx metadata icons**: Updated filenames to match manifest

### CONFIRMED STILL CORRECT
- PGS formula: accessibility*0.4 + vulnerability*0.3 + popPressure*0.3
- Thresholds: Low<30, Medium 30-49, High 50-69, Critical 70+
- All verified data points match between code, abstract.md, and live site
- No `lucide-react` or any new dependencies added
- Service worker caches all 7 shell routes + data on fetch with /_not-found fallback
- SearchBar has arrow-key navigation, role=combobox, aria-live, 44px touch targets

---

*This is the complete context. Execute every phase. Verify every target. Do not stop until every checkbox is checked. The Naivasha exhibition depends on this being flawless.*
