import { getAllStops } from "./utils";
import { StopRoute } from "@/types";
import getStopsPosition from "./getStopsPosition";

export default function initStopsData() {
  const returnData: StopRoute = {};

  const allStops = getAllStops();
  allStops.then((data) => {
    Object.entries(data).forEach(([key, value]) => {
      returnData[key] = {
        routes: value,
        position: getStopsPosition(key) || { latitude: 0, longitude: 0 },
      };
    });
  });

  return returnData;
}
