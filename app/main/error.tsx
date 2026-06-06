"use client";

import { useEffect } from "react";

export default function MainSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Main segment error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Unable to load this page
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          A runtime error occurred in this section. Try reloading the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Reload section
        </button>
      </div>
    </div>
  );
}
