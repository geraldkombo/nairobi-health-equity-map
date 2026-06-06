import Link from "next/link";
import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-stone-800">Methodology</h1>
      <p className="mt-1 text-sm text-stone-500">
        How the Priority Gap Score (PGS) works — plain and simple.
      </p>

      <div className="mt-8 space-y-8">
        {/* ── PGS Overview ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Priority Gap Score (PGS)</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The PGS is a number from <strong>0 to 100</strong> that tells you how much trouble people in a county
            face getting health care. A <strong>higher score</strong> means more people are struggling to reach a
            clinic or hospital. A <strong>lower score</strong> means health services are easier to access.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            For example: <strong>Turkana</strong> scores 92 — very hard to access care.
            <strong> Nairobi</strong> scores 40 — much easier with 618 facilities in one city.
          </p>
        </section>

        {/* ── How It Works ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">How It Works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">1</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Collect Data</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                We gather information everyone can access — county maps, where facilities are,
                how many people live there, and poverty levels.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">2</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Put on Same Scale</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Travel time, poverty, and population numbers are all different units. We
                convert each to a 0–1 scale so they can be added together fairly.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">3</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Combine with Weights</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Not all factors matter equally. We give more weight to accessibility (40%)
                than to poverty (30%) or population pressure (30%).
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">4</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Get the Score</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Number comes out between 0 and 100. Turkana got 92 — very urgent.
                Nairobi got 40 — less urgent. The higher, the more help needed.
              </p>
            </div>
          </div>
        </section>

        {/* ── Travel Time Modelling ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Travel Time — How Far Is the Nearest Clinic?</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            We don&apos;t just draw a straight line on a map (&quot;as the crow flies&quot;). That would be cheating.
            Instead, we use a computer model that simulates how a real person would travel to the nearest
            clinic. It follows roads and paths, and accounts for walking speed on different terrain.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <h3 className="text-sm font-semibold text-stone-800">Walking to the Road</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                The model figures out how long it takes to walk from home to the nearest road.
                Walking through thick bush is slow. Walking across open grassland is faster.
                This uses satellite data on land cover.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <h3 className="text-sm font-semibold text-stone-800">Once on the Road</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                When a person reaches a road, the model switches speed. Tarmac roads assume
                motorbike or matatu speed (~50 km/h). Rural dirt roads assume cycling or
                walking speed (5&ndash;10 km/h).
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="text-sm font-semibold text-stone-800">How It&apos;s Calculated</h3>
            <p className="mt-1 text-xs leading-5 text-stone-600">
              Researchers at KEMRI-Wellcome Trust and WHO built this model using a tool called
              <strong> AccessMod</strong>. The computer divides Kenya into a grid of 100m squares.
              For each square, it finds the fastest route to a health facility using roads, paths,
              and walking terrain. All those times are averaged to give each county its travel time
              score.
            </p>
          </div>
        </section>

        {/* ── Components ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Three Things That Make the Score</h2>
          <div className="mt-4 space-y-5 text-sm leading-6 text-stone-700">
            <div className="border-l-4 border-stone-700 pl-4">
              <h3 className="font-medium text-stone-800">Accessibility (40% of score)</h3>
              <p className="mt-1 text-stone-600">
                How easy is it to get to a clinic? We look at travel time (60% of this part)
                and how many facilities exist for the population (40%). If travel is long
                and there are few facilities, the score goes up.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-stone-400">
                Data:{" "}
                <a href="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI facilities</a>
                {" · "}
                <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO travel model</a>
                {" · "}
                <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">OSM roads</a>
              </p>
            </div>
            <div className="border-l-4 border-[#EA580C] pl-4">
              <h3 className="font-medium text-stone-800">Vulnerability (30% of score)</h3>
              <p className="mt-1 text-stone-600">
                A simple question: how many people in this county live in poverty? If a
                county is very poor (like Tana River at 72.5%), families can&apos;t afford
                transport, hospital fees, or medicines. The score goes up.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-stone-400">
                Data:{" "}
                <a href="https://www.knbs.or.ke/kihbs/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16</a>
                {" · "}
                <a href="https://pip.worldbank.org/country-profiles/KEN" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">World Bank</a>
              </p>
            </div>
            <div className="border-l-4 border-[#F59E0B] pl-4">
              <h3 className="font-medium text-stone-800">Population Pressure (30% of score)</h3>
              <p className="mt-1 text-stone-600">
                How many people share one health facility? If 454,000 people rely on a
                single clinic (like Elgeyo-Marakwet), that clinic can&apos;t serve everyone.
                The score goes up.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-stone-400">
                Data:{" "}
                <a href="https://www.knbs.or.ke/census/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Census</a>
              </p>
            </div>
          </div>
        </section>

        {/* ── The Simple Formula ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">The Simple Formula</h2>
          <div className="mt-3 rounded-lg bg-stone-50 p-5 text-xs leading-6 text-stone-700">
            <p className="font-mono text-sm font-semibold text-stone-800">Score = (Accessibility &times; 0.4) + (Vulnerability &times; 0.3) + (Population Pressure &times; 0.3)</p>
            <p className="mt-2 text-stone-400">The weights (0.4 + 0.3 + 0.3) always add up to 1.0</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-semibold text-stone-800">40%</div>
                <div className="text-stone-400">Travel + Facilities</div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-semibold text-stone-800">30%</div>
                <div className="text-stone-400">Poverty</div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-semibold text-stone-800">30%</div>
                <div className="text-stone-400">People per Facility</div>
              </div>
            </div>
            <p className="mt-3 text-stone-400">
              Before adding, each piece is converted to a 0&ndash;1 scale. Travel time is divided by
              100 minutes, poverty by 100%, population per facility by 10,000. This keeps everything
              fair. The final number is multiplied by 100 to give a score out of 100.
            </p>
          </div>
        </section>

        {/* ── Why We Chose These Three Things ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Why These Three Things?</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Researchers who study health access have used the same three measures for decades
            (<a href="https://kemri-wellcome.org/press-release-launch-of-comprehensive-public-health-facility-inventory-for-sub-saharan-africa/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">KEMRI/Wellcome Trust</a>).
            Travel time and number of facilities tell you about <strong>physical access</strong>.
            Poverty tells you about <strong>ability to pay</strong>. Population tells you about
            <strong>demand</strong> — how many people are fighting for the same bed.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Most importantly, all this data is <strong>publicly available</strong>. You don&apos;t
            need special permission or a government login to see it. Anyone can verify the numbers.
          </p>
        </section>

        {/* ── Limitations ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">What This Score Does NOT Tell You</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">
            <li>
              <strong>No clinical data:</strong> The score uses travel time, poverty, and population — not
              how many people actually got sick or died. It shows <em>risk</em>, not <em>outcome</em>.
            </li>
            <li>
              <strong>Partial facility list:</strong> We currently have 1,699 facilities from OpenStreetMap
              and ICPAC/KEMRI. Kenya has about 17,400+ registered facilities. Many clinics and
              dispensaries are missing — especially in remote areas.
            </li>
            <li>
              <strong>County-level only:</strong> One number for the whole county. If you live in a
              remote ward of a big county, your reality might be worse than the average shows.
            </li>
            <li>
              <strong>No quality check:</strong> The score doesn&apos;t tell you whether a facility has
              a doctor, drugs, or running water. Just that it exists on a map.
            </li>
            <li>
              <strong>Default weights are estimates:</strong> We set accessibility at 40%, poverty at 30%,
              demand at 30%. These numbers come from research, but communities may disagree. That&apos;s
              why we plan to make them adjustable.
            </li>
          </ul>
        </section>

        <SourcesPanel />

        <div className="text-center text-xs text-stone-400">
          <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
        </div>
      </div>
    </div>
  );
}
