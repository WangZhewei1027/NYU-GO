import Stops from "@/components/Card/Stops";

interface StopSelectorProps {
  route: string;
  isFrom: boolean;
  callback: (stop: string) => void;
  stops: string[];
}

export default function StopSelector({
  route,
  isFrom,
  callback,
  stops,
}: StopSelectorProps) {
  return (
    <div className="w-full mt-2 truncate">
      <Stops route={route} isFrom={isFrom} callback={callback} />
      {stops.map((stop, index) => (
        <div key={index} className="text-base text-center mt-2">
          {stop}
        </div>
      ))}
    </div>
  );
}
