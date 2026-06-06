"use client";
import { useStore } from "@/app/store";
import { useEffect } from "react";
import { SafeArea } from "capacitor-plugin-safe-area";
import initStopsData from "@/app/utils/initStopsData";

export default function Initialization() {
  const setUnit = useStore((state) => state.setUnit);
  const setInsets = useStore((state) => state.setInsets);
  const setStopsData = useStore((state) => state.setStopsData);

  useEffect(() => {
    let isMounted = true;

    const hydrateStopsData = async () => {
      try {
        const stopsData = await initStopsData();
        if (isMounted) {
          setStopsData(stopsData);
        }
      } catch (error) {
        console.error("Failed to initialize stops data:", error);
      }
    };

    void hydrateStopsData();

    return () => {
      isMounted = false;
    };
  }, [setStopsData]);

  useEffect(() => {
    SafeArea.getSafeAreaInsets().then(({ insets }) => {
      setInsets(insets);
    });
  }, [setInsets]);

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
