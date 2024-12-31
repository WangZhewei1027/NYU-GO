import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getAllStops, StopRoute, routes } from "@/app/utils";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { MdOutlineSearch } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { useStore, StoreState } from "@/app/store";

export default function Location() {
  const [StopRoutes, setStopRoutes] = React.useState<StopRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // 搜索框输入内容
  const [selectedStop, setSelectedStop] = useState("-");

  const store: StoreState = useStore() as StoreState;

  React.useEffect(() => {
    async function fetchStops() {
      const stops = await getAllStops();
      setStopRoutes(stops);
    }
    setSelectedStop(localStorage.getItem("currentLocation") || "715 Broadway");
    fetchStops();
  }, []);

  // 根据搜索框内容过滤 StopRoutes
  const filteredStops = StopRoutes
    ? Object.entries(StopRoutes).filter(([key]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"outline"} className="p-1 text-base w-full max-w-full">
          <MdOutlineLocationOn className="shrink-0 text-gray-500" />
          <span className="truncate">{selectedStop}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle asChild>
            <div className="hidden p-0">Select Location</div>
          </DrawerTitle>
          <DrawerDescription asChild>
            <div className="hidden p-0">Select Location</div>
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="flex justify-center w-full py-4"
          style={{ boxShadow: "0 4px 4px -3px rgba(0, 0, 0, 0.1)" }}
        >
          <Input
            placeholder="Search a stop"
            className="w-[55%] shadow-none rounded-full text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 更新搜索输入值
          />
          <MdOutlineSearch className="w-8 h-8 text-gray-400 ml-2" />
        </div>
        <div className="flex flex-col h-full overflow-y-auto px-8">
          {filteredStops &&
            filteredStops.map(([key, value], index) => (
              <div
                key={index}
                className="py-4 border-b transition transform active:scale-95 active:opacity-80"
                onClick={() => {
                  setSelectedStop(key);
                  store.currentLocation = key;
                  localStorage.setItem("currentLocation", key);
                }}
              >
                <div>
                  <div className="text-lg mb-1 inline">{key}</div>
                </div>
                <div>
                  {value.map((stop, index) => (
                    <div
                      className={`inline mr-2 p-3 py-1 text-xs rounded-md ${routes[stop]?.bgColor} text-gray-900 font-bold`}
                      key={index}
                    >
                      {stop}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {filteredStops.length === 0 && (
            <div className="text-center text-gray-400 py-4 text-lg font-bold">
              No stops found
            </div>
          )}
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
