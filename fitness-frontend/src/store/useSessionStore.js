import { create } from 'zustand';

const useSessionStore = create((set) => ({
  acceptedSessions: [],

  addSession: (session) =>
    set((state) => ({
      acceptedSessions: [...state.acceptedSessions, session],
    })),

  removeSession: (id) =>
    set((state) => ({
      acceptedSessions: state.acceptedSessions.filter((s) => s.id !== id),
    })),

  clearSessions: () => set({ acceptedSessions: [] }),

  historySessions: [],

  recordSession: (session) =>
    set((state) => ({
      historySessions: [...state.historySessions, { ...session, status: "Completed" }],
      acceptedSessions: state.acceptedSessions.filter((s) => s.id !== session.id),
    })),

  cancelSession: (session) =>
    set((state) => ({
      historySessions: [...state.historySessions, { ...session, status: "Cancelled" }],
      acceptedSessions: state.acceptedSessions.filter((s) => s.id !== session.id),
    })),
}));

export default useSessionStore;