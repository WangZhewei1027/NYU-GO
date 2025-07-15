import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { routesColor } from "@/app/utils/utils";
import Sidebar from "@/components/Card/Sidebar";
import { MdOutlineArrowForward } from "react-icons/md";
import { useShuttleData } from "./useShuttleData";
import TimeDisplay from "@/components/Card/TimeDisplay";
import StopSelector from "@/components/Card/StopSelector";
import ProgressBar from "./ProgressBar";
import { isRouteValidToday } from "@/app/utils/utils";

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
  const isValidRoute = isRouteValidToday(name);

  let msg = "";
  let processedFrom = stopFrom;
  let processedTo = stopTo;

  if (stopFrom.length <= 0) {
    msg = "Departure stop not available";
    processedFrom = [];
    processedTo = [];
  } else if (stopTo.length <= 0) {
    msg = "Arrival stop not available";
    processedFrom = [];
    processedTo = [];
  }

  return (
    <>
      {isValidRoute && (
        <div
          className="flex flex-col items-center rounded-lg shadow-sm mt-1 border-l-[8px] bg-white relative"
          style={{ borderLeftColor: routesColor[name]?.color }}
        >
          <div
            className="flex items-center w-full h-20"
            onClick={() => setIsClicked(!isClicked)}
          >
            <div className="ml-4 whitespace-nowrap">
              {/* <span className="inline ml-1 text-gray-500 mr-1">Route</span> */}
              <span className="inline text-4xl font-mono">{name}</span>
            </div>

            <ProgressBar routeName={name} className="mx-4" />

            <TimeDisplay time={time} route={name} />
          </div>

          {/* 卡片展开的动画，展示详细信息 */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isClicked ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            } items-center w-full`}
          >
            <div className="flex-col p-2">
              <div className="flex flex-grow-0">
                <StopSelector
                  route={name}
                  isFrom={true}
                  callback={setCurrentStopFrom}
                  stops={processedFrom}
                />
                <MdOutlineArrowForward className="mt-2 w-8 h-8 mx-1" />
                <StopSelector
                  route={name}
                  isFrom={false}
                  callback={setCurrentStopTo}
                  stops={processedTo}
                />
              </div>
              {msg && (
                <div className="text-gray-400 text-base text-center mt-4">
                  {msg}
                </div>
              )}
            </div>
            <div className="flex flex-row space-x-2 m-2 mt-6">
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant={"outline"}
                className={`h-12 rounded-full text-base ml-auto`}
                style={{ borderColor: routesColor[name].color }}
              >
                Full Schedule
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `/main/map`;
                }}
                variant={"secondary"}
                className={`h-12 rounded-full text-base text-gray-50`}
                style={{ backgroundColor: routesColor[name].color }}
              >
                Open Map
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isValidRoute && (
        <div className="flex flex-col items-center rounded-lg shadow-sm mt-1 border-l-[8px] border-gray-400 bg-gray-100 relative">
          <div className="flex items-center w-full h-20">
            <div className="ml-4 whitespace-nowrap">
              <span className="inline text-4xl font-mono text-gray-400">
                {name}
              </span>
            </div>
          </div>
        </div>
      )}

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
