import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold text-neutral-200">404</div>
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">Page not found</h1>
      <p className="mt-2 text-sm text-neutral-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
      >
        Back to map
      </Link>
    </div>
  );
}
