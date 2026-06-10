"use client";

import { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
      setIsIOS(isIOSDevice);

      const handler = (e: Event) => {
        try {
          e.preventDefault();
          setDeferredPrompt(e);
        } catch {}
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const mq = window.matchMedia("(display-mode: standalone)");
      if (mq.matches) setDismissed(true);
    } catch {}
  }, []);

  const handleInstall = async () => {
    try {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") setDismissed(true);
    } catch {}
    setDeferredPrompt(null);
  };

  if (dismissed) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 bg-white border-t border-stone-200 shadow-lg p-3 print:hidden">
        <p className="flex-1 text-sm text-stone-700">
          Tap <strong>Share</strong> <span className="inline-block w-5 h-5 bg-stone-200 rounded text-center text-xs leading-5 align-middle">&uarr;</span> then <strong>Add to Home Screen</strong>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm text-stone-500 hover:text-stone-700"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 bg-white border-t border-stone-200 shadow-lg p-3 print:hidden">
      <p className="flex-1 text-sm font-bold text-stone-900">Install for offline use</p>
      <button
        onClick={handleInstall}
        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg bg-[#EA580C] px-4 py-2 text-sm font-bold text-white hover:bg-[#C2410C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] active:scale-[0.98]"
      >
        Install
      </button>
    </div>
  );
}
