You are a brilliant product-minded engineer. This is the **Kenya Health Equity Map** — a fully offline-capable digital tool for community-led monitoring (CLM) of health access inequity across Kenya's 47 counties.

**Live site:** https://geraldkombo.github.io/kenya-health-equity-map/
**GitHub:** https://github.com/geraldkombo/kenya-health-equity-map
**Date:** June 2026

---

## CRITICAL: This Is a CSS Forum Submission Tool, Not a Tech Product

Every decision must serve **Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring** of the **3rd CSS Knowledge Dissemination Forum** (23–25 June 2026, Lake Naivasha).

The review panel are **not developers**. They are:
- Community health advocates
- Programme officers at AMREF, PEPFAR, Global Fund
- Ministry of Health officials
- Peer-led network coordinators
- Researchers in community systems strengthening

**They will reject anything that sounds like tech for tech's sake.** They want to see:
- CLM impact (measurable outcomes, not just processes)
- Community data sovereignty (who owns the data? who can use it?)
- Digital inclusion (does this work for the most marginalized?)
- Sustainability (what happens when funding ends?)
- Data justice (no extraction, no surveillance, no vendor lock-in)

---

## What Sub-theme 2 Specifically Asks For (verbatim from CFP)

| Criterion | How We Must Respond |
|---|---|
| Impact and outcomes of CLM beyond processes | PGS is a **measurable, trackable outcome**. Communities can track whether their score improves as advocacy succeeds. Not just "we held meetings" — "Turkana moved from 92 to 85 after CHMT engagement." |
| Strategies for community data use and amplification into government systems | County briefs are **printable, source-cited documents** communities can submit to CHMTs, sub-county administrators, budget hearings. |
| Gaps identified through CLM and resulting advocacy actions | The map exposes infrastructure gaps (Elgeyo-Marakwet: 1 facility / 454K people). Communities use this as **hard evidence** to demand resources. |
| Data justice frameworks and community data governance | **Open source, transparent methodology, publicly verifiable sources.** No data extraction, no surveillance, no vendor lock-in. Communities own their data. |
| Third-party data access, privacy protection, informed consent | Zero user tracking. No cookies. No login. No personal data collected. The tool requests no permissions. |
| Addressing digital exclusion as a barrier to access | **Offline-first PWA.** Works without internet after first load. No installation, no app store, no login, works on basic smartphones. |
| Ethics of community-friendly AI-supported platforms | The PGS formula is a simple calculation people can verify on paper. No black box AI. No opaque algorithms. |
| Innovations to sustain CLM | **Zero infrastructure cost** (GitHub Pages). Zero maintenance. No hosting bill. Sustainable as a digital public good indefinitely. |

---

## Project State (June 2026)

### Data
- **1,699 real OSM facilities** across all 47 counties — community-mapped, validated coordinates, no UNKNOWN
- **Real KNBS 2019 population**, KNBS/KIHBS 2021 poverty, Macharia et al. 2022 travel times, KDHS 2022 immunization/SBA
- All 47 counties fully matched, zero warnings, zero zero-scores
- **PGS range:** Nairobi 40 (lowest inequity) ↔ Turkana 92 (highest inequity)

### Map & Visuals
- Clean county choropleth, YlOrBr colorblind-safe palette, white stroke outlines
- No facility clusters or individual points (tested and rejected — added noise, not signal)
- **On mobile:** Two-finger gestures to pan/zoom. Tap a county → bottom sheet slides up with details. Close button to dismiss.
- **On desktop:** Hover for tooltip with name + PGS. Click for side panel.
- Grayed-out tooltip, subtle, non-blocking

### Scoring (Priority Gap Score)
- 0–100, higher = more urgent need
- **Three components:** Accessibility (40%), Vulnerability/poverty (30%), Population pressure (30%)
- **Thresholds:** ≥70 critical dark brown, ≥50 high orange, ≥30 medium yellow, <30 light yellow
- Simple formula anyone can verify: `Score = (travel × 0.24) + (facilities × 0.16) + (poverty × 0.3) + (peoplePerFacility × 0.3)`

### Features
- **Fuzzy search:** Cmd+K / Ctrl+K modal — type any county name, partial matches work
- **County rankings:** Top 5 highest need + bottom 5 lowest need displayed on home page
- **County brief:** Printable one-pager with PGS badge, breakdown bars, narrative, source citations. Opens on `/brief?county=XX`.
- **Compare:** Side-by-side two counties. **Same county cannot be selected twice** — auto-resets.
- **Methodology page:** Entirely rewritten in plain language. No jargon. "What it does" not "how it computes."
- **DUA page:** Data sources, licenses, citations. "Accessed" dates removed.

### Mobile UX (just rebuilt)
- Map uses `70svh` height, `touch-action: none` (no page scrolling when interacting with map)
- County details slide up as a fixed bottom sheet with drag handle + close button
- HowToUse component shows different instructions on phone ("Tap a county") vs desktop ("Hover")
- Reduced padding, smaller fonts, responsive legend

### Deploy
- **GitHub Pages:** https://geraldkombo.github.io/kenya-health-equity-map/
- **No Netlify** — credits exhausted, 403 on deploy
- `npm run build` passes — 0 errors, 7 static routes

---

## What to Do: Upgrade Everything for CLM Alignment

### 1. Home Page — Reframe as CLM Advocacy Tool
- The subtitle should speak to **community health advocates, not data scientists**
- Current: "Explore health access gaps across Kenya's 47 counties. Tap a county for details."
- Better: "See which counties are most underserved — and get the evidence to demand change."
- The InsightsDashboard (county count, facility count, high-priority count) should connect to CLM action, not just display stats
- Add a one-liner above the map: *"Community-led monitoring starts with data communities can trust and use."*

### 2. County Details Panel — Connect Score to Action
- After the PGS and drivers, add a **"What you can do"** callout with CLM action steps:
  - "Use this score to show your CHMT that [County] needs more facilities"
  - "Print the county brief and bring it to your next budget hearing"
  - "Compare [County] with a neighboring county to highlight inequity"
- These should be simple, actionable, community-facing

### 3. Rankings — Frame as Accountability, Not Just Lists
- Top 5 = "Counties with the most urgent need for community advocacy and resource allocation"
- Bottom 5 = "Counties with relatively better access — but still room for improvement"
- Let users share these rankings (WhatsApp share button?)

### 4. County Brief — Add CLM Action Section
- Currently it shows: score, breakdown, indicators, limitations
- Add: **"How communities can use this brief"** with bullet points:
  - Present at CHMT quarterly meetings
  - Submit to county health department as part of budget advocacy
  - Use as baseline to track whether conditions improve year over year
  - Share with peer networks to coordinate advocacy across counties

### 5. Compare Page — Frame as Equity Lens
- The comparison summary should highlight: "This difference means communities in [County] face [X] more barriers than those in [County]."
- Add a call-to-action after comparison: "Use this comparison in your advocacy to demand equitable resource distribution."

### 6. Add CLM-Specific Content
- A small section on the home page (collapsible) titled "How communities are using this map" with 2-3 real or realistic use case stories:
  - A CBO in Turkana using the map to show the county government where facilities are missing
  - A peer network in Mandera tracking home birth rates against clinic access
  - A women's group in Tana River using the poverty data to argue for maternal health funding

### 7. Offline/PWA Messaging
- Make the offline capability more visible — it's a key digital inclusion feature
- After the map loads, show a one-time subtle indicator: "This map works offline — save it to your phone home screen"
- Add install prompt guidance for Android Chrome

### 8. Limitations Section — Reframe as Community Opportunity
- Current methodology page ends with limitations
- Add: "Every gap in this data is an invitation for communities to contribute their knowledge. If your local clinic isn't on this map, you can add it."
- Link to simple instructions for adding facilities to OpenStreetMap (or just explain how to report missing facilities)

### 9. Language Audit — Remove Any Tech-Centric Framing
- No "Next.js", "SSG", "MapLibre", "Overpass API", "Zod", "Fuse.js" in user-facing text
- No "composite index", "absolute-threshold normalisation", "proxy indicators"
- Replace with: "simple score", "combined measure", "travel time", "poverty rate"
- Already done on Methodology page — audit home page, brief, compare, DUA

### 10. Final Polish
- Add a clear "How to use this data for advocacy" section (not "How to use this map")
- Make sure every page asks: "What would a community health worker do with this information?"
- Remove any remaining technical/developer language
- Test on a basic Android phone (M-Pesa era smartphone) — not a flagship

---

## Constraints

- **Zero runtime backend** — no API routes, no serverless functions, no SSR at request time
- **Static export** — Next.js `output: export`, everything is pre-rendered HTML/JS
- **GitHub Pages** — no server-side processing available
- **Must work offline** after initial load (PWA with service worker)
- **`npm run build` must pass** after every change
- Do NOT modify `.github/workflows/` or config files
- No user login, no authentication, no cookies, no tracking
- All data is public; no private data stored anywhere

---

## Current Known Issues to Fix

- CountyDetails.tsx line 89: React Hook useMemo missing dependency 'county.name' (pre-existing, harmless)
- No WhatsApp/Twitter share buttons for county scores
- No easy way for communities to report missing facilities
- Service worker exists but no explicit "Add to Home Screen" guidance for Android
- PGS weight sliders exist in code (WeightsControl.tsx) but aren't surfaced in UI yet

---

## Key Data Points to Feature

- Turkana: 92 PGS (highest need) — 47% home births (KDHS 2022)
- Nairobi: 40 PGS (lowest need) — 618 facilities, dense urban coverage
- Elgeyo-Marakwet: 1 mapped facility for 454,000 people
- Tana River: 72.5% poverty rate — 48% home births
- Mandera: 50% home births — PGS 91
- National: 29% ANC in first trimester, 21/1,000 neonatal mortality
- Only 1,699 of ~17,400+ facilities currently mapped (~10%)
