import { Button } from "@/components/ui/button";
import { MdOutlineAdd } from "react-icons/md";
import { stops, routes } from "@/app/utils";
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
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MdCheckBox } from "react-icons/md";

function RouteItem({ route, promo }: { route: string; promo: string }) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`w-full h-40 shadow rounded p-4 flex flex-col transition-all ${
        selected ? "bg-egg-blue-400 text-white" : "bg-white text-black"
      }`}
      onClick={() => setSelected(!selected)}
    >
      <div className="flex flex-row items-center">
        <span className="text-lg font-bold">Route {route}</span>
        <MdCheckBox className="ml-auto w-6 h-6 shadow-none text-white" />
      </div>
      <p className="text-base mt-6">{promo}</p>
    </div>
  );
}

export default function Add() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="p-1 text-base w-full max-w-full"
          >
            <MdOutlineAdd className="shrink-0 text-gray-500" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto p-2 rounded">
          <DialogHeader>
            <DialogTitle>
              <div className="hidden">Add Routes</div>
            </DialogTitle>
            {/* <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(routes).map((route, index) => {
              console.log(route);
              return (
                <RouteItem
                  key={index}
                  route={route}
                  promo={routes[route].promo}
                />
              );
            })}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              {/* <Button type="button" variant="secondary">
                Close
              </Button> */}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
