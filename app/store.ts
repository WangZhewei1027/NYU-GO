import { create } from "zustand";
import { BusInfo } from "./utils/getBusInfo";
import { devtools } from "zustand/middleware";

import initStopsData from "@/app/utils/initStopsData";
import { StopRoute, Position } from "@/types";

export type PersonalData = {
  name: string;
  staredStops: string[];
};

export type StoreState = {
  isInitialized: boolean; // 是否已初始化
  setIsInitialized: (isInitialized: boolean) => void; // 设置初始化状态
  location: Position;
  setLocation: (locations: Position) => void;
  personalData: PersonalData;
  setPersonalData: (data: PersonalData) => void;
  currentLocation: string;
  updateCurrentLocation: (newLocation: string) => void;
  shuttleData: BusInfo;
  setShuttleData: (data: BusInfo) => void;
  stopsData: StopRoute;
  unit: "metric" | "imperial"; // 添加单位类型
  setUnit: (unit: "metric" | "imperial") => void;
  enableAutoNearestStop: boolean; // 可选属性，默认为 true
  setEnableAutoNearestStop?: (enable: boolean) => void; // 可选方法
};

export const useStore = create<StoreState>()(
  devtools((set) => ({
    isInitialized: false, // 初始状态为未初始化
    setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
    location: { latitude: 0, longitude: 0 }, // 默认位置
    stopsData: initStopsData(),
    setLocation: (location: Position) => set({ location }),
    personalData: {},
    setPersonalData: (data: PersonalData) => set({ personalData: data }),
    currentLocation: "",
    updateCurrentLocation: (newLocation: string) =>
      set({ currentLocation: newLocation }),
    shuttleData: {},
    setShuttleData: (data: BusInfo) => set({ shuttleData: data }),
    unit: "metric", // 默认单位为公制
    setUnit: (unit: "metric" | "imperial") => set({ unit }),
    enableAutoNearestStop: true, // 默认启用自动最近站点
    setEnableAutoNearestStop: (enable: boolean) =>
      set((state) => ({ enableAutoNearestStop: enable })),
  }))
);
