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
  "ELGEYO-MARAKWET": ["BARINGO", "WEST POKOT", "TRANS NZOIA", "UASIN GISHU"],
  "TRANS NZOIA": ["WEST POKOT", "ELGEYO MARAKWET", "ELGEYO-MARAKWET", "UASIN GISHU", "BUNGOMA"],
  "UASIN GISHU": ["ELGEYO MARAKWET", "TRANS NZOIA", "NANDI"],
  NANDI: ["NAKURU", "KERICHO", "UASIN GISHU"],
  KERICHO: ["NAKURU", "NANDI", "BOMET", "NAROK"],
  BOMET: ["KERICHO", "NAROK"],
  NAROK: ["KAJIADO", "KERICHO", "BOMET", "MIGORI"],
  "HOMA BAY": ["MIGORI", "KISUMU", "SIAYA"],
  HOMABAY: ["MIGORI", "KISUMU", "SIAYA"],
  MIGORI: ["NAROK", "HOMA BAY", "HOMABAY", "KISII"],
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
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorOrg, setAuthorOrg] = useState("");
  const [notes, setNotes] = useState<string[]>(["", "", "", "", ""]);

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
      <div className="mb-8 pb-4 border-b border-[#E0DBD0] print:hidden flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-[24px] font-bold font-serif text-[#78350F] md:text-3xl">Compare Counties</h1>
          <p className="text-[#6B6355] mt-4 text-[14px] leading-7">
            Select two counties to evaluate their infrastructure disparities side-by-side.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {(countyA || countyB) && (
            <button
              onClick={() => { setCountyA(""); setCountyB(""); }}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 bg-[#F8F5F0] border border-[#E0DBD0] hover:bg-[#F0EDE6] text-[#292524] font-bold px-4 py-2 rounded-[6px] transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] active:scale-[0.98] text-[12px] uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset Selection
            </button>
          )}
          {selA && selB && (
            <button
              onClick={handlePrint}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[6px] bg-[#EA580C] px-4 py-2 text-[14px] font-bold text-[#FFFBEB] shadow-sm transition-colors hover:bg-[#C2410C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92400E] active:scale-[0.98]"
            >
              Print advocacy report
            </button>
          )}
        </div>
      </div>

      {/* Metadata Form */}
      <div className="rounded-[8px] border border-[#E0DBD0] bg-[#F8F5F0] p-6 shadow-sm print:hidden mb-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#524B3F] mb-6">
          Author Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="author-name" className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Your Name
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Dr. Jane Doe"
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            />
          </div>
          <div>
            <label htmlFor="author-title" className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Title / Role
            </label>
            <input
              id="author-title"
              type="text"
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
              placeholder="e.g. County Health Officer"
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            />
          </div>
          <div>
            <label htmlFor="author-org" className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Organization
            </label>
            <input
              id="author-org"
              type="text"
              value={authorOrg}
              onChange={(e) => setAuthorOrg(e.target.value)}
              placeholder="e.g. County Health Department"
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-[8px] border border-[#E0DBD0] bg-[#F8F5F0] p-8 shadow-sm print:hidden">
        <div className="mb-4 flex items-center justify-between border-b border-[#E0DBD0] pb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#524B3F]">
            Configure Comparison
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Select Primary County
            </label>
            <select
              value={countyA}
              onChange={(e) => { setCountyA(e.target.value); setCountyB(""); }}
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              <option value="">-- Choose a County --</option>
              {counties.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase text-[#292524]">
              Select Comparison County
            </label>
            <select
              value={countyB}
              onChange={(e) => setCountyB(e.target.value)}
              disabled={!countyA}
              className="w-full min-h-[44px] rounded-[4px] border border-[#E0DBD0] bg-white px-4 py-2 text-[14px] text-[#292524] shadow-sm hover:border-[#A8A08F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] disabled:opacity-50"
            >
              <option value="">-- Choose a County --</option>
              {counties.filter((c) => c.id !== countyA).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {selA && suggestedNeighbors.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-[#A8A08F]">
                  Suggested neighboring counties:
                </p>
                <div className="flex flex-wrap gap-4">
                  {suggestedNeighbors.map((n) => {
                    const isActive = selB?.id === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setCountyB(n.id)}
                        className={`min-h-[44px] inline-flex items-center justify-center rounded-[6px] px-4 py-2 text-[14px] font-medium shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] active:scale-[0.98] ${
                          isActive
                            ? "bg-[#78350F] font-bold text-[#FFFBEB]"
                            : "bg-[#FFFBEB] border border-[#E0DBD0] text-[#92400E] hover:bg-[#FDE68A] hover:border-[#FCD34D]"
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

      <div aria-live="polite" className="sr-only">
        {selA && selB ? `Now comparing ${selA.name} and ${selB.name}` : ""}
      </div>

      {selA && selB && selA.id !== selB.id ? (
        <div className="mt-8 print:m-0 print:p-0 print:space-y-4">
          <CompareView countyA={selA} countyB={selB} indicators={indicators} />

          {/* Action Notes */}
          {notes.some(n => n.trim()) && <div className="break-inside-avoid border border-stone-300 rounded-lg p-3 print:p-2 bg-white">
            <h3 className="text-[11px] print:text-[8pt] font-bold text-stone-900 uppercase tracking-wider">County Health Management Team Action Notes</h3>
            {/* Screen: always show all inputs for typing */}
            <div className="space-y-2 print:hidden mt-1.5">
              {notes.map((note, i) => (
                <input
                  key={i}
                  type="text"
                  value={note}
                  onChange={(e) => {
                    const next = [...notes];
                    next[i] = e.target.value;
                    setNotes(next);
                  }}
                  placeholder="Type an action item..."
                  className="w-full border-0 border-b border-stone-300 bg-transparent px-1 py-1.5 text-[13px] text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C]"
                />
              ))}
            </div>
            {/* Print: only show filled notes as text */}
            <div className="hidden print:block space-y-1">
              {notes.filter(n => n.trim()).map((note, i) => (
                <div key={i} className="px-1 py-0.5 text-[8pt] text-stone-800 border-b border-stone-400">
                  {note}
                </div>
              ))}
            </div>
          </div>}
        </div>
      ) : (
        <div className="mt-8 rounded-[8px] border border-[#E0DBD0] bg-white p-8 text-center text-[14px] leading-7 text-[#8A8170]">
          Choose a primary county from the dropdown, then select a neighboring county to compare their infrastructure gaps side by side.
        </div>
      )}

      <div className="hidden print:flex justify-between items-center text-xs text-stone-500 mt-12 pt-4 border-t border-stone-200">
        <div className="flex flex-col gap-0.5">
          <span>{selA?.name ? `${selA.name} County` : "Select primary county"}</span>
          {authorName && <span className="text-[8pt]">{authorName}{authorTitle ? `, ${authorTitle}` : ""}{authorOrg ? ` - ${authorOrg}` : ""}</span>}
        </div>
        <span className="font-bold">VS</span>
        <div className="flex flex-col gap-0.5 text-right">
          <span>{selB?.name ? `${selB.name} County` : "Select comparison county"}</span>
          <span className="text-[8pt]">Kenya Health Equity Map</span>
        </div>
      </div>

      <div className="mt-8 print:hidden">
        <SourcesPanel />
      </div>

      <div className="mt-8 text-center text-[12px] text-[#A8A08F] print:hidden flex justify-center">
        <Link
          href="/"
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-[14px] font-medium text-[#524B3F] underline underline-offset-2 transition-colors hover:text-[#292524] hover:bg-[#F8F5F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
        >
          &larr; Return to map
        </Link>
      </div>
    </>
  );
}
