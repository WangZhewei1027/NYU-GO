"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getAllStops, routes } from "@/app/utils/utils";
import React, { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { MdBookmark, MdOutlineSearch } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { useStore, StoreState } from "@/app/store";
import { StopRoute, Position } from "@/types";
import stopNameIsSame from "@/app/utils/stopNameIsSame";

import { MdOutlineBookmarkBorder } from "react-icons/md";
import { MdOutlineBookmark } from "react-icons/md";

import { haversineDistance } from "../Card/haversineDistance";
import { MdAssistantNavigation } from "react-icons/md";

export default function Location() {
  const [stopRoutes, setStopRoutes] = React.useState<StopRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // 搜索框输入内容
  const [selectedStop, setSelectedStop] = useState("-");
  const [filteredStops, setFilteredStops] = useState<StopRoute>(
    useStore.getState().stopsData
  );
  const [bookmarkedStops, setBookmarkedStops] = useState<string[]>(
    localStorage.getItem("bookmarkedStops")
      ? JSON.parse(localStorage.getItem("bookmarkedStops")!)
      : []
  );
  const [nearestStop, setNearestStop] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStops() {
      const stops = useStore.getState().stopsData;
      console.log("🚍 Stops data:", stops);
      setStopRoutes(stops);
    }
    const currentLocation =
      localStorage.getItem("currentLocation") || "715 Broadway";
    setSelectedStop(currentLocation);
    useStore.getState().currentLocation = currentLocation;
    fetchStops();
  }, []);

  function handleSearch(searchTerm: string) {
    setSearchTerm(searchTerm); // 更新搜索输入值

    const allStops = useStore.getState().stopsData;

    if (searchTerm === "") {
      setFilteredStops(allStops); // 如果搜索框为空，则清空筛选结果
      return;
    }

    const filteredStops = allStops
      ? Object.keys(allStops).reduce((acc, key) => {
          if (stopNameIsSame(key, searchTerm)) {
            acc[key] = allStops[key]; // 保持数据结构
          }
          return acc;
        }, {} as StopRoute)
      : allStops;

    console.log("🚍 Filtered stops:", filteredStops);
    setFilteredStops(filteredStops);
  }

  function getNearestStop(position: Position | null): string | null {
    if (!position) return null;

    let nearestStop = null;
    let minDistance = Infinity;

    if (stopRoutes) {
      Object.entries(stopRoutes).forEach(([key, value]) => {
        const distance = haversineDistance(
          position.latitude,
          position.longitude,
          value.position.latitude,
          value.position.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestStop = key;
        }
      });
    }

    return nearestStop;
  }

  const location = useStore((state) => state.location);
  useEffect(() => {
    const nearestStop = getNearestStop(location);
    if (nearestStop) {
      setNearestStop(nearestStop);
    }
  }, [location, stopRoutes]);

  function NearestStop() {
    return (
      <div
        className="flex flex-row py-8 border-b transition transform active:scale-95 active:opacity-80"
        onClick={() => {
          setSelectedStop(nearestStop!);
          useStore.getState().currentLocation = nearestStop!;
          localStorage.setItem("currentLocation", nearestStop!);
          (
            document.querySelector('[data-state="open"]') as HTMLElement
          )?.click();
        }}
      >
        <div className="flex flex-col w-full justify-center">
          <div className="mb-1">
            <div className="text-sm text-gray-400 mb-1 inline animate-pulse">
              <MdAssistantNavigation className="inline mr-1" />
              <span className="align-text-top font-bold">Nearest Stop</span>
            </div>
          </div>
          <div className="block">
            {nearestStop && (
              <div className={`text-lg mb-1 inline`}>{nearestStop}</div>
            )}
            <div>
              {stopRoutes &&
                nearestStop &&
                stopRoutes[nearestStop]?.routes.map((stop, index) => (
                  <div
                    className={`inline mr-2 p-3 py-1 text-xs rounded-md ${routes[stop]?.bgColor} text-gray-900 font-bold`}
                    key={index}
                  >
                    {stop}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function CardList() {
    // 获取书签站点优先排序后的站点列表
    const sortedStops = filteredStops
      ? Object.entries(filteredStops).sort(([keyA], [keyB]) => {
          const isBookmarkedA = bookmarkedStops.includes(keyA) ? -1 : 1;
          const isBookmarkedB = bookmarkedStops.includes(keyB) ? -1 : 1;
          return isBookmarkedA - isBookmarkedB;
        })
      : [];

    return (
      <div className="flex flex-col h-full overflow-y-auto px-8">
        {nearestStop && <NearestStop />}
        {sortedStops &&
          sortedStops.map(([key, value], index) => (
            <div
              key={index}
              className="flex flex-row py-4 border-b transition transform active:scale-95 active:opacity-80"
              onClick={() => {
                setSelectedStop(key);
                useStore.getState().currentLocation = key;
                localStorage.setItem("currentLocation", key);
                (
                  document.querySelector('[data-state="open"]') as HTMLElement
                )?.click(); // 关闭对话框
              }}
            >
              <div className="flex flex-col w-full">
                <div>
                  <div className="text-lg mb-1 inline">{key}</div>
                </div>
                <div>
                  {value.routes.map((stop, index) => (
                    <div
                      className={`inline mr-2 p-3 py-1 text-xs rounded-md ${routes[stop]?.bgColor} text-gray-900 font-bold`}
                      key={index}
                    >
                      {stop}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {bookmarkedStops.includes(key) ? (
                  <MdOutlineBookmark
                    className={`ml-2 text-amber-400 w-7 h-7`}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      setBookmarkedStops((prev) =>
                        prev.filter((stop) => stop !== key)
                      );
                      localStorage.setItem(
                        "bookmarkedStops",
                        JSON.stringify(
                          bookmarkedStops.filter((stop) => stop !== key)
                        )
                      );
                    }}
                  />
                ) : (
                  <MdOutlineBookmarkBorder
                    className={`ml-2 text-gray-500 w-7 h-7`}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      setBookmarkedStops((prev) => [...prev, key]);
                      localStorage.setItem(
                        "bookmarkedStops",
                        JSON.stringify([...bookmarkedStops, key])
                      );
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        {Object.keys(filteredStops).length === 0 && (
          <div className="text-center text-gray-400 py-4 text-lg font-bold">
            No stop found
          </div>
        )}
      </div>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"outline"} className="p-1 text-base w-full max-w-full">
          <MdOutlineLocationOn className="shrink-0 text-gray-500" />
          <span className="truncate">{selectedStop}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle asChild>
            <div className="hidden p-0">Select Location</div>
          </DrawerTitle>
          <DrawerDescription asChild>
            <div className="hidden p-0">Select Location</div>
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="flex justify-center w-full py-4"
          style={{ boxShadow: "0 4px 4px -3px rgba(0, 0, 0, 0.1)" }}
        >
          <Input
            placeholder="Search a stop"
            className="w-[55%] shadow-none rounded-full text-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)} // 更新搜索输入值
          />
          <MdOutlineSearch className="w-8 h-8 text-gray-400 ml-2" />
        </div>
        <CardList />
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
