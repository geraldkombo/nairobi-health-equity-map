import Link from "next/link";

export const metadata = {
  title: "Data Use Agreement | Kenya Health Equity Map",
  description: "Data sources, licenses, attribution requirements, and citation guidelines for the Kenya Health Equity Map.",
};

function SourceRow({ name, url, license }: { name: string; url: string; license: string }) {
  return (
    <tr className="border-b border-stone-100 text-sm">
      <td className="py-2.5 pr-4 text-stone-800 font-medium">{name}</td>
      <td className="py-2.5 pr-4">
        <a href={url} target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 break-all">{url}</a>
      </td>
      <td className="py-2.5 text-stone-600">{license}</td>
    </tr>
  );
}

export default function DUAPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold font-serif tracking-tight text-stone-800">Data Use Agreement</h1>
      <p className="mt-1 text-sm text-stone-500">
        How data is sourced, attributed, and licensed on this platform.
      </p>

      <div className="mt-8 space-y-8">
        {/* ── Principles ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Open Data Principles</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The Kenya Health Equity Map is built entirely on open civic data. Every indicator, boundary, and
            facility location displayed on this platform can be traced to a publicly available source.
            We believe transparency in methodology builds trust with the communities and stakeholders
            who use this tool for planning and advocacy.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            By using this platform, you agree to attribute the original data creators in any derivative
            work, publication, or research that incorporates data presented here.
          </p>
        </section>

        {/* ── Source Register ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Source Register</h2>
          <p className="mt-1 text-sm text-stone-500">
            Every dataset used in this platform, its license, and the date it was accessed.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="pb-2 pr-4 text-left">Dataset</th>
                  <th className="pb-2 pr-4 text-left">Source URL</th>
                  <th className="pb-2 text-left">License</th>
                </tr>
              </thead>
              <tbody>
                <SourceRow
                  name="KNBS 2019 Census (Population)"
                  url="https://statistics.knbs.or.ke/nada/index.php/catalog/116"
                  license="Open Data"
                />
                <SourceRow
                  name="KDHS 2022 (Poverty Estimates)"
                  url="https://dhsprogram.com/data/dataset/Kenya_Standard-DHS_2022.cfm"
                  license="Restricted (registered use)"
                />
                <SourceRow
                  name="KMHFR Facility Registry"
                  url="https://kmhfr.health.go.ke/"
                  license="Open Data"
                />
                <SourceRow
                  name="ICPAC/KEMRI Health Facilities"
                  url="https://geoportal.icpac.net/layers/geonode:kenya_health/metadata_detail"
                  license="CC-BY-4.0"
                />
                <SourceRow
                  name="IEBC County Boundaries"
                  url="https://github.com/tigawanna/kenya_wards_geojson_data"
                  license="CC-BY-4.0"
                />
                <SourceRow
                  name="KNBS GIS Boundary Files"
                  url="https://statistics.knbs.or.ke/nada/index.php/catalog/116"
                  license="Open Data"
                />
                <SourceRow
                  name="OCHA HDX Kenya Population"
                  url="https://data.humdata.org/dataset/kenya-population-statistics"
                  license="CC-BY-4.0"
                />
                <SourceRow
                  name="OSM Kenya Road Network"
                  url="https://www.openstreetmap.org/relation/192798"
                  license="ODbL-1.0"
                />
                <SourceRow
                  name="ESA WorldCover Land Cover"
                  url="https://esa-worldcover.org/en"
                  license="CC-BY-4.0"
                />
                <SourceRow
                  name="WHO AccessMod"
                  url="https://www.accessmod.org"
                  license="GPL-3.0"
                />
                <SourceRow
                  name="World Bank Kenya Poverty Data"
                  url="https://pip.worldbank.org/country-profiles/KEN"
                  license="CC-BY-4.0"
                />
                <SourceRow
                  name="Geofabrik Kenya OSM Extract"
                  url="https://download.geofabrik.de/africa/kenya.html"
                  license="ODbL-1.0"
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Attribution ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Attribution Requirements</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
            <p>
              <strong>KNBS data</strong> must be attributed as &ldquo;Kenya National Bureau of Statistics,
              2019 Kenya Population and Housing Census.&rdquo; The KNBS terms of use require that any
              publication using KNBS data include a disclaimer that KNBS does not bear responsibility
              for the interpretation or analysis of the data.
            </p>
            <p>
              <strong>ICPAC/KEMRI data</strong> is licensed under CC-BY-4.0. Attribution must include
              &ldquo;ICPAC and KEMRI/Wellcome Trust, Kenya Health Facilities dataset.&rdquo;
            </p>
            <p>
              <strong>OpenStreetMap data</strong> is licensed under the ODbL-1.0. Attribution must
              read &ldquo;OpenStreetMap contributors&rdquo; with a link to
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 ml-1">openstreetmap.org/copyright</a>.
            </p>
            <p>
              <strong>ESA WorldCover</strong> is licensed under CC-BY-4.0. Attribution must include
              &ldquo;European Space Agency, ESA WorldCover 10 m 2021.&rdquo;
            </p>
            <p>
              <strong>WHO AccessMod</strong> is open source under GPL-3.0. Any derivative use of the
              AccessMod methodology must reference the original WHO tool.
            </p>
          </div>
        </section>

        {/* ── Suggested Citation ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Suggested Citation</h2>
          <div className="mt-4 rounded-lg bg-[#FDE68A] p-5 text-sm leading-6 text-stone-800">
            <p className="font-mono">
              Kenya Health Equity Map.
              <em> Map-first civic intelligence platform for health equity across Kenya&apos;s 47 counties.</em>
              Nairobi, Kenya.               Retrieved from https://geraldkombo.github.io/kenya-health-equity-map/
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-500">
              For county-specific briefs, include the county name, Priority Gap Score, and a
            list of source datasets used. Example: &ldquo;Turkana County Brief, Kenya Health Equity Map,
            Sources: KNBS 2019 Census, KIHBS 2015/16, ICPAC/KEMRI Health Facilities.&rdquo;
          </p>
        </section>

        {/* ── Clinical Data Disclaimer ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Clinical Data Disclaimer</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            This platform uses indirect measures to assess gaps in health access. It does not measure
            clinical outcomes, quality of care, or health service readiness. For clinical health data,
            refer to the
            <a href="https://hiskenya.org/" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 ml-1">Kenya Health Information System (KHIS)</a>
            {" "}(DHIS2) maintained by the Ministry of Health, which provides facility-level
            service delivery data, commodity availability, and disease surveillance.
          </p>
        </section>

        {/* Contribute & Share */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold font-serif text-stone-800">Data Contribution and Distribution</h2>
          <div className="mt-4 space-y-5 text-sm leading-6 text-stone-700">
            <div>
              <strong className="text-stone-800">Adding a missing health facility</strong>
              <p className="mt-1">
                Facility location data is sourced from OpenStreetMap (OSM), a free and openly
                editable global geographic database. Users wishing to contribute a missing
                health facility may do so through the following process:
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1 pl-1">
                <li>Register a free account at <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2">openstreetmap.org</a>.</li>
                <li>Navigate to the facility location and select the <strong>Edit</strong> function.</li>
                <li>Place a node and assign the appropriate tags -- facility name, type (hospital, clinic, dispensary), and operational status.</li>
                <li>Submit your changes. The facility will appear on this platform following the next scheduled data refresh.</li>
              </ol>
              <p className="mt-2 text-xs text-amber-700">
                <strong>Data integrity requirement:</strong> Only facilities confirmed through
                physical inspection or verifiable official sources should be submitted. Entries
                based on unverified reports, planned construction, or outdated references
                compromise the reliability of this platform for the communities and stakeholders
                who depend on it for planning and advocacy.
              </p>
            </div>
            <div>
              <strong className="text-stone-800">Sharing a county profile on WhatsApp</strong>
              <p className="mt-1">
                From the main map, select a county to open its detail panel. Use the
                <strong> Share </strong> function to copy the county profile URL, or capture a
                screenshot displaying the county name, Priority Gap Score, and relevant indicators.
                The URL or image may be shared via WhatsApp with accompanying context about the
                data presented. Recipients can access the link on any device without requiring an
                account or application installation.
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
          <p className="text-sm text-stone-500">Inquiries and Data Corrections</p>
          <a
            href="https://wa.me/254706813068"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Contact via WhatsApp
          </a>
        </div>

        <div className="text-xs text-stone-400 text-center">
          <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
        </div>
      </div>
    </div>
  );
}
