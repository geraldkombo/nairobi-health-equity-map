import Link from "next/link";

export const metadata = {
  title: "Forum | Kenya Health Equity Map",
  description:
    "3rd CSS Knowledge Dissemination Forum - offline-first CLM evidence base.",
};

export default function ForumLanding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans text-stone-900">
      <div className="w-full max-w-md rounded-xl border border-orange-200 bg-orange-50 p-8 text-center shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-700">
          3rd CSS Knowledge Dissemination Forum
        </p>
        <h1 className="mb-2 font-serif text-3xl font-extrabold text-amber-900">
          Kenya Health Equity Map
        </h1>
        <p className="mb-6 text-sm text-stone-700">
          Community-led monitoring evidence base. 100% offline capable.
          Zero tracking.
        </p>

        <div className="mb-6 rounded-lg border border-orange-100 bg-white p-4 text-left">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-800">
            The Offline Test
          </p>
          <p className="text-sm text-stone-600">
            1. Wait for this page to fully load.<br />
            2. Turn on <strong>Airplane Mode</strong>.<br />
            3. Tap a county below to see the evidence.
          </p>
        </div>

        <h2 className="mb-3 text-left text-sm font-bold uppercase tracking-widest text-amber-900">
          Live CLM Case Studies
        </h2>

        <div className="space-y-3">
          <Link
            href="/brief?county=turkana"
            className="flex w-full flex-col gap-1 rounded-lg bg-amber-900 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-orange-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Turkana County</span>
              <span className="rounded border border-white/40 px-2 py-0.5 text-xs opacity-80">
                Score: 92
              </span>
            </div>
            <p className="text-xs leading-relaxed text-orange-200">
              Physical access barrier. 42.6% hardcore poverty, 47% home births to nearest clinic travel exceeds 90 minutes.
            </p>
          </Link>

          <Link
            href="/brief?county=mandera"
            className="flex w-full flex-col gap-1 rounded-lg bg-amber-900 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-orange-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Mandera County</span>
              <span className="rounded border border-white/40 px-2 py-0.5 text-xs opacity-80">
                Score: 91
              </span>
            </div>
            <p className="text-xs leading-relaxed text-orange-200">
              Geographic isolation. 50% home births, among the highest nationally. Border region with severe infrastructure deficits.
            </p>
          </Link>

          <Link
            href="/brief?county=tana-river"
            className="flex w-full flex-col gap-1 rounded-lg bg-amber-900 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-orange-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Tana River County</span>
              <span className="rounded border border-white/40 px-2 py-0.5 text-xs opacity-80">
                Score: 89
              </span>
            </div>
            <p className="text-xs leading-relaxed text-orange-200">
              Economic vulnerability driver. 72.5% poverty, 11.35% Rural Access Index, repeated climate shocks destroying crops and incomes.
            </p>
          </Link>

          <Link
            href="/brief?county=elgeyo-marakwet"
            className="flex w-full flex-col gap-1 rounded-lg bg-amber-900 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-orange-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Elgeyo-Marakwet County</span>
              <span className="rounded border border-white/40 px-2 py-0.5 text-xs opacity-80">
                129 facilities
              </span>
            </div>
            <p className="text-xs leading-relaxed text-orange-200">
              Mapping gap demonstration. 129 facilities in official records, fewer than 20 on OpenStreetMap. 30% stunting, 56% skilled birth attendance.
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-bold text-orange-700 underline underline-offset-4 hover:text-amber-900"
          >
            Open the full interactive map
          </Link>
        </div>
      </div>
    </div>
  );
}
