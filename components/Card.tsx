"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRemainingTime, getFromTime, getToTime } from "@/app/utils";
import Stops from "@/components/Stops";

interface CardProps {
  name: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ name, color }) => {
  const [isClicked, setIsClicked] = useState(false);

  const [time, setTime] = useState("--");

  useEffect(() => {
    const remainingTime = getRemainingTime(name);
    setTime(remainingTime.toString());
  }, [name]);

  const borderColor = {
    pink: "border-pink-400",
    purple: "border-purple-400",
    yellow: "border-yellow-600",
  }[color];

  const bgColor = {
    pink: "bg-pink-200",
    purple: "bg-purple-200",
    yellow: "bg-yellow-200",
  }[color];

  return (
    <div
      className={`flex flex-col items-center rounded-lg shadow-sm mt-1 border-l-[10px] ${borderColor}`}
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className="flex items-center w-full h-20">
        <div className="ml-4 text-xl font-bold font-sans">Route {name}</div>
        <div className="ml-auto pr-4">
          <div className="inline text-4xl font-mono">{time}</div>
          <div className="inline ml-1 text-gray-500 text-end">min</div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isClicked ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        } items-center w-full`}
      >
        <div className="flex flex-col p-4 pt-2">
          <div className="flex flex-row">
            <div className="flex-1 overflow-hidden flex flex-col  pr-2">
              <div className="text-base font-bold">From</div>
              <div className="w-full mt-2">
                <Stops />
              </div>
              <div className="text-base text-center mt-2">9:55 am</div>
              <div className="text-base text-center mt-2">10:10 am</div>
              <div className="text-base text-center mt-2">10:30 am</div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col  border-l border-gray-300 border-dashed pl-2">
              <div className="text-base font-bold">To</div>
              <div className="w-full mt-2">
                <Stops />
              </div>
              <div className="text-base text-center mt-2">10:10 am</div>
              <div className="text-base text-center mt-2">10:15 am</div>
              <div className="text-base text-center mt-2">10:40 am</div>
            </div>
          </div>
          <div className="ml-auto space-x-2 mt-4">
            <Button
              variant={"outline"}
              className={`h-12 rounded-full text-base ${borderColor}`}
            >
              full schedule
            </Button>
            <Button
              variant={"secondary"}
              className={`h-12 rounded-full text-base ${bgColor}`}
            >
              open map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
