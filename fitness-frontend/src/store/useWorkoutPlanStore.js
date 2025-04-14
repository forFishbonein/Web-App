import { create } from "zustand";

const useWorkoutPlanStore = create((set) => ({
  savedPlans: [],

  savePlan: (newPlan) => {
    set((state) => {
      const existing = state.savedPlans.find(
        (plan) =>
          plan.program === newPlan.program &&
          plan.sessionTime === newPlan.sessionTime &&
          JSON.stringify(plan.rows) === JSON.stringify(newPlan.rows)
      );

      if (existing) {
        return {
          savedPlans: state.savedPlans.map((plan) =>
            plan === existing
              ? {
                  ...plan,
                  assignedTo: [
                    ...new Set([...(plan.assignedTo || []), ...(newPlan.assignedTo || [])]),
                  ],
                }
              : plan
          ),
        };
      }

      let baseName = newPlan.program;
      let suffix = 1;
      let uniqueName = baseName;
      while (state.savedPlans.some((plan) => plan.program === uniqueName)) {
        uniqueName = `${baseName}${suffix++}`;
      }

      return {
        savedPlans: [
          ...state.savedPlans,
          {
            ...newPlan,
            program: uniqueName,
            assignedTo: newPlan.assignedTo || [],
          },
        ],
      };
    });
  },

  assignPlanToMember: (program, member) => {
    set((state) => ({
      savedPlans: state.savedPlans.map((plan) =>
        plan.program === program
          ? {
              ...plan,
              assignedTo: [...new Set([...(plan.assignedTo || []), member])],
            }
          : plan
      ),
    }));
  },

  removePlan: (program) => {
    set((state) => ({
      savedPlans: state.savedPlans.filter((plan) => plan.program !== program),
    }));
  },

  removeMemberFromPlan: (program, member) => {
    set((state) => ({
      savedPlans: state.savedPlans.map((plan) =>
        plan.program === program
          ? {
              ...plan,
              assignedTo: (plan.assignedTo || []).filter((m) => m !== member),
            }
          : plan
      ),
    }));
  },
}));

export default useWorkoutPlanStore;