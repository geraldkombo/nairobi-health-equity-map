# Complete Kenya Health Equity Map - Final State (June 2026)

You are an autonomous coding agent shipping a CLM evidence platform for the 3rd CSS Knowledge Dissemination Forum at Lake Naivasha (23-25 June 2026). Create, edit, delete files. Run commands. Verify every step.

## Audience & Track

Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring.
Reviewers are community health advocates, AMREF/PEPFAR/Global Fund programme officers, MOH officials, peer network coordinators. Not developers.

**What they care about:**
- Measurable CLM outcomes (not just processes)
- Community data sovereignty
- Digital inclusion (works for the most marginalised)
- Sustainability beyond donor funding
- Data justice (no extraction, no surveillance, no vendor lock-in)
- Transparent, verifiable methodology (no black boxes)

## Project State

**Production:** https://geraldkombo.github.io/kenya-health-equity-map/
**Stack:** Next.js 15 (static export), MapLibre GL JS, Tailwind CSS 4, TypeScript
**Deployment:** Git push to master -> GitHub Actions -> GitHub Pages
**Build status:** 0 errors

### Data
- 1,699 real OSM facilities, 47 counties
- KNBS 2019 population, KIHBS 2021 poverty, Macharia et al. 2022 travel times, KDHS 2022
- PGS range: Nairobi 40 to Turkana 92
- Tana River poverty: 72.5%
- All links verified, no em dashes in user-facing files

### Pages (10 static routes)
- `/` - Map + CLM-advocacy home page
- `/brief?county=XX` - Printable county brief
- `/compare` - Side-by-side comparison
- `/method` - Plain-language methodology
- `/dua` - Data sources and licences
- `/sitemap.xml`
- `/_not-found`

### Core Features
- County choropleth (YlOrBr palette), fuzzy search (Cmd+K), county rankings with clickable buttons
- Printable county brief per county, print-friendly A4 output
- Side-by-side comparison with inequity spectrum bar and advocacy takeaway
- Offline PWA (works without internet after initial load)
- Zero tracking, zero cookies, zero login, zero personal data collection
- Reset Selection and Print buttons on compare page
- Neighbour suggestion chips on compare page (always visible)

## What to Do

Execute in order. Edit files directly. Run `npm run build` after each step.

### 1. Check Data Consistency
- Tana River poverty must be 72.5% in: CSV, JSON snapshot, abstract.md, submission.md, live app
- Nairobi PGS = 40, Turkana PGS = 92, Elgeyo-Marakwet = 1 facility / 454K people
- Mandera = 50% home births, Turkana = 47% home births, Tana River = 48% home births

### 2. Align abstract.md and submission.md with Live Platform
- Every data point must match the live app exactly
- Tone must address CSS reviewers, not developers
- Frame limitations as community invitations ("every unmapped clinic is a chance to contribute")
- No "Next.js", "MapLibre", "Zod", "Fuse" etc in user-facing documents

### 3. Language Audit Across All Pages
- No "composite index", "normalisation", "proxy indicators"
- Use: "simple score", "travel time", "poverty rate", "facilities per 10,000 people"
- No em dashes (U+2014)

### 4. CLM Impact Framing
- Every page should answer: "What would a community health worker do with this?"
- PGS must be described as a verifiable paper calculation, not an algorithm
- Offline capability must be prominent as a digital inclusion feature

### 5. Sustainability Messaging
- Zero hosting cost (GitHub Pages)
- No server, no database, no licensing
- Open source, forkable, adaptable
- Will outlive any grant cycle

## Technical Constraints
- Zero runtime backend. Static export. No API routes, no serverless functions.
- No user authentication, no cookies, no tracking.
- `npm run build` must pass after every change.
- Do not modify `.github/workflows/` files.

## Key Technical Details

### PGS Scoring
```
accessibility = travelTime * 0.6 + facilityDensity * 0.4
vulnerability = poverty
popPressure = populationPressure
rawPgs = accessibility * 0.4 + vulnerability * 0.3 + popPressure * 0.3
pgs = round(rawPgs * 100)
```

### PGS Thresholds
- Low: < 30 (#FDE68A), Medium: 30-49 (#F59E0B), High: 50-69 (#EA580C), Critical: 70+ (#78350F)

## Stop Conditions
Stop and report if build fails and you cannot fix it, or if you need clarification on a design decision.
