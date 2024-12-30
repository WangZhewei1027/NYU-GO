import { create } from "zustand";

export type StoreState = {
  currentLocation: string;
  updateCurrentLocation: (newLocation: string) => void;
};

export const useStore = create((set) => ({
  currentLocation: "715 Broadway",
  updateCurrentLocation: (newLocation: string) =>
    set({ currentLocation: newLocation }),
}));
