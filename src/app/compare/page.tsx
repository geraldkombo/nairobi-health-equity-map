import countiesData from "@/../data/snapshots/counties.json";
import indicatorsData from "@/../data/snapshots/county_indicators.json";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Compare Counties | Kenya Health Equity Map",
  description: "Side-by-side comparison of health equity indicators across Kenyan counties.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-stone-800">Compare counties</h1>
      <p className="mt-1 text-sm text-stone-500">
        Select two counties to compare their equity indicators side by side.
      </p>
      <div className="mt-6">
        <CompareClient
          counties={countiesData as { id: string; name: string }[]}
          indicators={indicatorsData as any[]}
        />
      </div>
    </div>
  );
}
