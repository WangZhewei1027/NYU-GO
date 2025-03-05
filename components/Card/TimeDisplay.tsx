interface TimeDisplayProps {
  time: string | null;
  actualTime: string | null;
}

export default function TimeDisplay({ time, actualTime }: TimeDisplayProps) {
  return (
    <div className="ml-auto pr-4">
      {time === null ? (
        <div className="text-gray-500 text-4xl font-mono">--</div>
      ) : (
        <>
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
          <span className="inline ml-1 text-gray-500 text-end">min</span>
        </>
      )}
      {/* <span className="inline text-4xl font-thin"> / </span> */}

      {/* {actualTime === null ? (
        <div className="text-gray-500 text-xl font-mono">--</div>
      ) : (
        <>
          {Number(actualTime) >= 60 && (
            <span className="inline">
              <span className="inline text-xl font-mono">
                {Math.floor(Number(actualTime) / 60)}
              </span>
              <span className="inline ml-1 mr-1 text-gray-500 text-end">h</span>
            </span>
          )}
          <span className="inline text-xl font-mono">
            {actualTime === "--" ? "--" : Number(actualTime) % 60}
          </span>
          <span className="inline ml-1 text-gray-500 text-end">min</span>
        </>
      )} */}
    </div>
  );
}
