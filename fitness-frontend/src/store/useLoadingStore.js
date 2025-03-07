import { create } from "zustand";
import { devtools } from "zustand/middleware";
export const useLoadingStore = create(
  devtools((set, get) => ({
    loading: false,
    setLoading: (status) =>
      set({
        loading: status,
      }),
  }))
);
