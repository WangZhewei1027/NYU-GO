"use client";

import React from "react";

const routes = [
  { name: "A", time: "4", color: "bg-teal-500" },
  { name: "B", time: "5", color: "bg-orange-500" },
  { name: "E", time: "8", color: "bg-pink-500" },
];

interface CardProps {
  name: string;
  time: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ name, time, color }) => {
  return (
    <div>
      <div className={`flex items-center border rounded-lg shadow-sm mt-1`}>
        <div className={`h-24 w-2 ${color} rounded-l-lg`} />
        <div className="ml-4 text-xl font-bold font-sans">Route {name}</div>
        <div className="ml-auto pr-4">
          <div className="inline text-4xl font-mono">{time}</div>
          <div className="inline ml-1 text-gray-500 text-end">min</div>
        </div>
      </div>
    </div>
  );
};

const TrackPage = () => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex mb-6">
        <h1 className="text-3xl font-bold">Track</h1>
      </div>

      {/* Location */}
      <div>Arriving at XX in</div>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map((route, index) => (
          <Card
            name={route.name}
            time={route.time}
            color={route.color}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackPage;
