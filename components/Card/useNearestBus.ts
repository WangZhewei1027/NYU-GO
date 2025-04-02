import { useEffect, useState } from "react";
import { useStore, StoreState } from "@/app/store";
import { getStopPosition } from "@/app/utils/calculateTime";
import { haversineDistance } from "@/components/Card/haversineDistance";

export function useNearestBus(route: string) {
  const store: StoreState = useStore() as StoreState;
  const [dist, setDist] = useState<number | null>(null);

  useEffect(() => {
    console.log("🚍 Calculating nearest bus distance...");
    const currentPosition = getStopPosition(store.currentLocation);

    function getNearestBusLocation(
      routeName: string,
      latitude: number,
      longitude: number
    ): { latitude: string; longitude: string } | null {
      const busData = store.shuttleData;

      if (
        !busData ||
        Object.prototype.hasOwnProperty.call(busData, "undefined")
      ) {
        console.log("Bus data is { 'undefined': {} }, returning early.");
        return null;
      }

      let minDist = Infinity;
      let busLocation = null;
      Object.entries(busData).forEach(([busId, busInfo]) => {
        if (busInfo.route.toLowerCase() === routeName.toLowerCase()) {
          const dist = haversineDistance(
            latitude,
            longitude,
            Number(busInfo.latitude),
            Number(busInfo.longitude)
          );
          if (dist < minDist) {
            minDist = dist;
            busLocation = {
              latitude: busInfo.latitude,
              longitude: busInfo.longitude,
            };
          }
        }
      });
      return busLocation;
    }

    if (currentPosition) {
      const nearestBusPosition = getNearestBusLocation(
        "route " + route,
        currentPosition.latitude,
        currentPosition.longitude
      );
      console.log(nearestBusPosition);

      if (nearestBusPosition) {
        const dist = haversineDistance(
          Number(nearestBusPosition.latitude),
          Number(nearestBusPosition.longitude),
          currentPosition.latitude,
          currentPosition.longitude
        );
        console.log(`Distance to nearest bus: ${dist} km`);
        setDist(Number(dist));
      } else {
        console.log("Nearest bus position is not available.");
      }
    } else {
      console.log("Current position is not available.");
    }
  }, [store.shuttleData, store.currentLocation, route]);

  return dist;
}
