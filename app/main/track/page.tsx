"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import Stops from "@/components/Stops";
import Add from "@/components/Add";
import Papa from "papaparse";

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

  function handleClick() {
    fetch("/route_a_mt.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse<string>(csvText, {
          header: true, // 如果 CSV 包含表头
          skipEmptyLines: true, // 跳过空行
          complete: (results) => {
            console.log("Parsed CSV Data:", results.data);
          },
          error: (error: Error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
      });
  }

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
        Arriving at &nbsp;
        <div className="max-w-48 inline-block">
          <Stops />
        </div>
        &nbsp; in
      </div>

      <Button className="w-16" onClick={() => handleClick()}>
        test
      </Button>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map(
          (route, index) =>
            visibleRoutes.includes(route.name) && (
              <Card name={route.name} key={index} />
            )
        )}
        {/* {!visibleRoutes.length && (
          <div className="w-ful h-full text-center text-gray-400 font-bold text-xl mt-8">
            No Routes Added
          </div>
        )} */}
        <div className="flex justify-center items-center">
          <div className="w-32">
            <Add />
          </div>
        </div>
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
};

export default TrackPage;
