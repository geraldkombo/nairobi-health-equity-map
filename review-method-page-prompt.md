# Review: Method Page Rewrite

The Kenya Health Equity Map's Method page (`src/app/method/page.tsx`) was rewritten to remove AI-generated cadence and make the language tighter and more natural. Review the full page below and flag any remaining issues:

**What to check:**
- Any phrase that still sounds like AI wrote it (overly formal, generic, verbose)
- Any second-person pronouns ("you", "your") -- must be zero
- Any em dashes (U+2014) -- must be zero
- Any abbreviations not spelled out on first use in user-facing text
- Any casual or lay language that undermines the professional register
- Any grammar, punctuation, or spacing errors
- Any phrasing that doesn't match the Kenya public-health context

**Full page source:**

```tsx
import Link from "next/link";
import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="text-[24px] font-bold font-serif text-[#78350F]">Methodology Framework</h1>
      <p className="mt-4 text-[14px] leading-7 text-[#6B6355] border-l-4 border-[#EA580C] pl-4">
        Health equity requires transparent, verifiable methodologies. All algorithms, data sources, and calculations are publicly documented and independently reproducible.
      </p>

      <div className="mt-8 space-y-8">
        {/* SDG Alignment */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-[#FFFBEB] p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">
            Sustainable Development Goals Alignment
          </h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The platform is aligned with <strong>SDG 3 (Good Health and Well-being)</strong>. It maps where health infrastructure gaps are worst so resources can reach the people who need them most. It also supports <strong>SDG 10 (Reduced Inequalities)</strong> by making within-country disparities visible at a glance, particularly for rural and marginalised populations.
          </p>
        </section>

        {/* PGS */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">The Priority Gap Score (PGS)</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The Priority Gap Score (PGS) is a composite index from <strong>0 to 100</strong> that measures health infrastructure inequity within each county. Higher scores indicate greater service gaps and stronger claims on resource allocation.
          </p>
          <div className="mt-4 rounded-[6px] bg-[#F8F5F0] p-4 text-[14px] leading-7 text-[#524B3F]">
            <p className="font-semibold text-[#292524]">How to read the score:</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li><strong>0-29:</strong> Relatively equitable resource distribution</li>
              <li><strong>30-49:</strong> Moderate infrastructure gaps</li>
              <li><strong>50-69:</strong> Significant gaps requiring intervention</li>
              <li><strong>70-100:</strong> Severe gaps requiring urgent resource allocation</li>
            </ul>
          </div>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            <strong>Turkana</strong> (PGS 92) and <strong>Mandera</strong> (PGS 91) are the most underserved counties. <strong>Nairobi</strong> (PGS 40) has more facilities per person and lower poverty, so its score is lower.
          </p>
        </section>

        {/* Three Components */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Score Components</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            The PGS combines three dimensions, each normalised to a 0-1 scale before aggregation:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[8px] bg-[#F8F5F0] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">1. Vulnerability (30%)</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#524B3F]">
                Proportion of the county population living below the poverty line. Higher poverty reduces a household&apos;s ability to afford transport, consultation fees, and treatment.
              </p>
            </div>
            <div className="rounded-[8px] bg-[#F8F5F0] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">2. Physical Access (40%)</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#524B3F]">
                Mean travel time to the nearest mapped health facility, computed using least-cost path analysis along road and path networks. Higher travel times mean harder access to care.
              </p>
            </div>
            <div className="rounded-[8px] bg-[#F8F5F0] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#EA580C]">3. Population Pressure (30%)</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#524B3F]">
                Population-to-facility ratio. Higher ratios mean more people sharing each facility, leading to longer wait times and reduced service quality.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[8px] bg-[#F8F5F0] p-4 text-[14px] leading-7 text-[#524B3F]">
            <p className="font-semibold text-[#292524]">Formula:</p>
            <p className="mt-1">
              <strong>PGS</strong> = (Physical Access x 0.40) + (Vulnerability x 0.30) + (Population Pressure x 0.30)
            </p>
            <p className="text-[12px] leading-5 text-[#6B6355] mt-2">
              Each component is normalised to a 0-1 scale, then the weighted sum is multiplied by 100.
            </p>
          </div>
        </section>

        {/* Travel time */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Travel time estimation</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            Travel times are estimated using <strong>AccessMod</strong>, a WHO-supported tool for geographic accessibility modelling. It finds the fastest route along OpenStreetMap roads and paths: paved roads assume motorised transport; unpaved roads and paths assume walking or bicycle speeds.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            This model was developed by researchers at KEMRI-Wellcome Trust. Road data comes from{" "}
            <a href="https://www.openstreetmap.org/relation/192798">OpenStreetMap</a>. Tool:{" "}
            <a href="https://www.accessmod.org">AccessMod</a>.
          </p>
        </section>

        {/* Rationale */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Rationale for selected indicators</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            These three dimensions map to widely accepted categories in health-access measurement:
          </p>
          <ul className="mt-4 space-y-4 text-[14px] leading-7 text-[#524B3F]">
            <li><strong>Travel time and facility density</strong> measure <strong>physical accessibility</strong>: can a person reach a clinic when they need one?</li>
            <li><strong>Poverty rates</strong> approximate <strong>economic accessibility</strong>: can a household afford transport, fees, and treatment?</li>
            <li><strong>Population-to-facility ratios</strong> capture <strong>demand pressure</strong>: is the existing infrastructure stretched too thin?</li>
          </ul>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            All datasets are from publicly accessible sources, including the Kenya National Bureau of Statistics (KNBS), the Kenya Demographic and Health Survey (KDHS), the Kenya Integrated Household Budget Survey (KIHBS), WHO AccessMod, and OpenStreetMap, ensuring every input can be independently verified.
          </p>
        </section>

        {/* Maternal Health */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Maternal Health Access</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The platform adds county-level <strong>Skilled Birth Attendance (SBA)</strong> rates from the Kenya Demographic and Health Survey (KDHS 2022). SBA tracks the share of deliveries attended by a trained professional. When low SBA coincides with long travel times, the result is a <strong>maternal health access desert</strong> where women face two compounding barriers at once.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            SBA appears in the county detail panel alongside the PGS, making it easy to flag counties that need maternal health investment, mobile clinics, or community health worker deployment.
          </p>
        </section>

        {/* Data Limitations */}
        <section className="rounded-[8px] bg-[#78350F] p-8 text-[#FFFBEB]">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#FDE68A]">Data Limitations and Future Considerations</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#FFFBEB]">
            This map relies on a validated baseline of 1,699 community-mapped facilities, representing approximately 10% of Kenya&apos;s officially registered facilities. The calculated scores therefore represent a strict minimum baseline.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#FFFBEB]">
            <strong className="text-[#FDE68A]">Example:</strong> Elgeyo-Marakwet County has ~129 facilities in the official Kenya Master Health Facility List, but fewer than 20 are mapped on OpenStreetMap. This creates an artificial score of 1 facility per 454,000 people. The gap between official records and community mapping is precisely where intervention is needed.
          </p>
          <p className="mt-4 text-[14px] font-medium text-[#FDE68A]">
            Every gap in the map is a chance for community members to improve the data.
          </p>
          <div className="mt-4 rounded-[8px] bg-white p-6 text-[#292524]">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#78350F]">
              Procedure for reporting unmapped health facilities
            </h3>
            <ol className="mt-4 list-decimal pl-4 space-y-4 text-[14px] leading-7 text-[#524B3F]">
              <li>Navigate to <a href="https://www.openstreetmap.org/note/new">OpenStreetMap</a>.</li>
              <li>Identify the precise geographic coordinates of the facility.</li>
              <li>
                Submit a note with the following template:
                <div className="mt-2 rounded-[4px] bg-[#F8F5F0] p-2 text-[12px] font-mono text-[#6B6355] select-all">
                  Missing health facility: [facility name]. This facility serves the community but is not currently mapped. Location verified by community health workers.
                </div>
              </li>
              <li>Submit the record for verification.</li>
            </ol>
          </div>
        </section>

        <SourcesPanel />

        <div className="text-center text-[12px] text-[#A8A08F]">
          <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
        </div>
      </div>
    </div>
  );
}
```

**Report format:**
If everything reads naturally, say "CLEAR".
If you find issues, list each one with file context and a suggested fix.
