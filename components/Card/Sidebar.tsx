"use client";

import { motion } from "framer-motion";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useState, useEffect, useRef, use } from "react";
import { getSchedule } from "@/app/utils/utils";
import { MdOutlineArrowForward } from "react-icons/md";
import FullStops from "./FullStops";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  from: string;
  to: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  name,
  from,
  to,
}: SidebarProps) {
  const [currentStopFrom, setCurrentStopFrom] = useState<string>(from);
  const [currentStopTo, setCurrentStopTo] = useState<string>(to);

  const [fromSchedule, setFromSchedule] = useState<string[]>([]);
  const [toSchedule, setToSchedule] = useState<string[]>([]);

  const [mostRecenIndex, setMostRecentIndex] = useState<number | null>(null);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // **让 Sidebar 打开时自动获取焦点**
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  // **获取时刻表**
  useEffect(() => {
    const fetchSchedule = async () => {
      const { fromSchedule, toSchedule } = await getSchedule(
        name,
        currentStopFrom,
        currentStopTo
      );
      setFromSchedule(fromSchedule);
      setToSchedule(toSchedule);
    };

    fetchSchedule();
  }, [name, currentStopFrom, currentStopTo]);

  useEffect(() => {
    setCurrentStopFrom(from);
    setCurrentStopTo(to);
  }, [from, to]);

  useEffect(() => {
    for (let i = 0; i < fromSchedule.length; i++) {
      const item = fromSchedule[i];
      const [time, period] = item.split(" ");
      // eslint-disable-next-line prefer-const
      let [hour, minute] = time.split(":").map(Number);
      if (period === "PM" && hour !== 12) {
        hour += 12; // 转换为24小时制
      }

      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const itemTotalMinutes = hour * 60 + minute;
      if (itemTotalMinutes >= currentTotalMinutes) {
        setMostRecentIndex(i);
        break;
      }
    }
  }, [fromSchedule, toSchedule]);

  return (
    <>
      {/* 背景遮罩层 - 不能点击关闭 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 !mt-0" />}

      {/* 侧边栏 - 可手势拖动关闭 */}
      <motion.div
        ref={sidebarRef}
        tabIndex={-1} // 让 Sidebar 可聚焦
        className="fixed !top-0 !mt-0 right-0 h-full w-full bg-white z-50 outline-none flex flex-col safe-area"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x" // 允许横向滑动
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          if (info.offset.x > 100) {
            onClose(); // 右滑关闭 Sidebar
          }
        }}
      >
        {/* 顶部返回按钮 */}
        <div className="p-4 flex items-center">
          <MdOutlineArrowBackIos
            className="cursor-pointer text-2xl"
            onClick={onClose}
          />
          <span className="text-lg ml-2 font-bold" onClick={onClose}>
            Back
          </span>
        </div>

        {/* 标题 */}
        <div className="text-2xl font-bold px-4">Route {name}</div>

        {/* 选择出发站和到达站 */}
        <div className="flex p-4 border-b items-center">
          <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
            <FullStops
              route={name}
              isFrom={true}
              callback={setCurrentStopFrom}
              defaultStop={from}
            />
          </div>
          <MdOutlineArrowForward className="mx-1 flex-shrink-0" />
          <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
            <FullStops
              route={name}
              isFrom={false}
              callback={setCurrentStopTo}
              defaultStop={to}
            />
          </div>
        </div>

        {/* 可滚动的时间表 */}
        <div className="flex px-4 overflow-y-auto">
          <div className="w-1/2">
            {fromSchedule.map((stop, index) => (
              <div
                key={index}
                className={`text-center mt-2 h-6 ${
                  index === mostRecenIndex
                    ? "bg-slate-300 animate-pulse font-bold rounded-l-lg"
                    : ""
                }`}
              >
                {stop}
              </div>
            ))}
          </div>
          <div className="w-1/2">
            {toSchedule.map((stop, index) => (
              <div
                key={index}
                className={`text-center mt-2 h-6 ${
                  index === mostRecenIndex
                    ? "bg-slate-300 animate-pulse font-bold rounded-r-lg"
                    : ""
                }`}
              >
                {stop}
              </div>
            ))}
            {/* 滚动占位块 */}
            <div className="w-full h-16"></div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
