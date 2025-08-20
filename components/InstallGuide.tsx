"use client";

import React from "react";
import { MdOutlineInstallMobile } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { IoEnterOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import clsx from "clsx";
const guideData = [
  { img: "/guide/guide_1.jpg", description: "Description 1" },
  { img: "/guide/guide_2.jpg", description: "Description 2" },
  { img: "/guide/guide_3.jpg", description: "Description 3" },
  { img: "/guide/guide_4.jpg", description: "Description 4" },
  { img: "/guide/guide_5.jpg", description: "Description 5" },
];

function GuideCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <div className="mx-auto w-full px-2 sm:px-4">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {guideData.map((item, index) => (
            <CarouselItem key={index}>
              <Card className="border-0 shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <img
                    src={item.img}
                    alt={`Slide ${index + 1}`}
                    className="max-h-[60vh] sm:max-h-[65vh] object-contain"
                  />
                </CardContent>
              </Card>
              {/* <div className="w-full flex items-center justify-center mt-4">
                <span className="text-lg text-gray-500">
                  {item.description}
                </span>
              </div> */}
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="py-4 flex items-center justify-center gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-4 w-4 rounded-full border-[3px] transition-colors ${
                current === i + 1
                  ? "border-foreground bg-transparent"
                  : "border-gray-300 bg-transparent"
              }`}
            />
          ))}
        </div>
      </Carousel>
      {current === count && (
        <div className="flex justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 font-bold gap-0 text-lg"
            >
              Got it!
            </Button>
          </DialogClose>
        </div>
      )}
    </div>
  );
}

type Props = {
  className?: string;
};

export default function InstallGuide({ className }: Props) {
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    (typeof window.navigator !== "undefined" &&
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true); // iOS Safari

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={clsx("rounded-full p-2 w-9 h-9 relative", className)}
          variant="outline"
        >
          <MdOutlineInstallMobile className="h-4 w-4" />
          {!isPWA && (
            <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-600" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] max-w-[900px] max-h-[90vh] overflow-hidden rounded-lg p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
            Add to Home Screen
          </DialogTitle>
        </DialogHeader>
        <div className="h-full max-h-[90vh] overflow-y-auto p-4 pt-2 pb-4">
          <GuideCarousel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
