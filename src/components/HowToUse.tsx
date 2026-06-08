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
        Instructions for use
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
                  Select a county from the geographic interface to view specific health indicators.
                </li>
                <li>
                  Utilize the search function to locate administrative regions directly.
                </li>
              </>
            ) : (
              <>
                <li>
                  Hover over a county to view its Priority Gap Score.
                </li>
                <li>
                  Select a county to access its details panel with key indicators.
                </li>
              </>
            )}
            <li>
              Compare multiple regions to analyze structural disparities.
            </li>
            <li>
              Generate an analytical brief for formal documentation.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
