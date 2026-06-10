"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";

interface SearchItem {
  id: string;
  name: string;
  code: string;
}

interface SearchBarProps {
  counties: { id: string; name: string; code: string }[];
  onSelect: (countyCode: string) => void;
}

export default function SearchBar({ counties, onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const resultsId = useRef(`search-results-${Math.random().toString(36).slice(2, 9)}`).current;

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
    setIsMac(navigator.platform?.includes("Mac") ?? false);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHighlightedIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSelect = useCallback(
    (code: string) => {
      onSelect(code);
      setOpen(false);
    },
    [onSelect],
  );

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0 && results[highlightedIndex]) {
      e.preventDefault();
      handleSelect(results[highlightedIndex].code);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-400 shadow-sm transition-colors hover:border-stone-300 hover:text-stone-500 min-h-[44px] focus-visible:outline-2 focus-visible:outline-accent-600 focus-visible:outline-offset-2"
        aria-label="Search for a county by name (Command + K)"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-left">Search all 47 counties...</span>
        <kbd className="hidden rounded border border-stone-200 px-1.5 py-0.5 text-[10px] font-medium text-stone-400 md:inline-block">
          {isMac ? "⌘" : "Ctrl"}+K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true" aria-label="Search counties">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-center border-b border-stone-100 px-4">
              <svg className="h-5 w-5 flex-shrink-0 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search all 47 counties..."
                className="w-full border-0 bg-transparent px-3 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none min-h-[44px]"
                role="combobox"
                aria-expanded="true"
                aria-controls={resultsId}
                aria-activedescendant={highlightedIndex >= 0 ? `${resultsId}-${highlightedIndex}` : undefined}
                aria-label="Search input"
              />
              <button
                onClick={() => setOpen(false)}
                className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-stone-400 hover:text-stone-600 min-h-[44px] min-w-[44px]"
                aria-label="Close search"
              >
                ESC
              </button>
            </div>
            {results.length > 0 && (
              <div ref={listRef} id={resultsId} className="max-h-64 overflow-y-auto p-2" role="listbox" aria-live="polite">
                {results.map((item, idx) => (
                  <button
                    key={item.id}
                    id={`${resultsId}-${idx}`}
                    onClick={() => handleSelect(item.code)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-accent-600 ${
                      highlightedIndex === idx ? "bg-stone-100" : ""
                    }`}
                    role="option"
                    aria-selected={highlightedIndex === idx}
                    tabIndex={-1}
                  >
                    <span className="font-medium text-stone-800">{item.name}</span>
                    <span className="text-xs text-stone-400">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
            {query.trim() && results.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-stone-400" role="status" aria-live="polite">No corresponding counties found.</div>
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
