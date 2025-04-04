"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/app/utils/utils";
import { useStore } from "@/app/store";
import { StopRoute, Position } from "@/types";
import stopNameIsSame from "@/app/utils/stopNameIsSame";
import { haversineDistance } from "../Card/haversineDistance";
import {
  MdOutlineLocationOn,
  MdOutlineSearch,
  MdOutlineBookmark,
  MdOutlineBookmarkBorder,
  MdAssistantNavigation,
} from "react-icons/md";
import { motion, LayoutGroup } from "framer-motion";

export default function Location() {
  const [stopRoutes, setStopRoutes] = useState<StopRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStop, setSelectedStop] = useState("-");
  const [filteredStops, setFilteredStops] = useState<StopRoute>(
    useStore.getState().stopsData
  );
  const [bookmarkedStops, setBookmarkedStops] = useState<string[]>(
    JSON.parse(localStorage.getItem("bookmarkedStops") || "[]")
  );
  const [nearestStop, setNearestStop] = useState<string | null>(null);
  const location = useStore((state) => state.location);

  const updateCurrentLocation = useStore(
    (state) => state.updateCurrentLocation
  );

  // 初始化 stops 及选中项
  useEffect(() => {
    const stops = useStore.getState().stopsData;
    setStopRoutes(stops);
    const currentLocation =
      localStorage.getItem("currentLocation") || "715 Broadway";
    setSelectedStop(currentLocation);
    updateCurrentLocation(currentLocation);
  }, []);

  // 根据当前位置计算最近站点
  useEffect(() => {
    if (location && stopRoutes) {
      let minDistance = Infinity;
      let nearest: string | null = null;
      Object.entries(stopRoutes).forEach(([key, value]) => {
        const distance = haversineDistance(
          location.latitude,
          location.longitude,
          value.position.latitude,
          value.position.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = key;
        }
      });
      if (nearest) {
        setNearestStop(nearest);
        setSelectedStop(nearest);
        return;
      }
    }
  }, [location, stopRoutes]);

  // 搜索过滤
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredStops(useStore.getState().stopsData);
      return;
    }
    const allStops = useStore.getState().stopsData;
    const filtered = Object.keys(allStops).reduce((acc, key) => {
      if (stopNameIsSame(key, term)) {
        acc[key] = allStops[key];
      }
      return acc;
    }, {} as StopRoute);
    setFilteredStops(filtered);
  };

  // 切换书签
  const toggleBookmark = (key: string) => {
    const updated = bookmarkedStops.includes(key)
      ? bookmarkedStops.filter((stop) => stop !== key)
      : [...bookmarkedStops, key];
    setBookmarkedStops(updated);
    localStorage.setItem("bookmarkedStops", JSON.stringify(updated));
  };

  // 排序：书签的站点置顶
  const sortedStops = useMemo(() => {
    return filteredStops
      ? Object.entries(filteredStops).sort(
          ([a], [b]) =>
            (bookmarkedStops.includes(a) ? -1 : 1) -
            (bookmarkedStops.includes(b) ? -1 : 1)
        )
      : [];
  }, [filteredStops, bookmarkedStops]);

  // 选择站点统一逻辑
  const handleSelectStop = (key: string) => {
    setSelectedStop(key);
    updateCurrentLocation(key);
    localStorage.setItem("currentLocation", key);
    const openElement = document.querySelector('[data-state="open"]');
    if (openElement instanceof HTMLElement) {
      openElement.click();
    }
  };

  // 通用的站点卡片组件
  const StopCard = ({
    stopKey,
    value,
    showBookmark = true,
  }: {
    stopKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    showBookmark?: boolean;
  }) => (
    <div
      className="flex flex-row py-4 border-b transition transform active:scale-95 active:opacity-80"
      onClick={() => handleSelectStop(stopKey)}
    >
      <div className="flex flex-col w-full">
        <div className="text-lg mb-1 inline">{stopKey}</div>
        <div>
          {value.routes.map((route: string, idx: number) => (
            <div
              key={idx}
              className={`inline mr-2 p-3 py-1 text-xs rounded-md ${routes[route]?.bgColor} text-gray-900 font-bold`}
            >
              {route}
            </div>
          ))}
        </div>
      </div>
      {showBookmark && (
        <div className="flex flex-col justify-center">
          {bookmarkedStops.includes(stopKey) ? (
            <MdOutlineBookmark
              className="ml-2 text-amber-400 w-7 h-7"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(stopKey);
              }}
            />
          ) : (
            <MdOutlineBookmarkBorder
              className="ml-2 text-gray-500 w-7 h-7"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(stopKey);
              }}
            />
          )}
        </div>
      )}
    </div>
  );

  // 最近站点组件（无需书签操作）
  const NearestStopCard = ({ stopKey }: { stopKey: string }) => (
    <div
      className="flex flex-row py-8 border-b transition transform active:scale-95 active:opacity-80"
      onClick={() => handleSelectStop(stopKey)}
    >
      <div className="flex flex-col w-full justify-center">
        <div className="mb-1">
          <div className="text-sm text-gray-400 mb-1 inline animate-pulse">
            <MdAssistantNavigation className="inline mr-1" />
            <span className="align-text-top font-bold">Nearest Stop</span>
          </div>
        </div>
        <div className="block">
          <div className="text-lg mb-1 inline">{stopKey}</div>
          <div>
            {stopRoutes &&
              stopRoutes[stopKey]?.routes.map((route: string, idx: number) => (
                <div
                  key={idx}
                  className={`inline mr-2 p-3 py-1 text-xs rounded-md ${routes[route]?.bgColor} text-gray-900 font-bold`}
                >
                  {route}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

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
            onChange={(e) => handleSearch(e.target.value)}
          />
          <MdOutlineSearch className="w-8 h-8 text-gray-400 ml-2" />
        </div>

        <div className="flex flex-col h-full overflow-y-auto px-8">
          <LayoutGroup>
            <motion.div key={"nearest-stop"} layoutId="nearest-stop">
              {nearestStop && <NearestStopCard stopKey={nearestStop} />}
            </motion.div>
            {sortedStops.map(([key, value]) => (
              <motion.div
                key={key}
                layout
                layoutId={key}
                transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
              >
                <StopCard stopKey={key} value={value} />
              </motion.div>
            ))}
          </LayoutGroup>
          {Object.keys(filteredStops).length === 0 && (
            <div className="text-center text-gray-400 py-4 text-lg font-bold">
              No stop found
            </div>
          )}
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
