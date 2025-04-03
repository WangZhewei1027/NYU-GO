"use client";
import { use, useState, useEffect } from "react";
import React from "react";
import { Switch } from "@/components/ui/switch"; // 使用 ShadCN UI 的 Switch 组件
import { ChevronRight } from "lucide-react"; // 右箭头图标
import Image from "next/image";
import ProgressBar from "@/components/Card/ProgressBar";
import { useStore, StoreState } from "@/app/store";
import { shallow } from "zustand/shallow";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 个人信息卡片 */}
      <div className="flex mb-6 items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* 个人信息 */}
      <div className="bg-white rounded-lg  p-4 mb-4">
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

      {/* 其他设置 */}
      {/* <div className="bg-white rounded-lg  divide-y mt-4">
        <SettingItem title="Support & Feedback" />
        <SettingItem title="About" />
      </div>

      <div className="bg-white rounded-lg  divide-y">
        <SettingItem title="Km/Miles" rightElement={<Switch />} />
      </div> */}

      <div className="mt-4">
        {/* <span className="text-lg font-semibold text-gray-900">
          Measurement Units
        </span> */}
        <UnitToggle />
      </div>

      {/* 退出按钮 */}
      {/* <div className="mt-6 text-center">
        <button className="text-red-500 font-bold text-lg">Log Out</button>
      </div> */}
    </div>
  );
}

// 设置项组件
function UnitToggle() {
  const unit = useStore((state: StoreState) => state.unit);
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
    <div
      className="w-full h-12 relative cursor-pointer select-none"
      onClick={toggle}
    >
      <div className="absolute inset-0 bg-white rounded-lg" />
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-gray-900 rounded-lg transition-transform duration-300"
        style={{ transform: isMetric ? "translateX(0%)" : "translateX(100%)" }}
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
  );
}
