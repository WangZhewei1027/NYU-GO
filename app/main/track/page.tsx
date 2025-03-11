"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card/Card";
import Add from "@/components/Add";
import Location from "@/components/Location";
import { useStore, StoreState } from "@/app/store";
import useShuttleData from "@/app/utils/useShuttleData";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "C", time: "8", color: "yellow" },
  { name: "E", time: "8", color: "yellow" },
  { name: "F", time: "3", color: "green" },
  { name: "G", time: "6", color: "cyan" },
  { name: "W", time: "7", color: "amber" },
];

export default function TrackPage() {
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>([]);

  const store: StoreState = useStore() as StoreState;

  //const shuttleData = useShuttleData();

  // 更新可见的路线
  const updateVisibleRoutes = () => {
    const visible = routes
      .map((route) => route.name)
      .filter((name) => localStorage.getItem(name) === "true");

    //仅当状态发生变化时更新
    if (visible !== visibleRoutes) {
      setVisibleRoutes(visible);
    }
  };

  useEffect(() => {
    // 初始化可见路线
    updateVisibleRoutes();

    // 设置轮询定时器
    const intervalId = setInterval(() => {
      updateVisibleRoutes();
    }, 500); // 每秒检查一次

    store.currentLocation =
      localStorage.getItem("currentLocation") || "715 Broadway";

    // 清理定时器
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex mb-6">
        <h1 className="text-3xl font-bold">Track</h1>
      </div>

      {/* Location */}
      <div className="mb-8 text-base">
        Departing from &nbsp;
        <div className="max-w-48 inline-block">
          <Location />
        </div>
        &nbsp; in
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map(
          (route, index) =>
            visibleRoutes.includes(route.name) && (
              <Card name={route.name} key={index} />
            )
        )}
        <div className="flex justify-center items-center">
          <div className="w-32">
            <Add />
          </div>
        </div>
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
}
