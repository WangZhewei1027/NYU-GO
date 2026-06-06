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
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page crashed unexpectedly. You can try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
