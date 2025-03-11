import { create } from "zustand";
import { BusInfo } from "./utils/getBusInfo";

export type StoreState = {
  currentLocation: string;
  updateCurrentLocation: (newLocation: string) => void;
  shuttleData: BusInfo;
};

export const useStore = create((set) => ({
  currentLocation: "715 Broadway",
  updateCurrentLocation: (newLocation: string) =>
    set({ currentLocation: newLocation }),
  shuttleData: {},
}));
