import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-stone-800">Methodology</h1>
      <p className="mt-1 text-sm text-stone-500">
        How the Priority Gap Score (PGS) works, what it measures, and its limitations.
      </p>

      <div className="mt-8 space-y-8">
        {/* ── PGS Overview ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Priority Gap Score (PGS)</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The PGS is a composite index that combines three dimensions of health-access inequity into a single
            transparent score between 0 (lower priority) and 100 (higher priority). It enables comparison
            across Kenya&apos;s 47 counties using entirely open data.
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
                Gather county boundaries, facility locations, population figures, and poverty indicators from open sources.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">2</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Normalise</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Apply absolute-threshold normalisation dividing by fixed denominators (travel time / 100,
                poverty / 100, population / 5M, facility density / 1), then invert facility density.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">3</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Weight &amp; Combine</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Apply configurable weights to accessibility, vulnerability, and population pressure dimensions.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">4</div>
              <h3 className="mt-3 text-sm font-semibold text-stone-800">Score &amp; Compare</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Each county receives a 0&ndash;100 Priority Gap Score. Higher scores indicate greater access inequity.
              </p>
            </div>
          </div>
        </section>

        {/* ── Travel Time Modelling ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Travel Time Modelling</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Average travel time is derived from cost-distance spatial modelling algorithms
            (<a href="https://kemri-wellcome.org/programmes/geographic-access/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">KEMRI-Wellcome Trust</a>
            {" / "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">AccessMod</a>
            {" "}methodology). It does not rely on straight-line Euclidean distance.
            Instead, it calculates the &ldquo;least-cost path&rdquo; by simulating a combined transport model&mdash;factoring
            in walking speeds across varied land cover (<a href="https://worldcover.esa.int/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">ESA WorldCover</a>)
            and topography, combined with motorized and non-motorized travel speeds along officially mapped primary,
            secondary, and rural road networks (<a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">OSM Kenya</a>).
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <h3 className="text-sm font-semibold text-stone-800">Walking (Off-road)</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                The model calculates time to walk from a given location across natural terrain to the nearest
                road. Walking speed varies by land cover: slower through dense shrubs, faster on bare land or
                grassland.
              </p>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <h3 className="text-sm font-semibold text-stone-800">Motorized &amp; Non-Motorized (On-road)</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Once the simulated person reaches a road, speed shifts by road classification: primary roads
                assume motorized transport (~50 km/h), while rural roads assume cycling or walking (5&ndash;10 km/h).
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="text-sm font-semibold text-stone-800">Calculation Method</h3>
            <p className="mt-1 text-xs leading-5 text-stone-600">
              Researchers use Geographic Information Systems (GIS) running a &ldquo;Least-Cost Path&rdquo; algorithm
              (implemented in WHO <strong>AccessMod</strong>). The algorithm overlays GPS coordinates of health
              facilities, road networks from the Ministry of Transport and OpenStreetMap, and satellite-derived
              friction surfaces (land use, topography, barriers). It calculates the fastest route from every
              100 m grid square to the nearest facility. Granular grid times are then averaged to produce the
              county-level or ward-level statistics used in this platform.
            </p>
          </div>
        </section>

        {/* ── Components ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Components</h2>
          <div className="mt-4 space-y-5 text-sm leading-6 text-stone-700">
            <div className="border-l-4 border-stone-700 pl-4">
              <h3 className="font-medium text-stone-800">Accessibility &ndash; 40% (default)</h3>
              <p className="mt-1 text-stone-600">
                Combines travel time proxy (60%) and facility density (40%, inverted). Measures how
                easily residents can reach health services. Longer travel times and lower facility
                density increase the score.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-stone-400">
                Sources:{" "}
                <a href="https://geoportal.icpac.net/layers/geonode:kenya_health_facilities" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">ICPAC/KEMRI Health Facilities</a>
                {" · "}
                <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">WHO AccessMod travel time model</a>
                {" · "}
                <a href="https://www.openstreetmap.org/relation/192798" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">OSM Kenya road network</a>
              </p>
            </div>
            <div className="border-l-4 border-[#EA580C] pl-4">
              <h3 className="font-medium text-stone-800">Vulnerability &ndash; 30% (default)</h3>
              <p className="mt-1 text-stone-600">
                Uses poverty proxy as a socio-economic indicator drawn from the Kenya Integrated Household Budget Survey. Counties with higher poverty rates
                face greater barriers to accessing care, increasing the score.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-stone-400">
                Sources:{" "}
                <a href="https://www.knbs.or.ke/kihbs-2015-16/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KIHBS 2015/16 county poverty estimates</a>
                {" · "}
                <a href="https://databank.worldbank.org/source/kenya-poverty-and-equity" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">World Bank Kenya poverty data</a>
              </p>
            </div>
            <div className="border-l-4 border-[#F59E0B] pl-4">
              <h3 className="font-medium text-stone-800">Population Pressure &ndash; 30% (default)</h3>
              <p className="mt-1 text-stone-600">
                Uses total population from the 2019 Kenya Population and Housing Census as a proxy for service demand. Larger populations may strain
                available health resources, increasing the score.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-stone-400">
                Source:{" "}
                <a href="https://www.knbs.or.ke/census-2019/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-600">KNBS 2019 Kenya Population and Housing Census</a>
              </p>
            </div>
          </div>
        </section>

        {/* ── Formula ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Formula</h2>
          <div className="mt-3 rounded-lg bg-stone-50 p-5 text-xs leading-6 text-stone-700">
            <p className="font-mono text-sm font-semibold text-stone-800">PGS = (A &times; W<sub>a</sub>) + (V &times; W<sub>v</sub>) + (P &times; W<sub>p</sub>)</p>
            <p className="mt-2 text-stone-400">Where W<sub>a</sub> + W<sub>v</sub> + W<sub>p</sub> = 1.0</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-semibold text-stone-800">40%</div>
                <div className="text-stone-400">Accessibility</div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-semibold text-stone-800">30%</div>
                <div className="text-stone-400">Vulnerability</div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-semibold text-stone-800">30%</div>
                <div className="text-stone-400">Pop. Pressure</div>
              </div>
            </div>
            <p className="mt-3 text-stone-400">
              Each component is normalised against absolute thresholds (travel time / 100, poverty / 100,
              population / 5,000,000, facility density / 1) before aggregation. Scores are time-stable and
              comparable across data refreshes.
            </p>
          </div>
        </section>

        {/* ── Why These Proxies ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Why These Proxies?</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Travel time and facility density are well-established spatial access measures in health geography
            (<a href="https://kemri-wellcome.org/programmes/geographic-access/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">KEMRI/Wellcome Trust</a>).
            Population proxies for demand pressure, and poverty proxies for vulnerability, are standard in
            equity-focussed health planning
            (<a href="https://www.knbs.or.ke/kihbs-2015-16/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">KIHBS</a>,
            <a href="https://www.knbs.or.ke/census-2019/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">KNBS Census</a>).
            These were chosen because they can be derived from open data sources
            without requiring access to restricted health information systems. Travel time methodology follows the
            <a href="https://kemri-wellcome.org/programmes/geographic-access/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900"> KEMRI-Wellcome Trust</a>
            {" / "}
            <a href="https://www.accessmod.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-900">AccessMod</a>
            {" "}combined transport network model, ensuring spatial access estimates
            reflect real-world conditions rather than straight-line distance.
          </p>
        </section>

        {/* ── Limitations ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Limitations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">
            <li>
              <strong>Proxy indicators:</strong> The PGS is built from proxy indicators, not clinical outcome measures.
              It indicates relative priority, not absolute need.
            </li>
            <li>
              <strong>Data quality:</strong> Current facility coverage is limited to the ICPAC/KEMRI dataset.
              Real-world deployment requires comprehensive MFL data from the Ministry of Health.
            </li>
            <li>
              <strong>Spatial granularity:</strong> County-level analysis masks within-county disparities.
              Finer-resolution ward-level data would enable more granular analysis.
            </li>
            <li>
              <strong>No quality dimension:</strong> The score does not capture facility capacity, staffing, drug
              availability, or quality of care.
            </li>
            <li>
              <strong>Equal weighting assumption:</strong> Default weights are based on literature review but should
              be validated with local stakeholders.
            </li>
            <li>
              <strong>Travel time uncertainty:</strong> Modelled travel times depend on road network completeness
              and land-cover data resolution. Unpaved and seasonal roads may not be fully captured, and
              100 m grid aggregation introduces smoothing.
            </li>
          </ul>
        </section>

        <SourcesPanel />
      </div>
    </div>
  );
}
