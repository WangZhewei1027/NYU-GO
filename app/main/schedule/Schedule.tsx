"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import ProgressBar from "@/components/Card/ProgressBar";
import { useStore, StoreState } from "@/app/store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  // 清除 localStorage 和 caches 的处理函数
  const handleClear = async () => {
    localStorage.clear();
    if (window.caches) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 个人信息卡片 */}
      <div className="flex mb-6 items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* 个人信息 */}
      <div className="bg-white rounded-lg  p-4 mb-4 shadow-sm">
        <div className="flex items-center">
          <Image
            src="https://picsum.photos/200" // 替换成你的头像路径
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold">David Wang</h2>
            <p className="text-gray-500 text-sm">zw3636@nyu.edu</p>
          </div>
        </div>
      </div>

      {/* 单位切换组件 */}
      <UnitToggle />

      {/* 清除 Local Storage 和 Cache 的按钮 */}
      <div className="mt-6">
        <AlertDialog>
          <AlertDialogTrigger className="bg-white rounded-lg  p-4 mb-4 shadow-sm text-xl w-full text-red-600 font-sans font-semibold text-center">
            Clear Local Data
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[80vw] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Local Storage and Cache</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to clear your local storage and cache?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClear}>Clear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// 单位切换组件示例
function UnitToggle() {
  const setUnit = useStore((state: StoreState) => state.setUnit);

  const [isMetric, setIsMetric] = useState(
    localStorage.getItem("unit") !== null
      ? localStorage.getItem("unit") === "metric"
      : true
  );

  const toggle = () => {
    const newUnit = isMetric ? "imperial" : "metric";
    setUnit(newUnit);
    setIsMetric(!isMetric);
    localStorage.setItem("unit", newUnit);
  };

  return (
    <>
      <div className="flex w-full px-6 py-11 bg-white rounded-t-lg items-center shadow-sm">
        <ProgressBar routeName="E" progress={1.1} />
      </div>
      <div
        className="w-full h-12 relative cursor-pointer select-none"
        onClick={toggle}
      >
        <div className="absolute inset-0 bg-white rounded-b-lg shadow-sm" />
        <div
          className="absolute top-0 left-0 h-full w-1/2 bg-gray-900 rounded-lg transition-transform duration-300"
          style={{
            transform: isMetric ? "translateX(0%)" : "translateX(100%)",
          }}
        />
        <div className="relative flex justify-around items-center h-full">
          <span
            className={`z-10 text-lg font-semibold ${
              isMetric ? "text-white" : "text-gray-900"
            }`}
          >
            Metric
          </span>
          <span
            className={`z-10 text-lg font-semibold ${
              !isMetric ? "text-white" : "text-gray-900"
            }`}
          >
            Imperial
          </span>
        </div>
      </div>
    </>
  );
}
