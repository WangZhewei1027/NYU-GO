"use client";

import dynamic from "next/dynamic";
import useShuttleData from "@/app/utils/useShuttleData";

// ✅ 让 ShuttleMap 仅在客户端渲染
const TrackPage = dynamic(() => import("@/app/main/track/TrackPage"), {
  ssr: false, // ❌ 关闭服务器端渲染
});

export default function Page() {
  const shuttleData = useShuttleData();

  return <TrackPage />;
}
