import stops from "@/app/utils/stops.json";
import { Position } from "@/types";
import stopNameIsSame from "./stopNameIsSame";

export default function getStopsPosition(stopName: string): Position | null {
  const foundStop = Object.values(stops.stops).find((value) =>
    stopNameIsSame(value.name, stopName)
  );

  return foundStop
    ? { latitude: foundStop.latitude, longitude: foundStop.longitude }
    : null;
}
