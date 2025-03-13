"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Card from "@/components/Card/Card";
import Add from "@/components/Add";
import Location from "@/components/Location";
import { useStore, StoreState } from "@/app/store";
import useShuttleData from "@/app/utils/useShuttleData";
import { memo } from "react";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "C", time: "8", color: "yellow" },
  { name: "E", time: "8", color: "yellow" },
  { name: "F", time: "3", color: "green" },
  { name: "G", time: "6", color: "cyan" },
  { name: "W", time: "7", color: "amber" },
];

// ✅ 使用 memo 避免不必要的渲染
const MemoizedCard = memo(Card);

export default function TrackPage() {
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>([]);
  const store: StoreState = useStore() as StoreState;

  // ✅ 只在 `localStorage` 变化时更新 `visibleRoutes`
  const visibleRoutesMemo = useMemo(() => {
    return routes
      .map((route) => route.name)
      .filter((name) => localStorage.getItem(name) === "true");
  }, [visibleRoutes]);

  // ✅ 用 `useCallback` 避免 `setState` 触发多次渲染
  const updateVisibleRoutes = useCallback(() => {
    const visible = routes
      .map((route) => route.name)
      .filter((name) => localStorage.getItem(name) === "true");

    setVisibleRoutes((prev) =>
      JSON.stringify(prev) === JSON.stringify(visible) ? prev : visible
    ); // ✅ 只有变化时才更新
  }, []);

  useEffect(() => {
    // 初始化可见路线
    updateVisibleRoutes();

    // 设置轮询定时器
    const intervalId = setInterval(updateVisibleRoutes, 500); // ✅ 每 500ms 轮询

    store.currentLocation =
      localStorage.getItem("currentLocation") || "715 Broadway";

    return () => clearInterval(intervalId);
  }, [updateVisibleRoutes]);

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
            visibleRoutesMemo.includes(route.name) && (
              <MemoizedCard name={route.name} key={index} />
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
