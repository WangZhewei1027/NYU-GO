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
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useStore, StoreState } from "@/app/store";
import { getThisRouteStops, routes } from "@/app/utils";

export default function Stops({
  route,
  isFrom,
}: {
  route: string;
  isFrom: boolean;
}) {
  const [selectedStop, setSelectedStop] = useState("Select Stop"); // 默认选中的站点
  const store: StoreState = useStore() as StoreState; // 全局状态管理
  const [stops, setStops] = useState<string[]>([]);

  const lineRef = useRef<HTMLDivElement>(null); // 时间轴竖线的引用
  const containerRef = useRef<HTMLDivElement>(null); // 容器的引用

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

  // 使用 useLayoutEffect 确保在渲染完成后计算竖线高度
  useLayoutEffect(() => {
    if (containerRef.current && lineRef.current) {
      const containerHeight = containerRef.current.scrollHeight; // 获取容器的实际内容高度
      lineRef.current.style.height = `${containerHeight}px`; // 动态设置竖线高度
    }
  }, [stops]); // stops 渲染完成后触发

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {/* 按钮触发器 */}
          <Button
            variant={"outline"}
            className="p-2 text-base w-full max-w-full flex items-center justify-between"
          >
            <span className="truncate">{selectedStop}</span>
            <MdArrowDropDown className="shrink-0 text-gray-500 ml-2" />
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
                className={`relative flex items-center pl-12 pr-4 py-4 cursor-pointer hover:bg-gray-100 transition `}
                onClick={() => {
                  setSelectedStop(stop); // 更新选中的站点
                  store.currentLocation = stop; // 更新全局状态
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
