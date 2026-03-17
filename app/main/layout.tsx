"use client";

import React from "react";
import BottomNav from "@/components/BottomNav";
import useShuttleData from "@/app/utils/useShuttleData";

export default function Layout({ children }: { children: React.ReactNode }) {
  // 在 layout 层初始化 WebSocket 和 shuttle 数据，track/map 共享
  useShuttleData();

  return (
    <section className="flex flex-col h-screen">
      {children}
      <BottomNav />
    </section>
  );
}
