"use client";

import { Button } from "@/components/ui/button";
import { MdArrowDropDown } from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useStore, StoreState } from "@/app/store";
import { getThisRouteStops, routes } from "@/app/utils/utils";

export default function Stops({
  route,
  isFrom,
  callback,
}: {
  route: string;
  isFrom: boolean;
  callback: (stop: string) => void;
}) {
  const [selectedStop, setSelectedStop] = useState("Select Stop"); // 默认选中的站点
  const [stops, setStops] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Dialog 是否打开

  const lineRef = useRef<HTMLDivElement>(null); // 时间轴竖线的引用
  const containerRef = useRef<HTMLDivElement>(null); // 容器的引用

  const currentLocation = useStore(
    (state) => (state as StoreState).currentLocation
  );

  // 加载站点数据
  useEffect(() => {
    async function fetchStops() {
      try {
        const stopsData = await getThisRouteStops(route);
        setStops(stopsData);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    }
    fetchStops();
  }, [route]);

  useEffect(() => {
    const storedStop = localStorage.getItem(`route_${route}_${isFrom}`);

    if (storedStop) {
      setSelectedStop(storedStop);
      callback(storedStop);
    }
  }, []);

  useEffect(() => {
    if (isFrom && currentLocation) {
      setSelectedStop(currentLocation);
      callback(currentLocation);
    }
  }, [currentLocation]);

  // 计算时间轴竖线的高度
  function setLineHeight() {
    if (containerRef.current && lineRef.current) {
      console.log("📏 计算竖线高度:", containerRef.current.scrollHeight);
      lineRef.current.style.height = `${containerRef.current.scrollHeight}px`;
    }
  }

  // 在 Dialog 打开后，等待渲染完成再计算竖线高度
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(setLineHeight);
    }
  }, [isOpen, stops]); // stops 变化后也重新计算高度

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* 按钮触发器 */}
          <Button
            variant={"outline"}
            className="p-2 text-base w-full max-w-full flex items-center justify-between"
          >
            <span className="truncate">{selectedStop}</span>
            <MdArrowDropDown className="shrink-0 text-gray-500" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[85vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>
              Select {isFrom ? "Departure" : "Arrival"} Stop
            </DialogTitle>
            <DialogDescription asChild>
              <div className="hidden">
                Anyone who has this link will be able to view this.
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* 时间轴 + 站点列表 */}
          <div
            className="relative w-full max-h-[50vh] overflow-y-auto"
            ref={containerRef} // 容器引用
          >
            {/* 时间轴竖线 */}
            <div
              ref={lineRef} // 竖线引用
              className={`absolute top-0 left-[23.5px] w-0.5 ${routes[route].bgColor} min-h-full`}
            ></div>

            {stops.map((stop, index) => (
              <div
                key={index}
                className={`relative flex items-center pl-12 pr-4 py-4 transition transform`}
                onClick={() => {
                  setSelectedStop(stop); // 更新选中的站点
                  callback(stop); // 回调函数
                  localStorage.setItem(`route_${route}_${isFrom}`, stop); // 保存到本地存储
                  (
                    document.querySelector('[data-state="open"]') as HTMLElement
                  )?.click(); // 关闭对话框
                }}
              >
                {/* 圆点 */}
                <div
                  className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                    selectedStop === stop
                      ? `${routes[route].bgColor} border-white shadow`
                      : `bg-white ${routes[route].borderColor}`
                  }`}
                ></div>

                {/* 站点名称 */}
                <div className="text-base">{stop}</div>
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
