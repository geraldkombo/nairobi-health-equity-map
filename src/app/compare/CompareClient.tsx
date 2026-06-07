"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CompareView from "@/components/CompareView";
import SourcesPanel from "@/components/SourcesPanel";

interface CompareClientProps {
  counties: { id: string; name: string }[];
  indicators: any[];
}

const NEIGHBORS: Record<string, string[]> = {
  MOMBASA: ["KWALE", "KILIFI"],
  KWALE: ["MOMBASA", "KILIFI"],
  KILIFI: ["KWALE", "MOMBASA", "TANA RIVER"],
  "TANA RIVER": ["KILIFI", "LAMU", "GARISSA", "KITUI"],
  LAMU: ["TANA RIVER", "GARISSA"],
  "TAITA TAVETA": ["KWALE", "KILIFI", "MAKUENI"],
  GARISSA: ["TANA RIVER", "LAMU", "WAJIR", "ISIOLO"],
  WAJIR: ["GARISSA", "MANDERA", "MARSABIT", "ISIOLO"],
  MANDERA: ["WAJIR", "MARSABIT"],
  MARSABIT: ["WAJIR", "MANDERA", "ISIOLO", "SAMBURU"],
  ISIOLO: ["MARSABIT", "WAJIR", "GARISSA", "KITUI", "MERU", "SAMBURU"],
  MERU: ["ISIOLO", "THARAKA NITHI", "NYERI", "KIRINYAGA", "EMBU"],
  "THARAKA NITHI": ["MERU", "EMBU", "KITUI"],
  EMBU: ["THARAKA NITHI", "MERU", "KIRINYAGA", "MACHAKOS", "KITUI"],
  KITUI: ["TANA RIVER", "EMBU", "MACHAKOS", "MAKUENI"],
  MACHAKOS: ["KITUI", "EMBU", "MAKUENI", "KAJIADO", "NAIROBI", "KIAMBU"],
  MAKUENI: ["KITUI", "MACHAKOS", "KAJIADO", "TAITA TAVETA"],
  NYERI: ["MERU", "KIRINYAGA", "NYANDARUA", "NAKURU", "LAIKIPIA"],
  KIRINYAGA: ["MERU", "EMBU", "NYERI", "MURANGA"],
  MURANGA: ["KIRINYAGA", "KIAMBU", "NYANDARUA"],
  KIAMBU: ["NAIROBI", "MACHAKOS", "MURANGA", "NYANDARUA", "NAKURU"],
  NAIROBI: ["KIAMBU", "MACHAKOS", "KAJIADO"],
  KAJIADO: ["MACHAKOS", "MAKUENI", "TAITA TAVETA", "NAROK"],
  NYANDARUA: ["NYERI", "MURANGA", "KIAMBU", "NAKURU"],
  NAKURU: ["NYANDARUA", "KIAMBU", "LAIKIPIA", "BARINGO", "KERICHO", "NANDI"],
  LAIKIPIA: ["NYERI", "NAKURU", "SAMBURU", "ISIOLO"],
  SAMBURU: ["MARSABIT", "ISIOLO", "LAIKIPIA", "BARINGO", "WEST POKOT", "TURKANA"],
  BARINGO: ["NAKURU", "LAIKIPIA", "SAMBURU", "WEST POKOT"],
  "WEST POKOT": ["SAMBURU", "TURKANA", "TRANS NZOIA", "ELGEYO MARAKWET"],
  TURKANA: ["MARSABIT", "SAMBURU", "WEST POKOT"],
  "ELGEYO MARAKWET": ["BARINGO", "WEST POKOT", "TRANS NZOIA", "UASIN GISHU"],
  "TRANS NZOIA": ["WEST POKOT", "ELGEYO MARAKWET", "UASIN GISHU", "BUNGOMA"],
  "UASIN GISHU": ["ELGEYO MARAKWET", "TRANS NZOIA", "NANDI"],
  NANDI: ["NAKURU", "KERICHO", "UASIN GISHU"],
  KERICHO: ["NAKURU", "NANDI", "BOMET", "NAROK"],
  BOMET: ["KERICHO", "NAROK"],
  NAROK: ["KAJIADO", "KERICHO", "BOMET", "MIGORI"],
  "HOMA BAY": ["MIGORI", "KISUMU", "SIAYA"],
  MIGORI: ["NAROK", "HOMA BAY", "KISII"],
  KISUMU: ["HOMA BAY", "SIAYA", "VIHIGA"],
  SIAYA: ["HOMA BAY", "KISUMU", "VIHIGA"],
  VIHIGA: ["KISUMU", "SIAYA", "KAKAMEGA"],
  KAKAMEGA: ["VIHIGA", "BUSIA", "BUNGOMA"],
  BUSIA: ["KAKAMEGA", "BUNGOMA"],
  BUNGOMA: ["KAKAMEGA", "BUSIA", "TRANS NZOIA"],
  KISII: ["MIGORI", "NYAMIRA"],
  NYAMIRA: ["KISII"],
};

export default function CompareClient({ counties, indicators }: CompareClientProps) {
  const [countyA, setCountyA] = useState("");
  const [countyB, setCountyB] = useState("");

  const selA = useMemo(() => counties.find((c) => c.id === countyA) ?? null, [counties, countyA]);
  const selB = useMemo(() => counties.find((c) => c.id === countyB) ?? null, [counties, countyB]);

  const suggestedNeighbors = useMemo(() => {
    if (!selA) return [];
    const neighborNames = NEIGHBORS[selA.name.toUpperCase()] || [];
    return counties.filter((c) => neighborNames.includes(c.name.toUpperCase()));
  }, [selA, counties]);

  const handlePrint = () => window.print();

  return (
    <>
      <div className="mb-6 pb-4 border-b border-gray-200 print:hidden flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Compare Counties</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Select two counties to evaluate their infrastructure disparities side-by-side.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(countyA || countyB) && (
            <button
              onClick={() => { setCountyA(""); setCountyB(""); }}
              className="text-xs flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold px-3 py-1.5 rounded-md transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset Selection
            </button>
          )}
          {selA && selB && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-[#EA580C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C04A0A] print:hidden"
            >
              Print advocacy report
            </button>
          )}
        </div>
      </div>

      {/* Selectors */}
      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-5 shadow-sm print:hidden">
        <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-700">
            Configure Comparison
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Select Primary County
            </label>
            <select
              value={countyA}
              onChange={(e) => { setCountyA(e.target.value); setCountyB(""); }}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Choose a County --</option>
              {counties.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Select Comparison County
            </label>
            <select
              value={countyB}
              onChange={(e) => setCountyB(e.target.value)}
              disabled={!countyA}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            >
              <option value="">-- Choose a County --</option>
              {counties.filter((c) => c.id !== countyA).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {selA && suggestedNeighbors.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                  Suggested neighboring counties:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedNeighbors.map((n) => {
                    const isActive = selB?.id === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setCountyB(n.id)}
                        className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium shadow-sm transition-all ${
                          isActive
                            ? "bg-amber-900 font-bold text-white ring-2 ring-orange-500"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                        }`}
                      >
                        {isActive ? "Comparing " : "+ "}{n.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selA && selB && selA.id !== selB.id ? (
        <div className="mt-6">
          <CompareView countyA={selA} countyB={selB} indicators={indicators} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-400">
          Select two counties to see a comparison.
        </div>
      )}

      <div className="mt-8">
        <SourcesPanel />
      </div>

      <div className="mt-6 text-center text-xs text-stone-400">
        <Link href="/" className="text-[#EA580C] underline underline-offset-2">&larr; Return to map</Link>
      </div>
    </>
  );
}
