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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isCapacitor = !!(window as any).Capacitor;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isCapacitor && isIOS) {
      document.documentElement.classList.add("is-capacitor-ios");
      console.log("Capacitor iOS detected: Adding class 'is-capacitor-ios'");
    }
  }, []);

  return null; // This component is intentionally left empty
}
