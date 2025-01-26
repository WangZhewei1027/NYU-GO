"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getRemainingTime, routes, getRecentSchedule } from "@/app/utils/utils";
import Stops from "@/components/Stops";
import { useStore, StoreState } from "@/app/store";
import Sidebar from "@/components/Sidebar"; // 引入 Sidebar 组件
import { MdOutlineArrowForward } from "react-icons/md";

interface CardProps {
  name: string;
}

const Card: React.FC<CardProps> = ({ name }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [stopFrom, setStopFrom] = useState<string[]>(["-"]);
  const [stopTo, setStopTo] = useState<string[]>(["-"]);
  const [currentStopFrom, setCurrentStopFrom] = useState<string>("");
  const [currentStopTo, setCurrentStopTo] = useState<string>("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 控制 Sidebar 显示
  const [fullSchedule, setFullSchedule] = useState<string[]>([]); // 完整时刻表

  const store: StoreState = useStore() as StoreState;

  useEffect(() => {
    const fetchRemainingTime = async () => {
      const remainingTime = await getRemainingTime(name, store.currentLocation);
      setTime(remainingTime === -1 ? "--" : remainingTime.toString());
    };

    const interval = setInterval(() => {
      fetchRemainingTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [name, store.currentLocation]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const { fromSchedule, toSchedule } = await getRecentSchedule(
        name,
        currentStopFrom,
        currentStopTo
      );

      setStopFrom(fromSchedule);
      setStopTo(toSchedule);
    };

    fetchSchedule();
  }, [name, currentStopFrom, currentStopTo]);

  return (
    <>
      <div
        className={`flex flex-col items-center rounded-lg shadow-sm mt-1 border-l-[10px] ${routes[name]?.borderColor}`}
      >
        {/* 剩余时间 */}
        <div
          className="flex items-center w-full h-20"
          onClick={() => setIsClicked(!isClicked)}
        >
          <div className="ml-2 text-xl font-bold font-sans">Route {name}</div>
          <div className="ml-auto pr-4">
            {time === null ? (
              <div className="text-gray-500 text-4xl font-mono">--</div>
            ) : (
              <>
                {Number(time) >= 60 && (
                  <div className="inline">
                    <div className="inline text-4xl font-mono">
                      {Math.floor(Number(time) / 60)}
                    </div>
                    <div className="inline ml-1 mr-1 text-gray-500 text-end">
                      h
                    </div>
                  </div>
                )}
                <div className="inline text-4xl font-mono">
                  {time === "--" ? "--" : Number(time) % 60}
                </div>
                <div className="inline ml-1 text-gray-500 text-end">min</div>
              </>
            )}
          </div>
        </div>

        {/* 详细信息 */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isClicked ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          } items-center w-full`}
        >
          <div className="flex flex-col p-2">
            {/* 站点选择 */}
            <div className="flex flex-row">
              <div className="flex-1 overflow-hidden flex flex-col pr-2">
                <div className="w-full mt-2">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Stops
                      route={name}
                      isFrom={true}
                      callback={setCurrentStopFrom}
                    />
                  </Suspense>
                </div>
                {stopFrom.map((stop, index) => (
                  <div key={index} className="text-base text-center mt-2">
                    {stop}
                  </div>
                ))}
              </div>
              <MdOutlineArrowForward className="mt-4" />
              <div className="flex-1 overflow-hidden flex flex-col pl-2">
                <div className="w-full mt-2">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Stops
                      route={name}
                      isFrom={false}
                      callback={setCurrentStopTo}
                    />
                  </Suspense>
                </div>
                {stopTo.map((stop, index) => (
                  <div key={index} className="text-base text-center mt-2">
                    {stop}
                  </div>
                ))}
              </div>
            </div>

            {/* 按钮 */}
            <div className="ml-auto space-x-2 mt-6">
              <Button
                variant={"outline"}
                className={`h-12 rounded-full text-base ${routes[name].borderColor}`}
                onClick={async () => {
                  const { fromSchedule, toSchedule } = await getRecentSchedule(
                    name,
                    currentStopFrom,
                    currentStopTo
                  );
                  setFullSchedule([...fromSchedule, ...toSchedule]);
                  setIsSidebarOpen(true);
                }}
              >
                full schedule
              </Button>
              <Button
                variant={"secondary"}
                className={`h-12 rounded-full text-base ${routes[name].bgColor}`}
              >
                open map
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 侧边栏组件 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        name={name}
      />
    </>
  );
};

export default Card;
