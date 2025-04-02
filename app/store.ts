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
  location: Position;
  setLocation: (locations: Position) => void;
  personalData: PersonalData;
  setPersonalData: (data: PersonalData) => void;
  currentLocation: string;
  updateCurrentLocation: (newLocation: string) => void;
  shuttleData: BusInfo;
  setShuttleData: (data: BusInfo) => void;
  stopsData: StopRoute;
};

export const useStore = create<StoreState>()(
  devtools((set) => ({
    location: { latitude: 0, longitude: 0 }, // 默认位置
    stopsData: initStopsData(),
    setLocation: (location: Position) => set({ location }),
    personalData: {},
    setPersonalData: (data: PersonalData) => set({ personalData: data }),
    currentLocation: "715 Broadway",
    updateCurrentLocation: (newLocation: string) =>
      set({ currentLocation: newLocation }),
    shuttleData: {},
    setShuttleData: (data: BusInfo) => set({ shuttleData: data }),
  }))
);
