"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import Stops from "@/components/Stops";
import Add from "@/components/Add";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "C", time: "8", color: "yellow" },
  { name: "E", time: "8", color: "yellow" },
  { name: "F", time: "3", color: "green" },
  { name: "G", time: "6", color: "cyan" },
  { name: "W", time: "7", color: "amber" },
];

const TrackPage = () => {
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>([]);

  // 更新可见的路线
  const updateVisibleRoutes = () => {
    const visible = routes
      .map((route) => route.name)
      .filter((name) => localStorage.getItem(name) === "true");

    // 仅当状态发生变化时更新
    if (JSON.stringify(visible) !== JSON.stringify(visibleRoutes)) {
      setVisibleRoutes(visible);
    }
  };

  useEffect(() => {
    // 初始化可见路线
    updateVisibleRoutes();

    // 设置轮询定时器
    const intervalId = setInterval(() => {
      updateVisibleRoutes();
    }, 1000); // 每秒检查一次

    // 清理定时器
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex mb-6">
        <h1 className="text-3xl font-bold">Track</h1>
        <div className="ml-auto">
          <Add />
        </div>
      </div>

      {/* Location */}
      <div className="mb-8 text-base">
        Arriving at &nbsp;
        <div className="max-w-48 inline-block">
          <Stops />
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
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
};

export default TrackPage;
