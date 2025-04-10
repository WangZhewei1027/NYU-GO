import { useNearestBus } from "./useNearestBus";

interface TimeDisplayProps {
  time: string | null;
  route: string;
}

export default function TimeDisplay({ time, route }: TimeDisplayProps) {
  //const dist = useNearestBus(route);

  return (
    <div className="pr-4 whitespace-nowrap">
      <div className="ml-0">
        {Number(time) >= 60 && (
          <span className="inline">
            <span className="inline text-4xl font-mono">
              {Math.floor(Number(time) / 60)}
            </span>
            <span className="inline ml-1 mr-1 text-gray-500 text-end">h</span>
          </span>
        )}
        <span className="inline-block text-4xl font-mono min-w-[2ch] text-center">
          {time === "--"
            ? "--"
            : (Number(time) % 60).toString().padStart(2, "0")}
        </span>

        <span
          className={`inline ml-1 ${
            time !== "--" ? "text-gray-500" : "text-white"
          } text-end`}
        >
          min
        </span>
      </div>
      {/* <div className="text-gray-500 text-sm ml-0">{`${
        dist === null ? "--" : dist.toFixed(2)
      } km away`}</div> */}
    </div>
  );
}
