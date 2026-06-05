import SourcesPanel from "@/components/SourcesPanel";

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Methodology</h1>
      <p className="mt-1 text-sm text-neutral-500">
        How the Priority Gap Score (PGS) works, what it measures, and its limitations.
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Priority Gap Score (PGS)</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            The PGS is a composite index that combines three dimensions of health-access inequity into a single
            transparent score between 0 (lower priority) and 100 (higher priority). It enables comparison
            across Kenya&apos;s 47 counties using entirely open data.
          </p>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">How It Works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">1</div>
              <h3 className="mt-3 text-sm font-semibold text-neutral-900">Collect Data</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Gather county boundaries, facility locations, population figures, and poverty indicators from open sources.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">2</div>
              <h3 className="mt-3 text-sm font-semibold text-neutral-900">Normalise</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Min-max normalise each indicator across all counties so every value falls between 0 and 1.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">3</div>
              <h3 className="mt-3 text-sm font-semibold text-neutral-900">Weight &amp; Combine</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Apply configurable weights to accessibility, vulnerability, and population pressure dimensions.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">4</div>
              <h3 className="mt-3 text-sm font-semibold text-neutral-900">Score &amp; Compare</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Each county receives a 0&ndash;100 Priority Gap Score. Higher scores indicate greater access inequity.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Components</h2>
          <div className="mt-4 space-y-5 text-sm leading-6 text-neutral-700">
            <div className="border-l-4 border-accent-500 pl-4">
              <h3 className="font-medium text-neutral-900">Accessibility &mdash; 40% (default)</h3>
              <p className="mt-1 text-neutral-600">
                Combines travel time proxy (60%) and facility density (40%, inverted). Measures how easily residents can reach health services. Longer travel times and lower facility density increase the score.
              </p>
            </div>
            <div className="border-l-4 border-warm-500 pl-4">
              <h3 className="font-medium text-neutral-900">Vulnerability &mdash; 30% (default)</h3>
              <p className="mt-1 text-neutral-600">
                Uses poverty proxy as a socio-economic indicator. Counties with higher poverty rates face greater barriers to accessing care, increasing the score.
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-medium text-neutral-900">Population Pressure &mdash; 30% (default)</h3>
              <p className="mt-1 text-neutral-600">
                Uses total population as a proxy for service demand. Larger populations may strain available health resources, increasing the score.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Formula</h2>
          <div className="mt-3 rounded-lg bg-neutral-50 p-5 font-mono text-xs leading-6 text-neutral-700">
            <p className="text-sm font-semibold text-neutral-900">PGS = (A × W<sub>a</sub>) + (V × W<sub>v</sub>) + (P × W<sub>p</sub>)</p>
            <p className="mt-2 text-neutral-400">Where W<sub>a</sub> + W<sub>v</sub> + W<sub>p</sub> = 1.0</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-neutral-900 font-semibold">40%</div>
                <div className="text-neutral-400">Accessibility</div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-neutral-900 font-semibold">30%</div>
                <div className="text-neutral-400">Vulnerability</div>
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <div className="text-neutral-900 font-semibold">30%</div>
                <div className="text-neutral-400">Pop. Pressure</div>
              </div>
            </div>
            <p className="mt-3 text-neutral-400">Each component is min-max normalised across all 47 counties before aggregation.</p>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Limitations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>
              <strong>Proxy indicators:</strong> The PGS is built from proxy indicators, not clinical outcome measures.
              It indicates relative priority, not absolute need.
            </li>
            <li>
              <strong>Data quality:</strong> Current facility coverage is limited to the ICPAC/KEMRI dataset (218 facilities across Kenya).
              Real-world deployment requires comprehensive MFL data.
            </li>
            <li>
              <strong>Spatial granularity:</strong> County-level analysis masks within-county disparities.
              Sub-county analysis would provide a more granular picture.
            </li>
            <li>
              <strong>No quality dimension:</strong> The score does not capture facility capacity, staffing, drug
              availability, or quality of care.
            </li>
            <li>
              <strong>Equal weighting assumption:</strong> Default weights are based on literature review but should
              be validated with local stakeholders.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Why These Proxies?</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            Travel time and facility density are well-established spatial access measures in health geography.
            Population proxies for demand pressure, and poverty proxies for vulnerability, are standard in
            equity-focussed health planning. These were chosen because they can be derived from open data sources
            without requiring access to restricted health information systems.
          </p>
        </section>

        <SourcesPanel />
      </div>
    </div>
  );
}
