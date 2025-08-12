"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { IoEnterOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const data = [
  { img: "/guide/guide_1.png", description: "Description 1" },
  { img: "/guide/guide_1.png", description: "Description 2" },
  { img: "/guide/guide_1.png", description: "Description 3" },
  { img: "/guide/guide_1.png", description: "Description 4" },
  { img: "/guide/guide_1.png", description: "Description 5" },
];

export function CarouselDApiDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const router = useRouter();

  return (
    <div className="mx-auto w-full px-4">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {data.map((item, index) => (
            <CarouselItem key={index}>
              <Card className="border-0 shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <img
                    src={item.img}
                    alt={`Slide ${index + 1}`}
                    className="max-h-[70vh] object-contain"
                  />
                </CardContent>
              </Card>
              <div className="w-full flex items-center justify-center mt-4">
                <span className="text-lg text-gray-500">
                  {item.description}
                </span>
              </div>
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
        <div className="mt-2 flex justify-center">
          <Button
            type="button"
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 font-bold gap-0 text-lg"
            onClick={() => {
              localStorage.setItem("guideCompleted", "true");
              router.replace("/main/track");
            }}
          >
            <IoEnterOutline className="mr-2 h-10 w-10 stroke-[2.5]" />
            Enter
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <CarouselDApiDemo />
    </div>
  );
}
