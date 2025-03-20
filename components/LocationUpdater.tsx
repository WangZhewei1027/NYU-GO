"use client";

import { useEffect } from "react";
import { useStore } from "@/app/store";

const LocationUpdater = () => {
  const setLocation = useStore((state) => state.setLocation);

  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
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
          console.error("获取位置失败:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    updateLocation(); // 组件加载时获取一次位置
    const intervalId = setInterval(updateLocation, 30000); // 每 30 秒更新一次

    return () => clearInterval(intervalId); // 组件卸载时清除定时器
  }, [setLocation]);

  return null; // 不需要渲染 UI
};

export default LocationUpdater;
