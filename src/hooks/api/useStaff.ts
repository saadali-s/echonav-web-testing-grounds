import { staffActions } from "@/lib/actions/staff";
import { InviteStaffRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useGetStaff(orgId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.staff.roster(orgId),
    queryFn: () => staffActions.getStaff(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteStaffRequest) => staffActions.inviteStaff(data),
    onSuccess: (_, variables) => {
      // THE FIX: Refreshes both tables automatically without needing an F5 manual refresh
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