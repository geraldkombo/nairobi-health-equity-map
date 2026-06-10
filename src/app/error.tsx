"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Error caught by boundary:", error);
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="text-6xl font-bold text-stone-200">Error</div>
      <h1 className="mt-4 text-xl font-semibold text-stone-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-stone-500">
        An unexpected error occurred. Please try reloading the page.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-accent-600 focus-visible:outline-offset-2"
      >
        Reload page
      </button>
    </div>
  );
}
