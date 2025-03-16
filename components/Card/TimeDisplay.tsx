import { useNearestBus } from "./useNearestBus";

interface TimeDisplayProps {
  time: string | null;
  route: string;
}

export default function TimeDisplay({ time, route }: TimeDisplayProps) {
  //const dist = useNearestBus(route);

  return (
    <div className="ml-auto pr-4 whitespace-nowrap">
      <div className="ml-0">
        {Number(time) >= 60 && (
          <span className="inline">
            <span className="inline text-4xl font-mono">
              {Math.floor(Number(time) / 60)}
            </span>
            <span className="inline ml-1 mr-1 text-gray-500 text-end">h</span>
          </span>
        )}
        <span className="inline text-4xl font-mono">
          {time === "--" ? "--" : Number(time) % 60}
        </span>
        {time !== "--" && (
          <span className="inline ml-1 text-gray-500 text-end">min</span>
        )}
      </div>
      {/* <div className="text-gray-500 text-sm ml-0">{`${
        dist === null ? "--" : dist.toFixed(2)
      } km away`}</div> */}
    </div>
  );
}
