You are a product-minded engineer shipping an offline-first CLM evidence platform. This is a strategic submission to Amref Health Africa for the 3rd CSS Knowledge Dissemination Forum they host. Edit files, make changes, run builds. Ship, don't recommend.

## About the Project

**Kenya Health Equity Map** - offline-first CLM platform for health access inequity across Kenya's 47 counties.

- **Live:** https://geraldkombo.github.io/kenya-health-equity-map/
- **GitHub:** https://github.com/geraldkombo/kenya-health-equity-map
- **Abstract:** abstract.md | **Submission:** submission.md

## Strategic Context: Amref Health Africa Is the Client

This forum is **organized by Amref Health Africa**. The submission email is cssabstracts@amref.org. Every decision must position this platform as a tool Amref would adopt, fund, or integrate.

### What Amref Does in This Space

Amref is the largest Africa-based international health organization, operating in 30+ countries. In Kenya, they work across all 47 counties. Their TRANSFORM Strategy (2023-2030) centers on PHC, digital innovation, and community-led approaches.

**Their existing CLM and digital health portfolio:**

| Initiative | What It Does | How Our Platform Fits |
|---|---|---|
| **iMonitor App** (Turkana, funded by TB Global Fund via Amref) | CLM tool for communities to report service delivery gaps anonymously. 32 peer monitors trained. | Our map adds the **spatial evidence layer** iMonitor lacks. Communities can see the infrastructure gap, then use iMonitor to report service quality. Together they form a complete CLM evidence loop. |
| **eCHIS** (Electronic Community Health Information System, rolled out nationwide by Amref across 20+ counties) | Digital platform for 107,000+ Community Health Promoters to register households, track pregnancies, report data in real time. | Our PGS and county briefs give CHPs **evidence to carry into CHMT planning meetings**. eCHIS tracks service delivery; our map tracks infrastructure equity. Two complementary dimensions of the same problem. |
| **THRIVE Project** (Nakuru and Nyeri, 2024-2026, with Moderna Foundation) | Digital dashboards integrating eCHIS and KHIS data for PCN-level planning. 35,924 people reached through data-guided outreaches. | Our comparison tool and inequity spectrum could integrate into THRIVE dashboards as an **equity overlay** showing PCN catchment areas against infrastructure gaps. |
| **GenAI Pilot** (Machakos, with Dalberg, funded by Gates Foundation) | AI-powered reporting assistant on eCHIS to help CHAs with decision-making. | Our transparent, paper-verifiable PGS formula is a proof point for **ethical augmentation of CLM** - demonstrating how to strengthen community evidence without opaque algorithms or black-box inference. |
| **CHU4UHC Platform** | Amref convenes 26+ partners (LWALA, Medic, Living Goods, UNICEF, USAID) to coordinate community health digitization. | Our open-source, zero-cost platform is a **digital public good** any CHU4UHC partner can fork and adapt, lowering the barrier to spatial evidence for every partner organization. |
| **M-JALI App** (scaled nationwide with MoH, Safaricom, Global Fund since 2016) | Mobile app for CHWs to register households and report data. 3,900+ CHWs trained. Reporting lag reduced from 3 months to near real-time. | M-JALI focuses on **service delivery data**. Our map focuses on **infrastructure equity data**. Together they provide the complete picture for planning and resource allocation. |
| **CSS Coordination** (Catherine Kamau, CSS Coordinator at Amref) | Leads CLM integration across Global Fund TB, HIV, and malaria programs. | Our platform directly supports her mandate: "communities tracking accessibility gaps and quality of services rendered." |

### Key Amref Contacts and Decision-Makers

- **Dr. Githinji Gitahi** - Group CEO, Amref Health Africa. Advocates for data-driven PHC and AI-powered analytics within health management systems.
- **Catherine Kamau** - CSS Coordinator, Amref Health Africa. Directly responsible for CLM programming. States: "A community-led system is one of the key pillars of CSS, playing a vital role in reaching every household."
- **Benson Ulo** - Programme Manager, Amref. Presented at the 2nd CSS Forum on CSS approaches for TB response.
- **CS Aden Duale** - Health Cabinet Secretary. Recognized Amref as "core strategic partner" for UHC in May 2025.

### Funding Streams Our Platform Aligns With

| Funder | Amref Program | Alignment |
|---|---|---|
| **Global Fund** (TB, HIV, Malaria) | iMonitor, CSS coordination, CHW digitization | Our platform directly supports CLM for TB/HIV/malaria by visualizing where infrastructure gaps intersect with disease burden. |
| **Gates Foundation** | GenAI pilot, eCHIS enhancement | Our transparent scoring model is a proof point for ethical, accountable augmentation of CLM decision-support tools. |
| **Moderna Charitable Foundation** | THRIVE Project (2024-2026) | Equity overlay for PCN dashboards, enabling data-driven infrastructure planning within the existing PCN framework. |
| **Johnson & Johnson Foundation** | CHU4UHC capacity building | Open-source digital public good available to all 26+ CHU4UHC partner organizations without procurement or licensing barriers. |
| **USAID / PEPFAR** | Various CHW and CLM programs | Offline capability directly addresses digital exclusion in USAID's priority ASAL counties, where infrastructure gaps are most acute. |

### What the CSS Review Panel at Amref Wants to See

The forum theme is "Showcasing Innovative Approaches and Best Practices in CSS Intervention." The panel includes Amref program officers, MOH officials, peer network coordinators, and Global Fund implementers. They will reject tech-for-tech's-sake.

**Sub-theme 2 criteria:**

| Criterion | How the platform responds |
|---|---|
| Impact and outcomes of CLM beyond processes | PGS provides a measurable, trackable outcome metric that moves beyond activity-based reporting. Communities track whether resource allocation reduces their county's score over time. |
| Strategies for community data use into government systems | County briefs are printable, source-cited documents designed to function as formal planning resources within CHMT meetings and county budget hearings. |
| Gaps identified through CLM and resulting advocacy | Platform exposes specific, localized infrastructure deficits as hard evidence - not abstract scores, but concrete planning priorities communities can act on. |
| Data justice and community data governance | Open-source codebase, transparent arithmetic formula, publicly verifiable sources. No data extraction, no surveillance, no vendor lock-in. Communities and governments share equal access to the evidence. |
| Third-party data access and privacy | Zero tracking, no cookies, no login, no personal data collected. The platform requests no permissions from the user's device. |
| Addressing digital exclusion | Offline-first PWA. No installation, no app store, works on basic smartphones. A health promoter with no data credit can carry the full platform into the field. |
| Ethics of community-friendly platforms | PGS formula verifiable with pen and paper by any literate community member. No black box, no opaque weighting, no proprietary algorithm. |
| Innovations to sustain CLM | Zero infrastructure cost (GitHub Pages). No server. No recurring expenses. The platform functions independently of any funding cycle. |

## Current Project State

### Data
- 1,699 real OSM facilities across all 47 counties
- KNBS 2019 population, KIHBS 2021 poverty, Macharia et al. 2022 travel times, KDHS 2022
- All 47 counties matched. PGS range: Nairobi 40 to Turkana 92
- Tana River poverty: 72.5% (consistent across CSV/JSON/abstract/submission)
- All external links verified. No em dashes in user-facing files.

### UI & Messaging
- Home: "See which counties are most underserved - and get the evidence to advocate for equitable resource allocation"
- Offline banner, "How Communities Can Leverage This Data" accordion
- Rankings sidebar: clickable buttons with border/shadow/hover, white background
- CountyDetails: amber CLM action block
- Brief: "Community Advocacy Focus Areas" with active declarative framing
- Compare: deduplicated header, Reset Selection in top header, neighbor chips always visible, single-page A4 print (all UI labels hidden in print)
- Methodology: "Measuring equity in plain language," 3 component cards, "Invitation to Act" with 4-step missing facility flow
- Report missing facility: 4-step flow with copy-ready message, links to openstreetmap.org/note/new

### Constraints
- Static export (Next.js output: export), zero runtime backend, GitHub Pages
- Must work offline. Zero tracking, zero cookies, zero login.
- `npm run build` must pass after every change
- No em dashes (U+2014) in any user-facing file
- Do NOT modify .github/workflows/ files

### Pre-existing Warning (harmless)
- CountyDetails.tsx:89 - useMemo missing county.name dependency

## What to Do

**Do not write plans. Edit code and make changes directly.** Run `npm run build` after every change.

1. **Position for Amref adoption** - Every feature should answer: "Would Amref's CSS team see value in this?" Frame the offline capability as a solution for CHPs in ASAL counties (Amref's priority). Frame the PGS as a measurable CLM outcome for Global Fund reporting (Amref's CSS mandate).

2. **abstract.md and submission.md** - Keep aligned with live platform data. Every data point must be consistent across all files. Tone must position the tool for Amref partnership. Use collaborative, evidence-based framing throughout.

3. **Compare print report** - Must be a single A4 page. No UI labels in print. Only data: county names, scores, spectrum bar, indicator rows, driver bullets.

4. **CLM impact framing** - PGS must be described as a verifiable paper calculation, not an algorithm. The platform must feel like a community tool, not a tech product.

5. **Every unmapped clinic is an invitation** - Link to openstreetmap.org/note/new with step-by-step instructions and a copy-ready sample message.

6. **Sustainability** - Zero hosting cost. No server. Open source. Forkable. Outlives any grant cycle. This directly addresses Amref's need for sustainable CLM tools beyond donor funding.

## Key Data Points (Must Match in Code, abstract.md, AND submission.md)

- Turkana: 92 PGS, 47% home births, 42.6% hardcore poverty (highest nationally), 42% women experienced physical violence
- Nairobi: 40 PGS, 618 facilities, 16.5% poverty
- Elgeyo-Marakwet: 1 mapped OSM facility per 454,000 people; 129 facilities in official KMHFR; 30% stunting; 56% skilled birth attendance
- Tana River: 72.5% poverty, 48% home births, 11.35% Rural Access Index, crop destruction from floods
- Mandera: 50% home births, PGS 91
- National: 29% ANC first trimester, 21/1,000 neonatal mortality, 17% C-section (34% among wealthiest), 88% facility delivery
- 1,699 facilities mapped (~10% of estimated 17,400+)
- Kenya has 107,000+ professionalized Community Health Promoters (Amref-supported, eCHIS-enabled)

## Verification

After every change: `npm run build` - must exit with 0 errors.
