"use client";

import { motion } from "framer-motion";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Stops from "./Stops";
import { useState, useEffect, useRef } from "react";
import { getSchedule } from "@/app/utils/utils";
import { MdOutlineArrowForward } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

export default function Sidebar({ isOpen, onClose, name }: SidebarProps) {
  const [currentStopFrom, setCurrentStopFrom] = useState<string>("");
  const [currentStopTo, setCurrentStopTo] = useState<string>("");

  const [fromSchedule, setFromSchedule] = useState<string[]>([]);
  const [toSchedule, setToSchedule] = useState<string[]>([]);

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

  return (
    <>
      {/* 背景遮罩层 - 不能点击关闭 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 !mt-0" />}

      {/* 侧边栏 - 可手势拖动关闭 */}
      <motion.div
        ref={sidebarRef}
        tabIndex={-1} // 让 Sidebar 可聚焦
        className="fixed !top-0 !mt-0 right-0 h-full w-full bg-white z-50 outline-none flex flex-col"
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
          <div className="w-1/2">
            <Stops route={name} isFrom={true} callback={setCurrentStopFrom} />
          </div>
          <MdOutlineArrowForward className="mx-1" />
          <div className="w-1/2">
            <Stops route={name} isFrom={false} callback={setCurrentStopTo} />
          </div>
        </div>

        {/* 可滚动的时间表 */}
        <div className="flex px-4 space-x-4 overflow-y-auto">
          <div className="w-1/2">
            {fromSchedule.map((stop, index) => (
              <div key={index} className="text-sm text-center mt-2">
                {stop}
              </div>
            ))}
          </div>
          <div className="w-1/2">
            {toSchedule.map((stop, index) => (
              <div key={index} className="text-sm text-center mt-2">
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
