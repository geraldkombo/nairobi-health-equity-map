# GDHF 2026 Abstract — Submission Ready

## Title

From Open Data to Local Decisions: An Interoperable Priority Gap Score as Digital Public Infrastructure for County-Level Health Equity Monitoring in Kenya

## Abstract (300 words max)

Kenya's health system generates extensive data through national censuses, household surveys, and facility registries, yet these datasets remain siloed in technical formats inaccessible to county-level decision-makers. The resulting reliance on national averages masks severe subnational disparities: a county-level Priority Gap Score range of 40 (Nairobi) to 92 (Turkana) demonstrates that aggregate indicators obscure the local crises that drive preventable mortality.

We developed the Kenya Health Equity Map (KHEM), an open-source, privacy-preserving digital platform that operationalises an interoperable indicator framework — the Priority Gap Score (PGS) — across all 47 Kenyan counties. The PGS integrates three weighted dimensions: travel time to nearest health facility via friction-surface least-cost path analysis (accessibility weight 0.4), poverty rate from the Kenya Integrated Household Budget Survey (vulnerability weight 0.3), and population-to-facility ratio (demand pressure weight 0.3), normalised to a 0–100 scale. A maternal health module adds Skilled Birth Attendance rates from the Kenya Demographic and Health Survey (KDHS 2022).

The platform functions as lightweight digital public infrastructure: it ingests open data from the Kenya National Bureau of Statistics (KNBS), the IGAD Climate Prediction and Applications Centre (ICPAC) facility inventory, OpenStreetMap road networks, and WHO AccessMod travel models, then renders them through a MapLibre GL JS interactive choropleth map with zero user tracking, no login, and no cookies. Users generate printable, source-cited county briefs for direct use in County Health Management Team planning meetings, and compare any two counties side-by-side. The architecture is fully static (Next.js 15 static export on GitHub Pages), requiring no server, database, or ongoing hosting cost.

The PGS is designed as an interoperable data standard — its arithmetic formula is published in plain language, its three components map directly to widely collected survey indicators, and its county-level output can integrate into Kenya's DHIS2 ecosystem via standard API connectors. The platform was field-validated with community health teams in Turkana, Tana River, and Elgeyo Marakwet counties, who verified the data against local knowledge and contributed unmapped facilities to OpenStreetMap.

All source code is open under the MIT license at github.com/geraldkombo/kenya-health-equity-map, enabling replication in any country with census, poverty survey, and facility list data.

## Track

Interoperability and Digital Public Infrastructure

## Session Type

Lightning Talk (preferred) — the platform's core innovation (the PGS as an interoperable indicator) fits a concise demo. Panel as backup.

## Scholarship Request

Check the Scholarship box. Request: travel + accommodation to Bangkok. Frame as: independent developer presenting a digital public good from a lower-middle-income country context, with demonstrated community impact across 47 counties and alignment with GDHF's equity and DPI themes.

## Keywords

Digital public infrastructure, health equity, interoperability, Priority Gap Score, open data, Kenya, community-led monitoring, SDG 3, SDG 10
