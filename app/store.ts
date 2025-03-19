import { create } from "zustand";
import { BusInfo } from "./utils/getBusInfo";
import { devtools } from "zustand/middleware";

export type PersonalData = {
  name: string;
  staredStops: string[];
};

export type StoreState = {
  personalData: PersonalData;
  setPersonalData: (data: PersonalData) => void;
  currentLocation: string;
  updateCurrentLocation: (newLocation: string) => void;
  shuttleData: BusInfo;
  setShuttleData: (data: BusInfo) => void;
};

export const useStore = create<StoreState>()(
  devtools((set) => ({
    personalData: {},
    setPersonalData: (data: PersonalData) => set({ personalData: data }),
    currentLocation: "715 Broadway",
    updateCurrentLocation: (newLocation: string) =>
      set({ currentLocation: newLocation }),
    shuttleData: {},
    setShuttleData: (data: BusInfo) => set({ shuttleData: data }),
  }))
);
