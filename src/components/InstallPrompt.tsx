"use client";

import { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShow(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white border border-stone-200 rounded-xl shadow-lg p-4 print:hidden max-w-xs">
      <div className="w-10 h-10 rounded-lg bg-[#78350F] flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6" viewBox="0 0 512 512" fill="none">
          <circle cx="256" cy="240" r="130" fill="#FDFBF7"/>
          <rect x="228" y="202" width="56" height="16" rx="4" fill="#EA580C"/>
          <rect x="246" y="184" width="20" height="52" rx="4" fill="#EA580C"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-stone-900 leading-tight">Install App</p>
        <p className="text-xs text-stone-500 leading-tight mt-0.5">Works offline, no data needed</p>
      </div>
      <button
        onClick={handleInstall}
        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg bg-[#EA580C] px-3 py-2 text-sm font-bold text-white hover:bg-[#C2410C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] active:scale-[0.98]"
      >
        Install
      </button>
    </div>
  );
}
