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
  users: {
    roster: (orgId?: number) => ["users", "roster", orgId] as const,
  },
  auth: {
    session: ["auth", "session"] as const,
  },
  // --- DASHBOARD ADDITION ---
  dashboard: {
    data: (orgId?: number) => ["dashboard", orgId] as const,
  },
};