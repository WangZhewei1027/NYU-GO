import { routes } from "@/app/utils/utils";
import { useNearestBus } from "./useNearestBus";

function convertDistToProgress(dist: number | null): number {
  if (dist === null) return 0; // Default to 0 if no data
  const maxDist = 3; // Beyond 3km, progress grows very slow
  const minDist = 0.1; // Below 100m, progress is nearly full
  const scale = 100; // Convert to percentage

  const normalizedDist = Math.max(0, Math.min(dist, maxDist));
  const progress =
    scale * (1 - Math.log1p(normalizedDist) / Math.log1p(maxDist));

  return Math.min(100, Math.max(0, progress));
}

function convertDist(dist: number | null): string | null {
  if (dist === null) return null;
  if (dist > 1) {
    return `${dist.toFixed(1)} km`;
  } else {
    return `${(dist * 1000).toFixed(0)} m`;
  }
}

export default function ProgressBar({
  routeName,
  progress, // Original progress (if any)
  className,
}: {
  routeName: string;
  progress?: number;
  className?: string;
}) {
  const dist = useNearestBus(routeName);
  const computedProgress = convertDistToProgress(dist);
  const clampedProgress = Math.min(90, Math.max(15, computedProgress)); // Avoid text going out of bounds
  const convertedDist = convertDist(dist);

  return (
    <div
      className={`relative h-1 w-full rounded-full bg-gray-200 ${className}`}
    >
      <div
        className={`h-full rounded-full ${routes[routeName]?.bgColor} transition-all duration-1000`}
        style={{ width: `${computedProgress}%` }}
      ></div>
      <div
        className="absolute text-gray-500 text-sm whitespace-nowrap"
        style={{
          left: `${clampedProgress}%`,
          transform: "translateX(-50%)",
          bottom: "100%",
          marginBottom: "4px",
        }}
      >
        {convertedDist === null ? "" : `${convertedDist}`}
      </div>
    </div>
  );
}
