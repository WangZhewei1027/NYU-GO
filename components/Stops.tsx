import { Button } from "@/components/ui/button";
import { MdArrowDropDown } from "react-icons/md";
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
import { useStore, StoreState } from "@/app/store";

export default function Stops() {
  const [selectedStop, setSelectedStop] = useState("715 Broadway Departure");

  const store: StoreState = useStore() as StoreState;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="p-1 text-base w-full max-w-full"
          >
            <MdArrowDropDown className="shrink-0 text-gray-500" />
            <span className="truncate">{selectedStop}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Stop</DialogTitle>
            <DialogDescription>
              <div className="hidden">
                {" "}
                Anyone who has this link will be able to view this.
              </div>
            </DialogDescription>
          </DialogHeader>
          {stops.map((stop, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2"
              onClick={() => {
                setSelectedStop(stop);
                store.currentLocation = stop;
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
