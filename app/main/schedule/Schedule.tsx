"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import ProgressBar from "@/components/Card/ProgressBar";
import { useStore, StoreState } from "@/app/store";
import { MdArrowForwardIos } from "react-icons/md";
import UpdateLogSidebar from "./UpdateLogSidebar";

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

  const insets = useStore((state) => state.insets);
  const [isLogOpen, setIsLogOpen] = useState(false);

  return (
    <>
      <div
        className="bg-gray-50 p-4 h-screen overflow-y-auto"
        style={{ marginTop: insets?.top ?? 0 }}
      >
        {/* 个人信息卡片 */}
        <div className="flex mb-6 items-center">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* 单位切换组件 */}
        <UnitToggle />

        {/* 版本信息 */}
        <div className="mt-6">
          <div className="text-base text-gray-500 ml-4 mb-1">Version</div>
          <button
            type="button"
            onClick={() => setIsLogOpen(true)}
            className="bg-white rounded-lg p-4 mb-4 text-lg w-full text-left font-semibold flex justify-between items-center focus:outline-none"
          >
            <span>Update Log</span>
            <MdArrowForwardIos className="align-middle text-gray-500" />
          </button>
        </div>

        {/* 清除 Local Storage 和 Cache 的按钮 */}
        <div className="mt-6">
          <div className="text-base text-gray-500 ml-4 mb-1">Developer</div>
          <AlertDialog>
            <AlertDialogTrigger className="bg-white rounded-lg  p-4 mb-4 text-lg w-full text-[#1DADAF] text-left font-semibold">
              Clear Local Data
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[70vw] rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Clear Local Storage and Cache
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  Are you sure you want to clear your local storage and cache?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClear}
                  className="bg-red-600 font-bold"
                >
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <UpdateLogSidebar open={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </>
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
      <div className="text-base text-gray-500 ml-4 mb-1">Unit</div>
      <div className="flex w-full px-6 py-11 bg-white rounded-t-lg items-center">
        <ProgressBar routeName="S" progress={1.1} />
      </div>
      <div
        className="w-full h-12 relative cursor-pointer select-none"
        onClick={toggle}
      >
        <div className="absolute inset-0 bg-white rounded-b-lg shadow-sm" />
        <div
          className="absolute top-0 left-0 h-full w-1/2 bg-[#1DADAF] rounded-lg transition-transform duration-300"
          style={{
            transform: isMetric ? "translateX(0%)" : "translateX(100%)",
          }}
        />
        <div className="relative flex justify-around items-center h-full">
          <span
            className={`z-10 text-lg font-bold ${
              isMetric ? "text-white" : "text-[#1DADAF]"
            }`}
          >
            Metric
          </span>
          <span
            className={`z-10 text-lg font-semibold ${
              !isMetric ? "text-white" : "text-[#1DADAF]"
            }`}
          >
            Imperial
          </span>
        </div>
      </div>
    </>
  );
}
