import { useEffect, useState } from "react";
import { getRemainingTime, getRecentSchedule } from "@/app/utils/utils";
import { getNearestBusLocation } from "@/app/main/map-temp/getBusInfo";
import { calculateTime, getStopPosition } from "@/app/utils/calculateTime";
import { useStore, StoreState } from "@/app/store";

export function useShuttleData(routeName: string) {
  const [time, setTime] = useState<string | null>(null);
  const [actualTime, setActualTime] = useState<string | null>(null);
  const [stopFrom, setStopFrom] = useState<string[]>(["-"]);
  const [stopTo, setStopTo] = useState<string[]>(["-"]);
  const [currentStopFrom, setCurrentStopFrom] = useState<string>("");
  const [currentStopTo, setCurrentStopTo] = useState<string>("");

  const store = useStore() as StoreState;

  // 获取 **剩余时间**
  useEffect(() => {
    const fetchRemainingTime = async () => {
      const remainingTime = await getRemainingTime(
        routeName,
        store.currentLocation
      );
      setTime(remainingTime === -1 ? "--" : remainingTime.toString());
    };

    const interval = setInterval(fetchRemainingTime, 5000);
    return () => clearInterval(interval);
  }, [routeName, store.currentLocation]);

  // 获取 **最近班车时间**
  useEffect(() => {
    const fetchSchedule = async () => {
      const { fromSchedule, toSchedule } = await getRecentSchedule(
        routeName,
        currentStopFrom,
        currentStopTo
      );
      setStopFrom(fromSchedule);
      setStopTo(toSchedule);
    };
    fetchSchedule();
  }, [routeName, currentStopFrom, currentStopTo]);

  // 计算 **实际时间**
  // useEffect(() => {
  //   const fetchActualTime = async () => {
  //     const position = getStopPosition(store.currentLocation);
  //     if (!position) return;
  //     const busLocation = await getNearestBusLocation(
  //       routeName,
  //       position.latitude,
  //       position.longitude
  //     );
  //     if (!busLocation) return;
  //     const estimatedTime = calculateTime(
  //       position.latitude,
  //       position.longitude,
  //       busLocation.latitude,
  //       busLocation.longitude
  //     );
  //     setActualTime(estimatedTime.toString());
  //   };

  //   const interval = setInterval(fetchActualTime, 10000);
  //   return () => clearInterval(interval);
  // }, [routeName, store.currentLocation]);

  return {
    time,
    actualTime,
    stopFrom,
    stopTo,
    currentStopFrom,
    currentStopTo,
    setCurrentStopFrom,
    setCurrentStopTo,
  };
}
