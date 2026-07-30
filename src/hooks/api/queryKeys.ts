export const queryKeys = {
  mapStudio: {
    buildings: (orgId?: number) => ["buildings", orgId] as const,
    floorPlans: (buildingId?: number) => ["floorPlans", buildingId] as const,
    spatialGraph: (floorPlanId?: number) =>
      ["spatialGraph", floorPlanId] as const,
    buildingStats: (buildingId?: number) =>
      ["buildingStats", buildingId] as const,
    floorPlanStats: (floorPlanId?: number) =>
      ["floorPlanStats", floorPlanId] as const,
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
  dashboard: {
    data: (orgId?: number) => ["dashboard", orgId] as const,
  },
};
