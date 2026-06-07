import Link from "next/link";
import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-amber-900">Measuring equity in plain language</h1>
      <p className="mt-1 text-sm text-stone-500 border-l-4 border-orange-600 pl-4">
        Data justice means transparent methodologies. No black box algorithms. No hidden calculations.
      </p>

      <div className="mt-8 space-y-8">
        {/* ── PGS ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">The Priority Gap Score (PGS)</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Instead of relying on complicated academic formulas, this map calculates a straightforward
            health equity score ranging from <strong>0 to 100</strong> for each county. A higher score
            signifies a greater level of health inequity and an urgent need for community intervention.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            For example: <strong>Turkana</strong> scores 92 - very hard to access care.
            <strong> Nairobi</strong> scores 40 - much easier with 618 facilities in one city.
          </p>
        </section>

        {/* ── Three Components ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">Three things that make the score</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-stone-50 p-5">
              <h3 className="font-bold text-orange-700">1. Vulnerability</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Measures the percentage of people living below the poverty line. Communities in
                poverty cannot absorb out-of-pocket health or transport costs.
              </p>
            </div>
            <div className="rounded-lg bg-stone-50 p-5">
              <h3 className="font-bold text-orange-700">2. Physical Access</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Measures how many minutes it actually takes a person to walk, cycle, or find
                transport to the nearest mapped health facility.
              </p>
            </div>
            <div className="rounded-lg bg-stone-50 p-5">
              <h3 className="font-bold text-orange-700">3. Population Pressure</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Measures how many thousands of people are forced to rely on a single local clinic,
                leading to drug stockouts and long wait times.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-stone-50 p-4 text-xs leading-6 text-stone-600">
            <p className="font-semibold text-stone-700">How they combine:</p>
            <p className="mt-1">
              <strong>Score</strong> = Accessibility (40%) + Vulnerability (30%) + Population Pressure (30%).
              Each piece is converted to a 0-1 scale first so different units (minutes, percentages,
              population counts) can be added together fairly. The final number is multiplied by 100
              to give a score out of 100.
            </p>
          </div>
        </section>

        {/* ── How travel time is calculated ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">How we estimate travel time</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            We don&apos;t just draw a straight line on a map. Instead, we use a computer model that
            simulates how a real person would travel to the nearest clinic. It follows roads and
            paths, and accounts for walking speed on different terrain. Tarmac roads assume motorbike
            or matatu speed. Rural dirt roads assume cycling or walking speed.
          </p>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            This model was developed by researchers at KEMRI-Wellcome Trust and WHO using an open
            tool called{" "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">AccessMod</a>.
            Road data comes from{" "}
            <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">OpenStreetMap</a>.
          </p>
        </section>

        {/* ── Why these three things ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-bold text-amber-900">Why these three measures</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Researchers who study health access have used the same three measures for decades.
            Travel time and number of facilities tell you about <strong>physical access</strong>.
            Poverty tells you about <strong>ability to pay</strong>. Population tells you about
            <strong> demand</strong> - how many people are fighting for the same bed.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Most importantly, all this data is <strong>publicly available</strong>. You don&apos;t
            need special permission or a government login to see it. Anyone can verify the numbers.
          </p>
        </section>

        {/* ── Data Limitations: An Invitation to Act ── */}
        <section className="rounded-xl bg-amber-900 p-6 text-white shadow-md">
          <h2 className="text-base font-bold text-orange-400">Data Limitations: An Invitation to Act</h2>
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
              How to report a missing clinic
            </h3>
            <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm text-stone-700">
              <li>
                Tap the button below. It opens a map of your area on OpenStreetMap.
              </li>
              <li>
                Click or tap the exact location where the missing clinic or dispensary is situated.
                A pin will drop on the map.
              </li>
              <li>
                In the text box, paste this message (or write your own):
                <div className="mt-1 rounded bg-stone-100 p-2 text-xs font-mono text-stone-600 select-all">
                  Missing health facility: [clinic name]. This facility serves our community but is not on the map. Please add it. Location verified by community health workers.
                </div>
              </li>
              <li>
                Click &quot;Add Note&quot; - your report is now visible to the volunteer community that
                maintains the map. No account needed.
              </li>
            </ol>
            <a
              href="https://www.openstreetmap.org/note/new#map=6/0.5/38.0&layers=N"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 transition-colors"
            >
              Report a missing facility on OpenStreetMap
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
