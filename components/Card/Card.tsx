import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/utils/utils";
import Sidebar from "@/components/Card/Sidebar";
import { MdOutlineArrowForward } from "react-icons/md";
import { useShuttleData } from "./useShuttleData";
import TimeDisplay from "@/components/Card/TimeDisplay";
import StopSelector from "@/components/Card/StopSelector";

interface CardProps {
  name: string;
}

export default function Card({ name }: CardProps) {
  const {
    time,
    actualTime,
    stopFrom,
    stopTo,
    currentStopFrom,
    currentStopTo,
    setCurrentStopFrom,
    setCurrentStopTo,
  } = useShuttleData(name);
  const [isClicked, setIsClicked] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div
        className={`flex flex-col items-center rounded-lg shadow-sm mt-1 border-l-[10px] ${routes[name]?.borderColor}`}
      >
        <div
          className="flex items-center w-full h-20"
          onClick={() => setIsClicked(!isClicked)}
        >
          <div className="ml-2 text-xl font-bold font-sans">Route {name}</div>
          <TimeDisplay time={time} />
        </div>

        {/* 卡片展开的动画，展示详细信息 */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isClicked ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          } items-center w-full`}
        >
          <div className="flex flex-row p-2">
            <StopSelector
              route={name}
              isFrom={true}
              callback={setCurrentStopFrom}
              stops={stopFrom}
            />
            <MdOutlineArrowForward className="mt-2 w-8 h-8 mx-1" />
            <StopSelector
              route={name}
              isFrom={false}
              callback={setCurrentStopTo}
              stops={stopTo}
            />
          </div>
          <div className="flex flex-row space-x-2 m-2 mt-6">
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant={"outline"}
              className={`h-12 rounded-full text-base ${routes[name].borderColor} ml-auto`}
            >
              Full Schedule
            </Button>
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant={"secondary"}
              className={`h-12 rounded-full text-base text-gray-50 ${routes[name].bgColor}`}
            >
              Open Map
            </Button>
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        name={name}
        from={currentStopFrom}
        to={currentStopTo}
      />
    </>
  );
}
