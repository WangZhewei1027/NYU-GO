"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const guide = localStorage.getItem("guideCompleted");

    if (guide === "true") {
      router.replace("/main/track");
    } else {
      router.replace("/guide");
    }
  }, [router]);

  return null;
}
