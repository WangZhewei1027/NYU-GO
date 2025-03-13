import { useStore, StoreState } from "@/app/store";
import { getStopPosition } from "@/app/utils/calculateTime";
import { get } from "http";

interface TimeDisplayProps {
  time: string | null;
  route: string;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 🌎 地球半径 (单位: 公里)

  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 返回单位为 **公里** 的距离
}

export default function TimeDisplay({ time, route }: TimeDisplayProps) {
  const store: StoreState = useStore() as StoreState;

  const currentPosition = getStopPosition(store.currentLocation);

  function getNearestBusLocation(
    routeName: string,
    latitude: number,
    longitude: number
  ): { latitude: string; longitude: string } | null {
    const busData = store.shuttleData;

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

    if (nearestBusPosition) {
      const dist = haversineDistance(
        Number(nearestBusPosition.latitude),
        Number(nearestBusPosition.longitude),
        currentPosition.latitude,
        currentPosition.longitude
      );
    } else {
      console.log("Nearest bus position is not available.");
    }
  } else {
    console.log("Current position is not available.");
  }

  return (
    <div className="ml-auto pr-4">
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
      <div className="text-gray-500 text-sm ml-0">{`${3.8} km away`}</div>
    </div>
  );
}
