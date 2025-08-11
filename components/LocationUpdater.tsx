"use client";

import { useEffect } from "react";
import { useStore } from "@/app/store";

function LocationUpdater() {
  const setLocation = useStore((state) => state.setLocation);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log(
          "位置更新:",
          position.coords.latitude,
          position.coords.longitude
        );
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("获取位置失败:", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // 组件卸载时取消监听
    return () => navigator.geolocation.clearWatch(watchId);
  }, [setLocation]);

  return null; // 不需要渲染 UI
}

export default LocationUpdater;
