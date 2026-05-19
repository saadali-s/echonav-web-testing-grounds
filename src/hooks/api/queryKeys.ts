// Centralized Query Key Factory
export const queryKeys = {
  mapStudio: {
    buildings: (orgId?: number) => ["buildings", orgId] as const,
    floorPlans: (buildingId?: number) => ["floorPlans", buildingId] as const,
    spatialGraph: (floorPlanId?: number) => ["spatialGraph", floorPlanId] as const,
  },
  fleet: {
    staffTasks: (staffId?: number) => ["staffTasks", staffId] as const,
  },
  staff: {
    roster: (orgId?: number) => ["staff", "roster", orgId] as const,
  },
  // --- SUBTASK 2.2 FIX: Add Users Keys ---
  users: {
    roster: (orgId?: number) => ["users", "roster", orgId] as const,
  },
  auth: {
    session: ["auth", "session"] as const,
  },
};