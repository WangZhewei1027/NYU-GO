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
    setVisibleRoutes(visible);
  };

  // 初始化和监听逻辑
  useEffect(() => {
    updateVisibleRoutes();

    // 手动触发更新逻辑的封装
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);
      const event = new Event("localStorageUpdate");
      window.dispatchEvent(event); // 手动触发事件
    };

    const handleUpdate = () => {
      updateVisibleRoutes();
    };

    // 监听自定义事件
    window.addEventListener("localStorageUpdate", handleUpdate);

    return () => {
      // 恢复原始 setItem 方法，避免意外影响其他逻辑
      localStorage.setItem = originalSetItem;
      window.removeEventListener("localStorageUpdate", handleUpdate);
    };
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
        {!visibleRoutes.length && (
          <div className="w-ful h-full text-center text-gray-400 font-bold text-xl mt-8">
            No Routes Added
          </div>
        )}
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
};

export default TrackPage;
