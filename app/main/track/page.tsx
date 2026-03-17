"use client";

import dynamic from "next/dynamic";

// ✅ 让 ShuttleMap 仅在客户端渲染
const TrackPage = dynamic(() => import("@/app/main/track/TrackPage"), {
  ssr: false, // ❌ 关闭服务器端渲染
});

export default function Page() {
  return <TrackPage />;
}
