import { getAllStops } from "./utils";
import { StopRoute } from "@/types";
import getStopsPosition from "./getStopsPosition";

export default async function initStopsData(): Promise<StopRoute> {
  const allStops = await getAllStops();
  const returnData: StopRoute = {};

  Object.entries(allStops).forEach(([key, value]) => {
    returnData[key] = {
      routes: value,
      position: getStopsPosition(key) || { latitude: 0, longitude: 0 },
    };
  });

  return returnData;
}
