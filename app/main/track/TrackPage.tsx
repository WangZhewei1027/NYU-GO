"use client";

import React, { useMemo } from "react";
import Card from "@/components/Card/Card";
import Add from "@/components/Add";
import Location from "@/components/LocationDrawer/Location";
import { useStore } from "@/app/store";
import { memo } from "react";
import AlertBell from "@/components/AlertBell";
import InstallGuide from "@/components/InstallGuide";

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

  const MemoizedLocation = useMemo(() => <Location />, []);

  const insets = useStore((state) => state.insets);

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

      {/* Location */}
      <div className="mb-8 text-base">
        Departing from &nbsp;
        <div className="max-w-48 inline-block">{MemoizedLocation}</div>
        &nbsp; in
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
