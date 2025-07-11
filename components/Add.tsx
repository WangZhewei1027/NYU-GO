"use client";

import { Button } from "@/components/ui/button";
import { MdOutlineAdd } from "react-icons/md";
import { routesColor } from "@/app/utils/utils";
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
import { useEffect, useState } from "react";
import { MdCheckBox } from "react-icons/md";

function RouteItem({ route, promo }: { route: string; promo: string }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(route) === "true") {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, []);

  return (
    <div
      className={`w-full h-40 shadow rounded p-4 flex flex-col transition-all ${
        selected ? "bg-egg-blue-400 text-white" : "bg-white text-black"
      }`}
      onClick={() => {
        setSelected(!selected);
        localStorage.setItem(route, (!selected).toString());
      }}
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
        <DialogContent className="max-w-[90vw] max-h-[100vh] overflow-hidden p-4 rounded">
          <DialogHeader>
            <DialogTitle asChild>
              <div className="hidden">Edit Routes</div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="hidden">Edit Routes</div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
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
          <DialogFooter className="relative">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="fixed h-10 w-20 bottom-12 left-1/2 transform -translate-x-1/2 border border-egg-blue-400 rounded-full text-egg-blue-400 text-base z-50"
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
