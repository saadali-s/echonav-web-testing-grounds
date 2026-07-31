import { fleetActions } from "@/lib/actions/fleet";
import {
  CreateBatchTasksRequest,
  LinkBeaconRequest,
  UpdateTaskRequest,
} from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useGetStaffTasks(staffId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.fleet.staffTasks(staffId),
    queryFn: () => fleetActions.getStaffTasks(staffId!),
    enabled: !!staffId && !isNaN(staffId),
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: number;
      data: UpdateTaskRequest;
    }) => fleetActions.updateTaskStatus(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffTasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useGetOrganizationTasks(orgId: number | undefined) {
  return useQuery({
    queryKey: ["tasks", orgId],
    queryFn: () => fleetActions.getOrganizationTasks(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}

export function useGetOrganizationBeacons(orgId: number | undefined) {
  return useQuery({
    queryKey: ["beacons", orgId],
    queryFn: () => fleetActions.getOrganizationBeacons(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}

export function useLinkBeacon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LinkBeaconRequest) => fleetActions.linkBeacon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beacons"] });
    },
  });
}

export function useCreateTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBatchTasksRequest) =>
      fleetActions.createTasks(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fleet.staffTasks(variables.staffId),
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
