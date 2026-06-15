"use client";

import { Button } from "@/components/ui/button";
import { MdOutlineAdd } from "react-icons/md";
import { routesColor } from "@/app/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdCheckBox } from "react-icons/md";
import { useStore } from "@/app/store";

function RouteItem({ route, promo }: { route: string; promo: string }) {
  const visibleRoutes = useStore((state) => state.visibleRoutes);
  const toggleRoute = useStore((state) => state.toggleRoute);
  const selected = visibleRoutes.includes(route);

  return (
    <div
      className={`w-full h-32 min-[375px]:h-36 sm:h-40 shadow rounded p-3 sm:p-4 flex flex-col transition-all ${
        selected ? "bg-brand-400 text-white" : "bg-white text-black"
      }`}
      onClick={() => toggleRoute(route)}
    >
      <div className="flex flex-row items-center">
        <span className="text-lg font-bold">Route {route}</span>
        <MdCheckBox className="ml-auto w-6 h-6 shadow-none text-white" />
      </div>
      <p className="text-sm mt-6">{promo}</p>
    </div>
  );
}

export default function Add() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center justify-cente w-full border px-2 rounded-full">
            <Button
              variant={"ghost"}
              className="p-1 text-base w-full max-w-full  text-gray-400"
            >
              <MdOutlineAdd className="shrink-0 text-gray-400" />
              Edit Routes
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] max-h-[85svh] overflow-hidden flex flex-col px-4 py-5 rounded">
          <DialogTitle className="sr-only">Edit Routes</DialogTitle>
          <DialogDescription className="sr-only">Edit Routes</DialogDescription>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto">
            {Object.keys(routesColor).map((route, index) => {
              //console.log(route);
              return (
                <RouteItem
                  key={index}
                  route={route}
                  promo={routesColor[route].promo}
                />
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
