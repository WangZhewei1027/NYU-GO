"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import Stops from "@/components/Stops";
import Add from "@/components/Add";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "E", time: "8", color: "yellow" },
  { name: "F", time: "3", color: "green" },
  { name: "G", time: "6", color: "cyan" },
  { name: "W", time: "7", color: "amber" },
];

const TrackPage = () => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex mb-6">
        <h1 className="text-3xl font-bold">Track</h1>
        <div className="ml-auto">
          <Add />
        </div>
      </div>

      {/* Location */}
      <div className="mb-8 text-base">
        Arriving at &nbsp;
        <div className="max-w-48 inline-block">
          <Stops />
        </div>
        &nbsp; in
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map((route, index) => (
          <Card name={route.name} key={index} />
        ))}
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
};

export default TrackPage;
