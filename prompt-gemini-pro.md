You are a brilliant, creative product-minded engineer with full autonomy. This is the **Kenya Health Equity Map** — a static Next.js 15 SSG site mapping health equity across Kenya's 47 counties.

**Live site**: https://geraldkombo.github.io/kenya-health-equity-map/
**GitHub**: https://github.com/geraldkombo/kenya-health-equity-map
**Date**: June 2026

## Current State (June 2026)

- **Data**: Real OSM Overpass API → 1,699 real facilities across all 47 counties (validated, no UNKNOWN). No more synthetic data.
- **ETL**: Runs end-to-end with real KNBS 2019 population, KNBS 2021 poverty, Macharia 2022 travel times, KDHS 2022 immunization/SBA. 47 counties, zero warnings.
- **Map**: Clean county choropleth (YlOrBr colorblind-safe palette). No facility clusters or points (removed — user found them useless).
- **PGS**: Weighted composite (accessibility 0.4, population pressure 0.3, vulnerability 0.3). Thresholds: ≥70 critical (#8C2D04), ≥50 high (#D95F0E), ≥30 medium (#FEC44F), <30 low (#FFF7BC). All 47 counties scored — lowest Nairobi 40, highest Turkana 92. No zeros.
- **Search**: Fuse.js fuzzy county search with Cmd+K/Ctrl+K modal overlay.
- **County rankings**: Highest/lowest PGS with top 5 and bottom 5 displayed.
- **County brief**: Printable county brief with PGS badge, component breakdown, narrative lines, data source citations.
- **Compare**: Side-by-side county comparison with PGS, indicators, and rankings.
- **Deploy**: GitHub Pages at `geraldkombo.github.io/kenya-health-equity-map/` via GitHub Actions. Netlify credits exhausted.
- **PWA**: Minimal manifest.json registered. Service worker exists but no robust caching strategy yet.
- **Pages**: Home (map+rankings+search+details), County brief, Compare, DUA, Method, Sitemap.
- **Build**: `npm run build` passes — 0 errors, 6 static routes, all pages exported.
- **County name fix**: `ELEGEYO-MARAKWET` → `ELGEYO-MARAKWET` in all data files. All 47 counties match correctly.
- **Data source links**: All 35+ URLs verified working.

## DONE: CSS Forum Submission Complete

`abstract.md` and `submission.md` have been finalized for **Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring** of the **3rd CSS Knowledge Dissemination Forum** (23–25 June 2026, Lake Naivasha Resort).

**Submission details:**
- Email to: cssabstracts@amref.org
- CC: Gregory.Onyango@amref.org, James.Oching@amref.org
- Deadline: Sunday, 14th June 2024 (likely a typo for 2026) by 2359h
- Subject: "Abstract Submission: Sub-theme 2 - Digital Health & Evidence Generation (Kenya Health Equity Map)"

**Abstract title:** "Democratizing Data: The Kenya Health Equity Map for Community-Led Monitoring"
**Exhibition title:** "The Kenya Health Equity Map: Empowering Communities Through Data Visualization"

---

## CALL FOR EXPRESSION OF INTEREST
## CSS COMMUNITY MARKETPLACE EXHIBITORS
## 3rd CSS Knowledge Dissemination Forum

**Theme:** Strengthening Community Systems in the Changing Global Health Landscape
**Date:** 23rd to 25th June 2026 | **Venue:** Lake Naivasha Resort

### 1. BACKGROUND

The global health landscape is undergoing rapid transformation. Countries are transitioning toward domestic financing, social health insurance, and integrated Universal Health Coverage (UHC) systems. Digital health technologies are accelerating, humanitarian emergencies are increasing in frequency and complexity, and communities continue to carry significant psychosocial burdens with limited support. Amid these shifts, community systems remain poorly funded, often informal, and at risk of exclusion from formal health systems.

The 3rd Community Systems Strengthening (CSS) Knowledge Dissemination Forum brings together community, implementers, policymakers, community-led organisations, researchers, and development partners to share exhibitions on strengthening community systems in this changing global health landscape.

The conference will provide an opportunity for organizations, networks, community groups, and initiatives to showcase innovative approaches, tools, models, technologies, campaigns, community-led interventions, and systems-strengthening practices that have contributed to stronger community responses and improved health, human rights, gender equality, accountability, and service delivery outcomes.

### 2. CALL FOR ABSTRACT

The Community Systems Strengthening (CSS) dissemination forum organisers are pleased to invite exhibitors to submit abstracts on innovative approaches, tools, models, technologies, campaigns, community-led interventions, and systems-strengthening practices for consideration for the 3rd National Community Systems Strengthening Dissemination Forum. The presentations must be submitted via email to cssabstracts@amref.org or to Gregory.Onyango@amref.org and James.Oching@amref.org on or before Sunday, 14th June 2024 by 2359h.

### 2.1 CONFERENCE SUB-THEMES

Submissions should align with one or more of the following sub-themes:

#### Sub-theme 1: Community Systems in the Era of Donor Transition and UHC
Countries are transitioning towards domestic financing, social health insurance, and integrated UHC systems, yet community systems remain poorly funded, informal, and excluded from formal financing mechanisms. We welcome submissions addressing: financing models for community-led health services; integration of peer-led systems into national health financing and insurance schemes; community accountability mechanisms in UHC implementation; strategies for gender, disability and social inclusion for CSS; innovations and community resilience amidst shrinking donor and civic space; US Grant MOU experiences and community involvement; recognition and support for diverse community health cadres beyond formal CHPs; community-led alternatives to fill gaps left by donor departure.

#### Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring
Digitalisation is accelerating, including SHA's systems, biometric identification, AI-supported platforms, and community-led monitoring (CLM) tools. While promising, these technologies raise concerns about digital exclusion, privacy, and data misuse. We welcome submissions addressing: impact and outcomes of CLM (beyond the processes); strategies for community data use and amplification into government systems; gaps identified through CLM and resulting advocacy actions; data justice frameworks and community data governance; third-party data access, privacy protection, and informed consent; addressing digital exclusion as a barrier to access; ethics of community-friendly AI-supported platforms; innovations to sustain CLM.

#### Sub-theme 3: Accelerating Integration While Sustaining the Gains
Integration is becoming the dominant policy direction in many health systems. While intended to improve efficiency, communities are concerned about loss of specialized services, invisibility of key populations, and weakening of peer-led systems. We welcome submissions addressing: models that successfully integrate services while preserving quality; maintaining visibility of key populations in integrated systems; peer-led approaches that have survived or thrived during integration; community experiences with integrated service delivery; strategies for maintaining funding and focus on specialized services; documenting what has been lost and what has been gained through integration; transition planning that includes community voices; balancing efficiency gains with equity considerations.

---

## Key Data Points to Incorporate

- PGS range: Nairobi 40 (lowest inequity) to Turkana 92 (highest inequity)
- 1,699 OSM facilities ≈ 10% of Kenya's ~17,400+ registered facilities
- Elgeyo-Marakwet: 1 facility for 454,000 people
- Mandera: 50% home births; Tana River: 48%; Turkana: 47% (KDHS 2022)
- Tana River: 72.5% poverty rate (highest in Kenya)
- Only 29% of Kenyan women attend first ANC visit in first trimester (KDHS 2022)
- Neonatal mortality: 21 per 1,000 live births

## Formatting Requirements

- **Abstract**: Email body or attachment, ~350-400 words, plain language
- **Submission**: Full exhibition description for the marketplace exhibit
- Send to cssabstracts@amref.org, CC Gregory.Onyango@amref.org and James.Oching@amref.org
- Deadline: Sunday, 14th June 2024 by 2359h (likely a typo for 2026)

## What NOT To Do

- Do NOT lead with technical architecture (Next.js, SSG, Overpass, etc.)
- Do NOT use academic jargon like "econometric composite index" or "modifiable areal unit problem"
- Do NOT add API routes, serverless functions, SSR
- Do NOT modify `.github/workflows/` or `netlify.toml`
- Leave the build working — `npm run build` must pass after every change
