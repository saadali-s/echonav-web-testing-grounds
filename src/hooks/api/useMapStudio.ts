import { mapStudioActions } from "@/lib/actions/mapStudio";
import {
    RegisterBuildingRequest,
    UpdateFloorPlanRequest,
    UpdateGraphRequest
} from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

// --- BUILDINGS ---

export function useGetBuildings(orgId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.mapStudio.buildings(orgId),
    queryFn: () => mapStudioActions.getBuildings(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: number; data: RegisterBuildingRequest }) => 
      mapStudioActions.createBuilding(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mapStudio.buildings(variables.orgId) });
    },
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ buildingId }: { buildingId: number }) => 
      mapStudioActions.deleteBuilding(buildingId),
    // Invalidating the base key ensures all orgs refresh if necessary
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

// --- FLOOR PLANS ---

export function useGetFloorPlans(buildingId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.mapStudio.floorPlans(buildingId),
    queryFn: () => mapStudioActions.getFloorPlans(buildingId!),
    enabled: !!buildingId && !isNaN(buildingId),
  });
}

export function useUpdateFloorPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ floorPlanId, data }: { floorPlanId: number; data: UpdateFloorPlanRequest }) => 
      mapStudioActions.updateFloorPlan(floorPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorPlans"] });
    },
  });
}

export function useDeleteFloorPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ floorPlanId }: { floorPlanId: number }) => 
      mapStudioActions.deleteFloorPlan(floorPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorPlans"] });
    },
  });
}

// --- SPATIAL GRAPHS ---

export function useGetSpatialGraph(floorPlanId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.mapStudio.spatialGraph(floorPlanId),
    queryFn: () => mapStudioActions.getSpatialGraph(floorPlanId!),
    enabled: !!floorPlanId && !isNaN(floorPlanId),
  });
}

export function useUpdateSpatialGraph() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ floorPlanId, data }: { floorPlanId: number; data: UpdateGraphRequest }) => 
      mapStudioActions.updateSpatialGraph(floorPlanId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mapStudio.spatialGraph(variables.floorPlanId) });
    },
  });
}

export const useGenerateNodeTts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nodeId, text }: { nodeId: number; text: string }) => 
      mapStudioActions.generateNodeTts(nodeId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spatialGraph"] });
    },
  });
};

export const useDeleteNodeTts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nodeId: number) => mapStudioActions.deleteNodeTts(nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spatialGraph"] });
    },
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nodeId: number) => mapStudioActions.deleteNode(nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spatialGraph"] });
    },
  });
};