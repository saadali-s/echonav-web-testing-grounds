import { staffActions } from "@/lib/actions/staff";
import { InviteStaffRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useGetStaff(orgId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.staff.roster(orgId),
    queryFn: () => staffActions.getStaff(orgId!),
    enabled: !!orgId && !isNaN(orgId),
    // SMART POLLING: Refreshes active roster every 10 seconds
    refetchInterval: 10000, 
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteStaffRequest) => staffActions.inviteStaff(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.roster(variables.organisationId) });
      queryClient.invalidateQueries({ queryKey: ["staff", "invites", variables.organisationId] });
    },
  });
}

export function useGetPendingInvites(orgId: number | undefined) {
  return useQuery({
    queryKey: ["staff", "invites", orgId],
    queryFn: () => staffActions.getPendingInvites(orgId!),
    enabled: !!orgId && !isNaN(orgId),
    // SMART POLLING: Aggressively checks for invite acceptance every 3 seconds
    refetchInterval: 3000,
  });
}

export function useDeleteStaff(orgId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffId: number) => staffActions.deleteStaff(staffId),
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.roster(orgId) });
      } else {
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      }
    },
  });
}

export function useDeleteStaffInvite(orgId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: number) => staffActions.deleteStaffInvite(inviteId),
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ["staff", "invites", orgId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["staff", "invites"] });
      }
    },
  });
}