import { Button } from "@/components/ui/button";
import { MdOutlineAdd } from "react-icons/md";
import { stops } from "@/app/utils";
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

export default function Add() {
  const [selectedStop, setSelectedStop] = useState("715 Broadway Departure");

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
        <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Stop</DialogTitle>
            {/* <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription> */}
          </DialogHeader>
          {stops.map((stop, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2"
              onClick={() => {
                setSelectedStop(stop);
                (
                  document.querySelector('[data-state="open"]') as HTMLElement
                )?.click();
              }}
            >
              <div>{stop}</div>
            </div>
          ))}
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
