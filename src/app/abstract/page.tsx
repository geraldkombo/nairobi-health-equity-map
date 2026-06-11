import Link from "next/link";

export const metadata = {
  title: "Conference Abstract | Kenya Health Equity Map",
  description: "Submission for the 3rd CSS Knowledge Dissemination Forum, Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring.",
};

export default function AbstractPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold font-serif tracking-tight text-stone-800">Conference Abstract</h1>
      <p className="mt-1 text-sm text-stone-500">
        3rd CSS Knowledge Dissemination Forum &middot; Sub-theme 2: Digital Health and Evidence Generation Through Community-Led Monitoring
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">From Data to Demand: A Community-Owned Platform for Health Equity Monitoring Across Kenya&apos;s 47 Counties</h2>
          <p className="mt-2 text-sm text-stone-500">Gerald Kombo &mdash; Independent Researcher and Developer, Kenya Health Equity Map</p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Introduction</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Community-led monitoring requires evidence that people can understand and use. Kenya&apos;s national statistics often mask deep local disparities. When data stays locked in technical reports, inequity remains invisible. The Kenya Health Equity Map solves this by translating complex data into a plain-language Priority Gap Score (0&ndash;100), showing exactly where the health system is failing.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Description of Intervention</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The platform is a free digital tool designed for the digitally excluded. After a single load, it works fully offline on basic smartphones with no login and no data collection. Users can tap a county, see its score, and view a one-page evidence brief. The score itself is a transparent calculation combining travel time, clinic crowding, and poverty.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Findings and Lessons Learned</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Turkana scores 92 out of 100. A mother there faces 90 minutes of travel time to the nearest clinic, 47% of births happen at home, and 42.6% of households live in poverty. Nairobi scores 40, with 618 mapped facilities and 16.5% poverty. This 52-point gap means a woman in Turkana travels 90 minutes for basic care, while a Nairobi resident finds a clinic minutes from home. Communities in Turkana, Tana River (score 89, 72.5% poverty), and Elgeyo-Marakwet validated these realities and added missing local clinics to OpenStreetMap themselves.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Conclusion and Next Steps</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            With the evidence loaded on a phone, communities can attend County Health Management Team meetings, legally required under the Kenya Health Act 2017, and hold planners accountable: &ldquo;Last year Turkana scored 92 out of 100. Mothers there faced 90 minutes of travel time to a clinic and nearly half of births happened at home. What has changed since then?&rdquo; The platform operates at zero cost, relies on no donor funding, and is free for any community to use.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Keywords</h2>
          <p className="mt-3 text-sm text-stone-600">
            Digital Health, Community-Led Monitoring, Health Equity, Civic Technology, Kenya
          </p>
        </section>

        <div className="text-center text-xs text-stone-400">
          <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
        </div>
      </div>
    </div>
  );
}
