"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/app/store";
import updateLog from "@/app/main/schedule/updateLog.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const latestVersion = updateLog[0].version;
const latestContent = updateLog[0].content;
const latestDate = updateLog[0].date;

export default function UpdatePopup() {
  const [open, setOpen] = useState(false);
  const lastSeenVersion = useStore((s) => s.lastSeenVersion);
  const setLastSeenVersion = useStore((s) => s.setLastSeenVersion);

  useEffect(() => {
    if (lastSeenVersion < latestVersion) {
      setOpen(true);
    }
  }, [lastSeenVersion]);

  const handleClose = () => {
    setLastSeenVersion(latestVersion);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="w-[90vw] max-w-[400px] rounded-3xl p-6 sm:p-8 md:p-10 border-none shadow-2xl">
        <DialogHeader className="text-left space-y-1 mb-2">
          <DialogTitle
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "rgb(29, 173, 175)" }}
          >
            Version {latestVersion}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
            {latestDate}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <h4 className="text-sm font-bold text-foreground mb-3 tracking-wide">WHAT'S NEW</h4>
          <ul className="space-y-3">
            {latestContent.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm sm:text-base font-medium text-foreground/80 leading-relaxed">
                <span 
                  className="font-bold flex-shrink-0 mt-[2px]" 
                  style={{ color: "rgb(29, 173, 175)" }}
                >
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="mt-6">
          <Button
            className="w-full text-white font-bold h-12 rounded-2xl text-base shadow-md transition-all hover:shadow-lg hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "rgb(29, 173, 175)" }}
            onClick={handleClose}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
