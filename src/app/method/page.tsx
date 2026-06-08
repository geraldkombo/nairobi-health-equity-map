import Link from "next/link";
import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-amber-900">Methodology Framework</h1>
      <p className="mt-1 text-sm text-stone-500 border-l-4 border-orange-600 pl-4">
        Health equity necessitates transparent methodologies. All algorithms and calculations remain publicly accessible and documented.
      </p>

      <div className="mt-8 space-y-8">
        {/* ── PGS ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">The Priority Gap Score (PGS)</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The Priority Gap Score (PGS) is a composite index ranging from <strong>0 to 100</strong>
            that quantifies the degree of health inequity within each county. Higher values indicate
            more severe gaps in healthcare access and greater urgency for resource allocation and
            community intervention. The methodology is published in full below and can be
            independently verified by any user.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            <strong>Turkana</strong> (PGS 92) and <strong>Mandera</strong> (PGS 91) represent the
            most underserved counties, while <strong>Nairobi</strong> (PGS 40) benefits from a
            higher concentration of health infrastructure and lower poverty rates.
          </p>
        </section>

        {/* ── Three Components ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">Score Components</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-stone-50 p-5">
              <h3 className="font-bold text-orange-700">1. Vulnerability</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Proportion of the county population living below the poverty line. Higher poverty
                rates reduce a household&apos;s capacity to absorb out-of-pocket health expenditures
                and transport costs associated with seeking care.
              </p>
            </div>
            <div className="rounded-lg bg-stone-50 p-5">
              <h3 className="font-bold text-orange-700">2. Physical Access</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Mean travel time to the nearest mapped health facility, computed across the
                county population using least-cost path analysis along road and path networks.
              </p>
            </div>
            <div className="rounded-lg bg-stone-50 p-5">
              <h3 className="font-bold text-orange-700">3. Population Pressure</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Population-to-facility ratio, reflecting the demand pressure on existing health
                infrastructure. Higher ratios are associated with longer wait times, stockouts,
                and reduced service quality.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-stone-50 p-4 text-xs leading-6 text-stone-600">
            <p className="font-semibold text-stone-700">Aggregation method:</p>
            <p className="mt-1">
              <strong>PGS</strong> = Accessibility (40%) + Vulnerability (30%) + Population Pressure (30%).
              Each component is normalised to a 0&ndash;1 scale prior to aggregation, enabling
              combination of heterogeneous units (minutes, percentages, population counts).
              The result is multiplied by 100 to produce a final score out of 100.
            </p>
          </div>
        </section>

        {/* ── How travel time is calculated ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">Travel time estimation</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Travel time estimates are derived using AccessMod, a WHO-supported geographic
            accessibility modelling tool developed by researchers at KEMRI-Wellcome Trust.
            The model computes least-cost travel paths along the road and path network
            derived from OpenStreetMap, applying mode-specific speed assumptions based on
            road surface classification: paved roads are assigned motorised transport speeds,
            while unpaved and informal paths are assigned pedestrian or bicycle speeds.
          </p>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            This model was developed by researchers at KEMRI-Wellcome Trust and WHO using an open
            tool called{" "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">AccessMod</a>.
            Road data comes from{" "}
            <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">OpenStreetMap</a>.
          </p>
        </section>

        {/* ── Why these three measures ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">Rationale for selected indicators</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            These three dimensions are well established in health-access literature. Travel time
            and facility density measure <strong>physical accessibility</strong> of care. Poverty
            rates approximate <strong>economic accessibility</strong> — a household&apos;s capacity to
            afford transport, consultation fees, and treatment. Population-to-facility ratios
            capture <strong>demand pressure</strong> on available services.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            All constituent datasets are drawn from publicly accessible sources — Kenya National
            Bureau of Statistics (KNBS), the Kenya Demographic and Health Survey (KDHS), WHO
            AccessMod, and OpenStreetMap — ensuring that every input can be independently
            verified by researchers, advocates, and community members.
          </p>
        </section>

        {/* ── Data Limitations: An Invitation to Act ── */}
        <section className="rounded-xl bg-amber-900 p-6 text-white shadow-md">
          <h2 className="text-base font-bold text-orange-400">Data Limitations and Future Considerations</h2>
          <p className="mt-3 text-sm leading-6 text-stone-100">
            While this map is a powerful tool for advocacy, it relies on a validated baseline of
            1,699 community-mapped facilities, representing approximately 10% of Kenya&apos;s officially
            registered facilities. Therefore, the calculated accessibility scores represent a strict
            minimum baseline of healthcare availability.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-100">
            <strong className="text-orange-300">Example:</strong> Elgeyo-Marakwet County has
            approximately 129 health facilities in the official Kenya Master Health Facility List,
            but fewer than 20 are mapped on OpenStreetMap. This creates an artificial population
            pressure showing 1 mapped facility per 454,000 people. The gap between official records
            and community mapping is precisely where CLM action is needed.
          </p>
          <p className="mt-4 text-sm font-medium text-orange-200">
            We view this limitation not as a flaw, but as a direct opportunity for Community-Led
            Monitoring.
          </p>
          <div className="mt-4 rounded-sm bg-white p-5 text-stone-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Procedure for reporting unmapped health facilities
            </h3>
            <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm text-stone-700">
              <li>
                Navigate to the OpenStreetMap platform.
              </li>
              <li>
                Identify the precise geographic coordinates of the facility.
              </li>
              <li>
                Input the required facility specifications.
                <div className="mt-1 rounded bg-stone-100 p-2 text-xs font-mono text-stone-600 select-all">
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
              className="mt-4 inline-flex items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 transition-colors"
            >
              Report unmapped facility via OpenStreetMap
            </a>
          </div>
        </section>

        <SourcesPanel />

        <div className="text-center text-xs text-stone-400">
          <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
        </div>
      </div>
    </div>
  );
}
