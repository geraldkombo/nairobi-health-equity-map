"use client";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-[100svh] bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="text-6xl font-bold text-neutral-200">Error</div>
          <h1 className="mt-4 text-xl font-semibold text-neutral-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
