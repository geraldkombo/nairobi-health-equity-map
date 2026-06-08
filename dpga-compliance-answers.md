# DPGA Registry — Compliance Answers

## Project: Kenya Health Equity Map
## Submit at: https://app.digitalpublicgoods.net/signup

---

### Indicator 1: SDG Relevance
**Status: COMPLIANT ✓**

The platform directly advances SDG 3 (Good Health and Well-being) by identifying health infrastructure gaps that drive preventable mortality, and SDG 10 (Reduced Inequalities) by quantifying within-country disparities. SDG badges and explicit statements are live on the README.md and the Methodology page.

**Answer for form:** "The Kenya Health Equity Map supports SDG 3 (Good Health and Well-being) by visualising health facility access disparities across all 47 Kenyan counties, enabling targeted resource allocation to reduce preventable mortality. It supports SDG 10 (Reduced Inequalities) by making infrastructure inequities between counties visible and actionable for community advocates and decision-makers."

---

### Indicator 2: Open Licensing
**Status: COMPLIANT ✓**

The repository has an MIT License (OSI-approved) in the root LICENSE file. All source code is freely reusable, modifiable, and distributable under MIT terms.

**Answer for form:** "The platform is licensed under MIT (OSI-approved), as documented in the LICENSE file at the repository root."

---

### Indicator 3: Clear Ownership
**Status: COMPLIANT ✓**

The copyright holder is listed in LICENSE (Kenya Health Equity Map). The GitHub repository clearly shows the owner (geraldkombo) with contact information in the author field.

**Answer for form:** "The project is maintained by Gerald Kombo (geraldkombo@gmail.com). Copyright is held by the Kenya Health Equity Map project as noted in the LICENSE file. Source code is at github.com/geraldkombo/kenya-health-equity-map."

---

### Indicator 4: Platform Independence
**Status: COMPLIANT ✓**

The platform uses CARTO for base map tiles but is not locked into it — the MapLibre GL JS rendering engine accepts any tile provider. The core functionality (PGS computation, data display) is fully self-contained in static JSON/JS. The tile-swappability note is already documented in README.md under Architecture.

**Answer for form:** "The platform uses CARTO base map tiles via standard MapLibre GL JS rendering. The tile provider is swappable — the application accepts any MVT-compatible tile source. All core functionality (scoring, comparison, brief generation) is client-side and independent of any single service provider."

---

### Indicator 5: Documentation
**Status: COMPLIANT ✓**

- README.md: Full project description, architecture, quick start, data sources, SDG alignment, privacy statement
- CONTRIBUTING.md: Contribution guide for developers and community members
- Method page: Complete plain-language methodology with formula, component explanations, and data sources
- Data sources table in README.md links to original datasets

**Answer for form:** "Documentation includes a comprehensive README.md, CONTRIBUTING.md, methodology page with plain-language formula explanations, and a data dictionary through the data sources table. All indicators and their derivations are publicly documented."

---

### Indicator 6: Non-PII Data Extraction
**Status: COMPLIANT ✓**

The platform uses no PII whatsoever. All data is aggregated at county/ward level from KNBS, KIHBS, KDHS, and OSM. No user data is collected, stored, or transmitted.

**Answer for form:** "The platform contains no PII. All data is aggregated at the county level from public sources (KNBS Census, KIHBS, KDHS). The application performs zero user tracking, requires no login, and uses no cookies."

---

### Indicator 7: Privacy & Applicable Laws
**Status: COMPLIANT ✓**

- Privacy policy is stated in README.md: "This platform uses no cookies, requires no authentication or login, and performs zero user tracking."
- No data collection mechanisms exist in the codebase
- No external analytics, trackers, or third-party data processors

**Answer for form:** "The platform is fully compliant with privacy-by-design principles. No user data is collected, stored, or transmitted. The README.md contains an explicit privacy statement. The platform does not use cookies, trackers, or analytics tools. All processing is client-side."

---

### Indicator 8: Open Standards & Best Practices
**Status: COMPLIANT ✓**

- Uses OpenStreetMap data (open standard)
- Uses KNBS open data
- Uses standard GeoJSON for geographic data
- Uses WHO AccessMod methodology (open)
- WCAG AA consistent design system
- Semantic HTML throughout

**Answer for form:** "The platform uses open standards including GeoJSON for geographic data, OpenStreetMap for base mapping, WHO AccessMod methodology for travel-time modeling, and KNBS open census data. The codebase is built with Next.js 15 and follows WCAG AA accessibility standards."

---

### Indicator 9A: Data Privacy & Security
**Status: COMPLIANT ✓**

No user data is collected, so no privacy or security risks exist. The platform is fully static (no backend, no database, no API endpoints that accept data).

**Answer for form:** "As a fully static, client-side application with no backend, database, or data collection, there are zero data privacy or security risks. No user data ever enters the system."

---

### Indicator 9B: Inappropriate & Illegal Content
**Status: COMPLIANT ✓**

The platform is a read-only data visualization tool with no user-generated content, no comments, no uploads, and no forums.

**Answer for form:** "The platform is a read-only data visualization tool. There is no user-generated content, no comment system, no uploads, and no interactive content creation — therefore zero risk of inappropriate or illegal content."

---

### Indicator 9C: Protection from Harassment
**Status: COMPLIANT ✓**

No user profiles, no messaging, no social features, no authentication system — no vector for harassment exists.

**Answer for form:** "The platform has no user accounts, no messaging, no comments, and no social features. There is no mechanism for any user-to-user interaction, eliminating any risk of harassment."

---

## Summary

| Indicator | Status |
|-----------|--------|
| 1. SDG Relevance | ✓ Compliant |
| 2. Open Licensing | ✓ Compliant |
| 3. Clear Ownership | ✓ Compliant |
| 4. Platform Independence | ✓ Compliant — tile-swappability documented in README |
| 5. Documentation | ✓ Compliant |
| 6. Non-PII Data Extraction | ✓ Compliant |
| 7. Privacy & Applicable Laws | ✓ Compliant |
| 8. Open Standards & Best Practices | ✓ Compliant |
| 9A. Data Privacy & Security | ✓ Compliant |
| 9B. Inappropriate & Illegal Content | ✓ Compliant |
| 9C. Protection from Harassment | ✓ Compliant |

## DPGA Portal — Short Description (300 char max)

> The Kenya Health Equity Map is an open-source geographic platform that models health infrastructure disparities across Kenya's 47 counties. It aligns with SDG 3 and 10 by mapping physical access, poverty, and population pressure to identify healthcare gaps for underserved communities.

## All 9 Indicators Compliant
No remaining actions. The tile-swappability note was already present in README.md:51.
