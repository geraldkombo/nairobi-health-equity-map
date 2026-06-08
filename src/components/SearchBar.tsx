"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";

interface SearchItem {
  id: string;
  name: string;
  code: string;
  label: string;
}

interface SearchBarProps {
  counties: { id: string; name: string; code: string }[];
  onSelect: (countyCode: string) => void;
}

export default function SearchBar({ counties, onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(counties, {
        keys: ["name", "code"],
        threshold: 0.4,
        minMatchCharLength: 1,
      }),
    [counties],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query.trim()).slice(0, 10).map((r) => r.item);
  }, [query, fuse]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsMac(navigator.platform?.includes("Mac") ?? false);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleSelect = useCallback(
    (code: string) => {
      onSelect(code);
      setOpen(false);
      setQuery("");
    },
    [onSelect],
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-400 shadow-sm transition-colors hover:border-stone-300 hover:text-stone-500"
        aria-label="Search counties"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-left">Search administrative counties...</span>
        <kbd className="hidden rounded border border-stone-200 px-1.5 py-0.5 text-[10px] font-medium text-stone-400 md:inline-block">
          {isMac ? "⌘" : "Ctrl"}+K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-center border-b border-stone-100 px-4">
              <svg className="h-5 w-5 flex-shrink-0 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all 47 counties..."
                className="w-full border-0 bg-transparent px-3 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
                aria-label="Search input"
              />
              <button
                onClick={() => setOpen(false)}
                className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-stone-400 hover:text-stone-600"
              >
                ESC
              </button>
            </div>
            {results.length > 0 && (
              <div ref={listRef} className="max-h-64 overflow-y-auto p-2" role="listbox">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.code)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-stone-100 focus:bg-stone-100 focus:outline-none"
                    role="option"
                    aria-selected={false}
                  >
                    <span className="font-medium text-stone-800">{item.name}</span>
                    <span className="text-xs text-stone-400">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
            {query.trim() && results.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-stone-400">No corresponding counties found.</div>
            )}
            {!query.trim() && (
              <div className="px-4 py-6 text-center text-sm text-stone-400">Enter a county name to initiate search.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
