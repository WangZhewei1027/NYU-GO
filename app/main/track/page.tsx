"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import Stops from "@/components/Stops";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "E", time: "8", color: "yellow" },
];

const TrackPage = () => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex mb-6">
        <h1 className="text-3xl font-bold">Track</h1>
      </div>

      {/* Location */}
      <div className="mb-8 text-base">
        Arriving at &nbsp; <Stops />
        &nbsp; in
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map((route, index) => (
          <Card name={route.name} color={route.color} key={index} />
        ))}
      </div>
    </div>
  );
};

export default TrackPage;
