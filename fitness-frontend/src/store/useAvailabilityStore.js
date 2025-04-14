import { create } from "zustand";

const useTrainerAvailabilityStore = create((set) => ({
  availability: [], 

  addSlot: (slot) =>
    set((state) => ({
      availability: [...state.availability, slot],
    })),

  removeSlot: (slotId) =>
    set((state) => ({
      availability: state.availability.filter((slot) => slot.id !== slotId),
    })),

  // optionally a setter to initialize or reset all availability
  setAvailability: (slots) => set({ availability: slots }),
}));

export default useTrainerAvailabilityStore;
