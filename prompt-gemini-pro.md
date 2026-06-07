You are a product-minded engineer shipping an offline-first CLM evidence platform for the 3rd CSS Knowledge Dissemination Forum (23-25 June 2026, Lake Naivasha). Edit files, make changes, run builds. Your job is to ship, not to recommend.

## About the Project

**Kenya Health Equity Map** - a fully offline-capable digital tool for community-led monitoring (CLM) of health access inequity across Kenya's 47 counties.

- **Live:** https://geraldkombo.github.io/kenya-health-equity-map/
- **GitHub:** https://github.com/geraldkombo/kenya-health-equity-map
- **Abstract:** abstract.md (repo root)
- **Submission:** submission.md (repo root)

## Critical Audience Context

Sub-theme 2: "Digital Health and Evidence Generation Through Community-Led Monitoring."
The review panel are community health advocates, AMREF/PEPFAR/Global Fund program officers, Ministry of Health officials, peer network coordinators, and CSS researchers. They will reject anything that sounds like tech for tech's sake.

**Sub-theme 2 criteria (every decision must serve these):**

| Criterion | How the platform must respond |
|---|---|
| Impact and outcomes of CLM beyond processes | PGS is a measurable, trackable outcome. Communities track whether their score improves as advocacy succeeds. |
| Strategies for community data use into government systems | County briefs are printable, source-cited documents communities submit to CHMTs, budget hearings. |
| Gaps identified through CLM and resulting advocacy | Platform exposes infrastructure gaps as hard evidence. Communities use these as specific advocacy targets. |
| Data justice and community data governance | Open source, transparent formula, verifiable sources. No extraction, surveillance, or vendor lock-in. |
| Third-party data access and privacy | Zero tracking, no cookies, no login, no personal data collected. |
| Addressing digital exclusion | Offline-first PWA. No installation, no app store, works on basic smartphones. |
| Ethics of community-friendly platforms | PGS formula verifiable on paper. No black box. No opaque algorithm. |
| Innovations to sustain CLM | Zero hosting cost (GitHub Pages). No server. No donor dependency. |

## Current Project State

### Data
- 1,699 real OSM facilities across all 47 counties
- KNBS 2019 population, KIHBS 2021 poverty, Macharia et al. 2022 travel times, KDHS 2022
- All 47 counties matched. PGS range: Nairobi 40 to Turkana 92
- Tana River poverty: 72.5% (corrected, consistent across CSV/JSON/abstract/submission)
- All external links verified working. All em dashes replaced with regular hyphens.

### UI & Messaging
- High-contrast brown/orange/white theme throughout
- Home subtitle: "See which counties are most underserved - and get the evidence to demand change"
- Offline banner: "Works offline - save to home screen"
- Accordion: "How advocates can use this data" (real strategies, not fake users)
- Rankings: "Highest need / Better access" with "Urgent need for advocacy" section title
- CountyDetails: amber "What you can do with this data" action block
- Brief: "Community Advocacy Focus Areas" with active declarative framing
- Compare: deduplicated header, Reset Selection button, compact single-page A4 print
- Methodology: "Measuring equity in plain language," 3 component cards, "Invitation to Act"
- Rankings sidebar buttons: visible border, shadow, hover state (look clickable, not static text)
- All cite markers removed from user-facing text

### Features
- County choropleth with YlOrBr colorblind-safe palette
- Fuzzy search (Cmd+K/Ctrl+K modal)
- Side-by-side county comparison with inequity spectrum, drivers, advocacy takeaway
- Printable county brief per county
- Print-friendly A4 output for comparison and brief pages
- Offline PWA with service worker
- Zero JavaScript errors in build

### Constraints
- Static export (Next.js `output: export`), zero runtime backend, GitHub Pages
- Must work offline, zero user tracking, zero cookies
- `npm run build` must pass after every change
- Do NOT modify `.github/workflows/` files
- No em dashes (U+2014) in any user-facing file

### Pre-existing Warning (harmless)
- `CountyDetails.tsx:89` - `useMemo` missing `county.name` dependency

## What to Do

**Do not write plans. Do not suggest. Do not ask for approval. Edit the code and make changes directly.** Run `npm run build` after every change.

1. **abstract.md and submission.md** - These are submission documents for the CSS Forum. Keep them aligned with the live platform data. Every data point must be consistent. Every citation must be real and verifiable. Tone must speak to CSS reviewers (advocates, program officers, MOH officials), not to developers.

2. **Home page** - Every element should answer: "What would a community health worker do with this information?" Keep header, accordion use cases, and offline messaging. Rankings sidebar buttons must look clickable (borders, shadows, hover states already done).

3. **County brief** - Currently has "Community Advocacy Focus Areas" section. The brief is the single most important output for communities. Keep it sharp, printable, source-cited.

4. **Compare page** - The inequity spectrum bar, two column cards, and "Advocacy takeaway" banner are the core output. Reset button and print must work correctly.

5. **No AI black box concern** - Every mention of the PGS must make clear it is a simple arithmetic calculation verifiable on paper. No opaque algorithms.

6. **Language audit** - No "Next.js", "SSG", "MapLibre", "Overpass API", "Zod", "Fuse.js", "composite index", "normalisation", "proxy indicators" in user-facing text. Replace with: "simple score", "travel time", "poverty rate", "facilities per 10,000 people".

7. **Every unmapped clinic is an invitation** - Wherever limitations are mentioned, frame them as community action opportunities ("If your clinic is not on this map, you can add it to OpenStreetMap").

8. **Data consistency** - Tana River poverty = 72.5%. Nairobi PGS = 40. Turkana PGS = 92. Elgeyo-Marakwet = 1 facility / 454,000 people. Mandera = 50% home births. These must be identical in abstract.md, submission.md, and the live app.

## Key Data Points

- Turkana: 92 PGS, 47% home births
- Nairobi: 40 PGS, 618 facilities
- Elgeyo-Marakwet: 1 facility for 454,000 people
- Tana River: 72.5% poverty, 48% home births
- Mandera: 50% home births, PGS 91
- National: 29% ANC first trimester, 21/1,000 neonatal mortality
- 1,699 facilities mapped (~10% of estimated 17,400+)

## Verification

After every change: `npm run build` - must exit with 0 errors.
