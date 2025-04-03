"use client";

import dynamic from "next/dynamic";

const Schedule = dynamic(() => import("@/app/main/schedule/Schedule"), {
  ssr: false, // ❌ 关闭服务器端渲染
});

export default function Page() {
  return <Schedule />;
}
