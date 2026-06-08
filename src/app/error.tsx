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
      <div className="text-6xl font-bold text-neutral-200">Error</div>
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">An unexpected error occurred</h1>
      <p className="mt-2 text-sm text-neutral-500">
        {error?.message ?? "An unexpected error occurred while loading the page."}
      </p>
      {error?.stack && (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-neutral-100 p-4 text-left text-xs text-neutral-600">
          {error.stack}
        </pre>
      )}
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
      >
        Attempt reconnection
      </button>
    </div>
  );
}
