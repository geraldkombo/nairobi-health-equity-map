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
            This platform directly supports <strong>SDG 3 (Good Health and Well-being)</strong> by identifying health infrastructure gaps that drive preventable mortality, and <strong>SDG 10 (Reduced Inequalities)</strong> by quantifying within-country disparities that affect rural and marginalised populations.
          </p>
        </section>

        {/* ── PGS ── */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">The Priority Gap Score (PGS)</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The Priority Gap Score (PGS) is a composite index ranging from <strong>0 to 100</strong>
            that quantifies health infrastructure inequity within each county. A higher score indicates
            more severe gaps and greater urgency for resource allocation.
          </p>
          <div className="mt-4 rounded-[6px] bg-[#F8F5F0] p-4 text-[14px] leading-7 text-[#524B3F]">
            <p className="font-semibold text-[#292524]">How to read the score:</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li><strong>0–29:</strong> Relatively equitable resource distribution</li>
              <li><strong>30–49:</strong> Moderate infrastructure gaps</li>
              <li><strong>50–69:</strong> Significant gaps requiring intervention</li>
              <li><strong>70–100:</strong> Severe gaps requiring urgent resource allocation</li>
            </ul>
          </div>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            <strong>Turkana</strong> (PGS 92) and <strong>Mandera</strong> (PGS 91) are the most underserved counties, while <strong>Nairobi</strong> (PGS 40) benefits from higher infrastructure concentration and lower poverty.
          </p>
        </section>

        {/* ── Three Components ── */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Score Components</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            The PGS combines three dimensions, each normalised to a 0–1 scale before aggregation:
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
              <strong>PGS</strong> = (Physical Access × 0.40) + (Vulnerability × 0.30) + (Population Pressure × 0.30)
            </p>
            <p className="text-[12px] leading-5 text-[#6B6355] mt-2">
              Each component is normalised to a 0–1 scale, then the weighted sum is multiplied by 100.
            </p>
          </div>
        </section>

        {/* ── How travel time is calculated ── */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Travel time estimation</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            Travel time estimates use <strong>AccessMod</strong>, a WHO-supported geographic accessibility modelling tool. The model computes least-cost travel paths along OpenStreetMap road networks, applying mode-specific speeds: paved roads use motorised transport speeds, while unpaved roads and paths use walking or bicycle speeds.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            This model was developed by researchers at KEMRI-Wellcome Trust. Road data comes from{" "}
            <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#292524] text-[#EA580C]">OpenStreetMap</a>. Tool:{" "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#292524] text-[#EA580C]">AccessMod</a>.
          </p>
        </section>

        {/* ── Why these three measures ── */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Rationale for selected indicators</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            These three dimensions are well established in health-access literature:
          </p>
          <ul className="mt-4 space-y-4 text-[14px] leading-7 text-[#524B3F]">
<li><strong>Travel time and facility density</strong> measure <strong>physical accessibility</strong>: can a person reach care when needed?</li>

            <li><strong>Poverty rates</strong> approximate <strong>economic accessibility</strong>: whether a household can afford transport, fees, and treatment.</li>

            <li><strong>Population-to-facility ratios</strong> capture <strong>demand pressure</strong>: whether the existing infrastructure is overwhelmed by patient volume.</li>
          </ul>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            All datasets are from publicly accessible sources, including KNBS, KDHS, KIHBS, WHO AccessMod, and OpenStreetMap, ensuring every input can be independently verified.
          </p>
        </section>

        {/* ── Maternal Health Access ── */}
        <section className="rounded-[8px] border border-[#E0DBD0] bg-white p-8">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#78350F]">Maternal Health Access</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#292524]">
            The platform includes county-level <strong>Skilled Birth Attendance (SBA)</strong> rates from the Kenya Demographic and Health Survey (KDHS 2022). SBA measures the proportion of deliveries attended by a skilled health professional, a key indicator of maternal health system performance. Counties with low SBA and high travel time represent <strong>maternal health access deserts</strong> where women face compounded barriers to safe delivery.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#524B3F]">
            SBA data is displayed in the county detail panel and can be used alongside the PGS to identify priority counties for maternal health interventions, mobile clinics, and community health worker deployment.
          </p>
        </section>

        {/* ── Data Limitations ── */}
        <section className="rounded-[8px] bg-[#78350F] p-8 text-[#FFFBEB]">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#FDE68A]">Data Limitations and Future Considerations</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#FFFBEB]">
            This map relies on a validated baseline of 1,699 community-mapped facilities, representing approximately 10% of Kenya&apos;s officially registered facilities. The calculated scores therefore represent a strict minimum baseline.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#FFFBEB]">
            <strong className="text-[#FDE68A]">Example:</strong> Elgeyo-Marakwet County has ~129 facilities in the official Kenya Master Health Facility List, but fewer than 20 are mapped on OpenStreetMap. This creates an artificial score of 1 facility per 454,000 people. The gap between official records and community mapping is precisely where intervention is needed.
          </p>
          <p className="mt-4 text-[14px] font-medium text-[#FDE68A]">
            We view this limitation as an opportunity for community-driven data improvement.
          </p>
          <div className="mt-4 rounded-[8px] bg-white p-6 text-[#292524]">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#78350F]">
              Procedure for reporting unmapped health facilities
            </h3>
            <ol className="mt-4 list-decimal pl-4 space-y-4 text-[14px] leading-7 text-[#524B3F]">
              <li>
                Navigate to <a href="https://www.openstreetmap.org/note/new#map=6/0.5/38.0&layers=N" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2">OpenStreetMap</a>.
              </li>
              <li>
                Identify the precise geographic coordinates of the facility.
              </li>
              <li>
                Submit a note with the following template:
                <div className="mt-2 rounded-[4px] bg-[#F8F5F0] p-2 text-[12px] font-mono text-[#6B6355] select-all">
                  Missing health facility: [facility name]. This facility serves the community but is not currently mapped. Location verified by community health workers.
                </div>
              </li>
              <li>
                Submit the record for verification.
              </li>
            </ol>
            <a
              href="https://www.openstreetmap.org/note/new#map=6/0.5/38.0&layers=N"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center min-h-[44px] rounded-[6px] bg-[#78350F] px-4 py-2 text-[14px] font-bold text-[#FFFBEB] hover:bg-[#451A03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] transition-colors"
            >
              Report unmapped facility via OpenStreetMap
            </a>
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
