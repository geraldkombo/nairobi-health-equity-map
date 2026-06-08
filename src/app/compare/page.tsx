import countiesData from "@/../data/snapshots/counties.json";
import indicatorsData from "@/../data/snapshots/county_indicators.json";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Compare Counties | Kenya Health Equity Map",
  description: "Side-by-side comparison of health equity indicators across Kenyan counties.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <CompareClient
        counties={countiesData as { id: string; name: string }[]}
        indicators={indicatorsData as any[]}
      />
    </div>
  );
}
