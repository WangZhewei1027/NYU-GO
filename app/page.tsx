"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/main/track");
  }, [router]);

  return null; // 不需要显示内容，直接跳转
}
