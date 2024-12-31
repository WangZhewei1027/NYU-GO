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
import React from "react";
import { Input } from "@/components/ui/input";
import { MdOutlineSearch } from "react-icons/md";

export default function Location() {
  const [StopRoutes, setStopRoutes] = React.useState<StopRoute | null>(null);

  React.useEffect(() => {
    async function fetchStops() {
      const stops = await getAllStops();
      setStopRoutes(stops);
    }
    fetchStops();
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open</Button>
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
          />
          <MdOutlineSearch className="w-8 h-8 text-gray-400 ml-2" />
        </div>
        <div className="flex flex-col h-full overflow-y-auto px-8">
          {StopRoutes &&
            Object.entries(StopRoutes).map(([key, value], index) => (
              <div key={index} className="py-4 border-b">
                <div className="text-lg mb-1">{key}</div>
                {value.map((stop, index) => (
                  <div
                    className={`inline mr-2 p-3 py-1 text-xs rounded-md ${routes[stop]?.bgColor} text-gray-900 font-bold`}
                    key={index}
                  >
                    {stop}
                  </div>
                ))}
              </div>
            ))}
        </div>
        <DrawerFooter>
          {/* <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
