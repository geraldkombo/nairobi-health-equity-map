"use client";

import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShow(false);
    });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-xl sm:left-auto sm:right-6 sm:bottom-6">
      <p className="text-sm font-semibold text-amber-900">Install the app</p>
      <p className="mt-1 text-xs text-amber-700">Add to your home screen for easy access.</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={install}
          className="flex-1 rounded-lg bg-amber-800 px-3 py-2 text-xs font-bold text-white hover:bg-amber-900 transition-colors"
        >
          Install
        </button>
        <button
          onClick={() => setShow(false)}
          className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
