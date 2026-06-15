"use client";

import React, { useMemo } from "react";
import Card from "@/components/Card/Card";
import Add from "@/components/Add";
import Location from "@/components/LocationDrawer/Location";
import { useStore } from "@/app/store";
import { memo } from "react";
import AlertBell from "@/components/AlertBell";
import InstallGuide from "@/components/InstallGuide";
import { MdSwapVert } from "react-icons/md";
import { routesColor } from "@/app/utils/utils";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "C", time: "8", color: "yellow" },
  { name: "E", time: "8", color: "yellow" },
  { name: "F", time: "3", color: "green" },
  { name: "G", time: "6", color: "cyan" },
  { name: "W", time: "7", color: "amber" },
];

const MemoizedCard = memo(Card);

export default function TrackPage() {
  const visibleRoutes = useStore((state) => state.visibleRoutes);
  const currentLocation = useStore((state) => state.currentLocation);
  const destination = useStore((state) => state.destination);
  const stopsData = useStore((state) => state.stopsData);

  const MemoizedFrom = useMemo(() => <Location mode="from" />, []);
  const MemoizedTo = useMemo(
    () => <Location mode="to" placeholder="Select destination" />,
    [],
  );

  const insets = useStore((state) => state.insets);

  const handleSwap = () => {
    const { currentLocation, destination } = useStore.getState();
    useStore.getState().updateCurrentLocation(destination);
    useStore.getState().updateDestination(currentLocation);
    useStore.getState().setEnableAutoNearestStop?.(false);
  };

  const fromRoutes: string[] = stopsData[currentLocation]?.routes ?? [];
  const toRoutes: string[] = stopsData[destination]?.routes ?? [];
  const overlappingRoutes = new Set(
    destination ? fromRoutes.filter((r) => toRoutes.includes(r)) : [],
  );

  return (
    <div
      className="p-4 h-screen overflow-y-auto"
      style={{ marginTop: insets?.top ?? 0 }}
    >
      {/* Header */}
      <div className="flex mb-6 items-center">
        <h1 className="text-3xl font-bold">Track</h1>
        <InstallGuide className="ml-auto mr-4" />
        <AlertBell />
      </div>

      {/* Location Card */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-md">
        <div className="min-w-0 flex-1 space-y-0">
          {/* From */}
          <div className="border-b pb-3">
            <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
              From
            </div>
            {MemoizedFrom}
            {fromRoutes.length > 0 && (
              <div className="mt-1.5">
                {fromRoutes.map((r) => (
                  <span
                    key={r}
                    className="inline mr-2 p-3 py-1 text-xs rounded-md text-gray-900 font-bold"
                    style={{
                      backgroundColor: overlappingRoutes.has(r)
                        ? routesColor[r]?.color
                        : "#e5e7eb",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* To */}
          <div className="pt-3">
            <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
              To
            </div>
            {MemoizedTo}
            {toRoutes.length > 0 && (
              <div className="mt-1.5">
                {toRoutes.map((r) => (
                  <span
                    key={r}
                    className="inline mr-2 p-3 py-1 text-xs rounded-md text-gray-900 font-bold"
                    style={{
                      backgroundColor: overlappingRoutes.has(r)
                        ? routesColor[r]?.color
                        : "#e5e7eb",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap button */}
        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap from and to"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow transition active:scale-90"
        >
          <MdSwapVert className="h-5 w-5" />
        </button>
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map(
          (route, index) =>
            visibleRoutes.includes(route.name) && (
              <MemoizedCard name={route.name} key={index} />
            ),
        )}
        <div className="flex justify-center items-center">
          <div className="w-32">
            <Add />
          </div>
        </div>
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
}
