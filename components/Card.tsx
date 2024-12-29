"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRemainingTime, getFromTime, getToTime, routes } from "@/app/utils";
import Stops from "@/components/Stops";

interface CardProps {
  name: string;
  stop: string;
}

const Card: React.FC<CardProps> = ({ name, stop }) => {
  const [isClicked, setIsClicked] = useState(false);

  const [time, setTime] = useState("--");

  useEffect(() => {
    const fetchRemainingTime = async () => {
      const remainingTime = await getRemainingTime(name, stop);
      if (remainingTime === -1) {
        setTime("--");
        return;
      }
      setTime(remainingTime.toString());
    };

    fetchRemainingTime();
  }, [name, stop]);

  return (
    <div
      className={`flex flex-col items-center rounded-lg shadow-sm mt-1 border-l-[10px] ${routes[name]?.borderColor}`}
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className="flex items-center w-full h-20">
        <div className="ml-2 text-xl font-bold font-sans">Route {name}</div>
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
        <div className="flex flex-col p-2">
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
              className={`h-12 rounded-full text-base ${routes[name].borderColor}`}
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
  );
};

export default Card;
