"use client";
import { useStore } from "@/app/store";
import { useEffect } from "react";

export default function Initialization() {
  const setUnit = useStore((state) => state.setUnit);

  useEffect(() => {
    if (localStorage.getItem("unit")?.toLowerCase() === "imperial") {
      setUnit("imperial");
    } else {
      setUnit("metric");
    }
  }, [setUnit]);

  return null; // This component is intentionally left empty
}
