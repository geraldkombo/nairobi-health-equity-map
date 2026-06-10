import Link from "next/link";

export const metadata = {
  title: "CSS Forum Exhibition | Kenya Health Equity Map",
  description:
    "Digital Health and Evidence Generation Through Community-Led Monitoring. A verifiable, offline-first civic tech platform.",
};

export default function ForumPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-12 px-4 py-8 text-stone-800">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-stone-900">Kenya Health Equity Map</h1>
        <p className="text-xl text-stone-600">
          Digital Health Evidence Generation for Community-Led Monitoring
        </p>
      </header>

      <section className="flex flex-col items-center gap-6 rounded-xl border border-blue-200 bg-blue-50 p-6 md:flex-row">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-800"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warm-600"><path d="M2 22h20"/><path d="M6.36 17.4 4 22h16l-2.36-4.6"/><path d="M12 2v8"/><path d="m9 7 3-3 3 3"/></svg>
            Test Offline Mode
          </h2>
          <p className="text-lg">
            Scan the code or load the platform. Once loaded, switch your device to{" "}
            <strong>Airplane Mode</strong>. Navigate the map, view county details, and
            generate printable briefs without an internet connection.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">Marketplace Case Studies</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold">Turkana County</h3>
              <span className="rounded-full bg-[#78350F] px-3 py-1 font-bold text-white">PGS: 92</span>
            </div>
            <p className="mb-4 text-stone-600">
              Critical disparities. Home births account for 47% of deliveries. Significant travel times to health facilities.
            </p>
            <Link href="/brief?county=10" className="flex items-center gap-1 font-medium text-blue-600 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              View Brief
            </Link>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold">Mandera County</h3>
              <span className="rounded-full bg-[#78350F] px-3 py-1 font-bold text-white">PGS: 91</span>
            </div>
            <p className="mb-4 text-stone-600">
              Critical vulnerabilities. Home births account for 50% of deliveries alongside intense population pressures.
            </p>
            <Link href="/brief?county=36" className="flex items-center gap-1 font-medium text-blue-600 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              View Brief
            </Link>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold">Tana River County</h3>
              <span className="rounded-full bg-[#78350F] px-3 py-1 font-bold text-white">PGS: 89</span>
            </div>
            <p className="mb-4 text-stone-600">
              Severe intersection of poverty (72.5%) and limited facility access across the road network.
            </p>
            <Link href="/brief?county=41" className="flex items-center gap-1 font-medium text-blue-600 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              View Brief
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-stone-50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Marketplace Exhibition Flow
        </h2>
        <ul className="space-y-3 text-lg">
          <li><strong>1. Find your county:</strong> Tap your home county on the map.</li>
          <li><strong>2. Review the score:</strong> See your verifiable Priority Gap Score (PGS) and key advocacy indicators.</li>
          <li><strong>3. Compare:</strong> Select a neighboring county to see the resource gap.</li>
          <li><strong>4. Generate evidence:</strong> Print the one-page brief to take into your next CHMT meeting.</li>
        </ul>
      </section>
    </main>
  );
}
