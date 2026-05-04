"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-app px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
        Something went wrong
      </p>
      <h1 className="text-2xl font-semibold text-slate-900">
        An unexpected error occurred
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        Please try again. If the problem persists, contact support.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
