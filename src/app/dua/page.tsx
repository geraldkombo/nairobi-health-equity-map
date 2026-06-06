import Link from "next/link";

export const metadata = {
  title: "Data Use Agreement | Kenya Health Equity Map",
  description: "Data sources, licenses, attribution requirements, and citation guidelines for the Kenya Health Equity Map.",
};

function SourceRow({ name, url, license, accessDate }: { name: string; url: string; license: string; accessDate: string }) {
  return (
    <tr className="border-b border-stone-100 text-sm">
      <td className="py-2.5 pr-4 text-stone-800 font-medium">{name}</td>
      <td className="py-2.5 pr-4">
        <a href={url} target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 break-all">{url}</a>
      </td>
      <td className="py-2.5 pr-4 text-stone-600">{license}</td>
      <td className="py-2.5 text-stone-500 whitespace-nowrap">{accessDate}</td>
    </tr>
  );
}

export default function DUAPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-stone-800">Data Use Agreement</h1>
      <p className="mt-1 text-sm text-stone-500">
        How data is sourced, attributed, and licensed on this platform.
      </p>

      <div className="mt-8 space-y-8">
        {/* ── Principles ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Open Data Principles</h2>
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
          <h2 className="text-base font-semibold text-stone-800">Source Register</h2>
          <p className="mt-1 text-sm text-stone-500">
            Every dataset used in this platform, its license, and the date it was accessed.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="pb-2 pr-4 text-left">Dataset</th>
                  <th className="pb-2 pr-4 text-left">Source URL</th>
                  <th className="pb-2 pr-4 text-left">License</th>
                  <th className="pb-2 text-left">Accessed</th>
                </tr>
              </thead>
              <tbody>
                <SourceRow
                  name="KNBS 2019 Census (Population)"
                  url="https://www.knbs.or.ke/census-2019/"
                  license="Open Data"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="KDHS 2022 (Poverty Estimates)"
                  url="https://dhsprogram.com/data/dataset/Kenya_Standard-DHS_2022.cfm"
                  license="Restricted (registered use)"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="KMHFR Facility Registry"
                  url="https://kmhfr.health.go.ke/"
                  license="Open Data"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="ICPAC/KEMRI Health Facilities"
                  url="https://geoportal.icpac.net/layers/geonode:kenya_health_facilities"
                  license="CC-BY-4.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="IEBC County Boundaries"
                  url="https://github.com/tigawanna/kenya_wards_geojson_data"
                  license="CC-BY-4.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="KNBS GIS Boundary Files"
                  url="https://www.knbs.or.ke/gis-boundary-files/"
                  license="Open Data"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="OCHA HDX Kenya Population"
                  url="https://data.humdata.org/dataset/kenya-population-statistics"
                  license="CC-BY-4.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="OSM Kenya Road Network"
                  url="https://www.openstreetmap.org/relation/192798"
                  license="ODbL-1.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="ESA WorldCover Land Cover"
                  url="https://worldcover.esa.int/"
                  license="CC-BY-4.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="WHO AccessMod"
                  url="https://www.accessmod.org"
                  license="GPL-3.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="World Bank Kenya Poverty Data"
                  url="https://databank.worldbank.org/source/kenya-poverty-and-equity"
                  license="CC-BY-4.0"
                  accessDate="2026-06-05"
                />
                <SourceRow
                  name="Geofabrik Kenya OSM Extract"
                  url="https://download.geofabrik.de/africa/kenya.html"
                  license="ODbL-1.0"
                  accessDate="2026-06-05"
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Attribution ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Attribution Requirements</h2>
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
          <h2 className="text-base font-semibold text-stone-800">Suggested Citation</h2>
          <div className="mt-4 rounded-lg bg-[#FDE68A] p-5 text-sm leading-6 text-stone-800">
            <p className="font-mono">
              Kenya Health Equity Map. (2026).
              <em> Map-first civic intelligence platform for health equity across Kenya&apos;s 47 counties.</em>
              Nairobi, Kenya. Retrieved from https://ke-health-equity.netlify.app
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            For county-specific briefs, include the county name, PGS score, generation date, and a
            list of source datasets used. Example: &ldquo;Turkana County Brief, Kenya Health Equity Map,
            generated 2026-06-06. Sources: KNBS 2019 Census, KIHBS 2015/16, ICPAC/KEMRI Health Facilities.&rdquo;
          </p>
        </section>

        {/* ── Clinical Data Disclaimer ── */}
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-800">Clinical Data Disclaimer</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            This platform uses proxy indicators to assess health access inequity. It does not measure
            clinical outcomes, quality of care, or health service readiness. For clinical health data,
            refer to the
            <a href="https://hiskenya.org/" target="_blank" rel="noreferrer" className="text-[#EA580C] underline underline-offset-2 ml-1">Kenya Health Information System (KHIS)</a>
            {" "}(DHIS2) maintained by the Ministry of Health, which provides facility-level
            service delivery data, commodity availability, and disease surveillance.
          </p>
        </section>

        <div className="text-xs text-stone-400 text-center">
          <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
        </div>
      </div>
    </div>
  );
}
