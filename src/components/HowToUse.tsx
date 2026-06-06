"use client";

import { useEffect, useState } from "react";

export default function HowToUse() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="rounded-xl border border-stone-200 bg-white transition-all duration-200 ease-in-out hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-stone-800"
        aria-expanded={open}
        aria-controls="how-to-use-content"
      >
        How to use this map
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div id="how-to-use-content" className="border-t border-stone-100 px-5 py-4 text-sm leading-6 text-stone-600">
          <ul className="list-disc space-y-2 pl-5">
            {isMobile ? (
              <>
                <li>
                  <strong>Tap</strong> a county to see its details and score.
                </li>
                <li>
                  <strong>Two fingers</strong> to pan and zoom the map.
                </li>
              </>
            ) : (
              <>
                <li>
                  <strong>Hover</strong> over a county to see its name and Priority Gap Score.
                </li>
                <li>
                  <strong>Click</strong> a county to open its details panel with key facts.
                </li>
              </>
            )}
            <li>
              Use the <strong>Compare</strong> page to place two counties side by side.
            </li>
            <li>
              Use the <strong>Brief</strong> button on a selected county to generate a printable county summary.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
