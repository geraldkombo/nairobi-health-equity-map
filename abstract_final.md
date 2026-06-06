# Kenya Health Equity Map: a serverless geospatial platform for evidence-based health prioritisation across 47 counties

**Submission type:** Conference Abstract / Civic Tech Showcase  
**Theme:** Open Data, UHC, and Community Systems Strengthening  
**Country:** Kenya  
**Live platform:** https://kenya-health-equity.netlify.app  

## Abstract

Equitable health resource allocation requires data that is both empirically rigorous and immediately accessible to policy-makers. The Kenya Health Equity Map addresses the gap between localized demographic data and strategic public health planning by synthesizing facility density, vulnerability proxies, and population pressure into an absolute Priority Gap Score (PGS) across Kenya's 47 counties. Unlike platforms that use relative min-max scaling (which artificially distorts longitudinal tracking), this application employs absolute thresholds benchmarked against national standards, ensuring objective measurement of infrastructure deficits that remains stable across data refreshes. Travel time is modelled using the KEMRI-Wellcome Trust / WHO AccessMod cost-distance methodology over combined transport networks (walking, motorized, and non-motorized), with walking speeds varying by land cover (ESA WorldCover) and road speeds by classification (OSM Kenya). The architecture is fully serverless: an automated ETL pipeline validates raw ward-level data with Zod schemas, applies population-weighted aggregation, and emits static JSON snapshots served directly from Netlify's global CDN with zero cold-start latency. Every data point on the platform is linked to its verifiable source URL (KNBS 2019 Census, KIHBS 2015/16, ICPAC/KEMRI Health Facilities, KMHFR), and each county brief generates an A4-formatted PDF with inline citations. By integrating dynamic driver decomposition, side-by-side county comparison, and automated regional briefs, the platform translates complex spatial modelling into actionable intelligence for County Assemblies and non-governmental organizations. The Kenya Health Equity Map demonstrates how modern, open-source geospatial tooling deployed on a serverless edge architecture can enforce accountability, guide strategic interventions, and close healthcare access gaps within resource-constrained settings.

**Keywords:** health equity, geospatial analysis, UHC, open data, Kenya, Priority Gap Score, serverless, AccessMod

**Live URL:** https://kenya-health-equity.netlify.app  
**Methodology:** https://kenya-health-equity.netlify.app/method  
**Compare tool:** https://kenya-health-equity.netlify.app/compare  
**Regional briefs:** https://kenya-health-equity.netlify.app/brief?county=1
