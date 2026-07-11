import { staffActions } from "@/lib/actions/staff";
import { InviteStaffRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

interface ActivateInviteVariables {
  staffId: number;
  payload: {
    role: "ADMIN" | "TECHNICIAN";
    email: string;
  };
}

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.staff.roster(variables.organisationId)
      });
      queryClient.invalidateQueries({
        queryKey: ["staff", "invites", variables.organisationId]
      });
    },
  });
}
export function useAcceptInvite(organisationId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    // 2. Accept the combined variables object here
    mutationFn: ({ staffId, payload }: ActivateInviteVariables) =>
      staffActions.activateInvite(staffId, payload),

    onSuccess: () => {
      // 1. Invalidate the pending invites cache
      queryClient.invalidateQueries({
        queryKey: ["staff", "PENDING", organisationId],
      });
      // 2. Invalidate the active roster cache
      queryClient.invalidateQueries({
        queryKey: ["staff", "ACTIVE", organisationId],
      });
    },
    onError: (error: any) => {
      alert(`Failed to update the backend: ${error.message}`)
    }
  });
}
export function useGetPendingInvites(orgId: number | undefined) {
  return useQuery({
    queryKey: ["staff", "invites", orgId],
    queryFn: () => staffActions.getPendingInvites(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}
export function useDeleteStaff(organisationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: number) => staffActions.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "roster", organisationId]
      });
      queryClient.invalidateQueries({
        queryKey: ["staff", "invites", organisationId]
      });
    },
    onError: (error: any) => {
      alert(`Failed to remove staff member: ${error.message || "Server rejection"}`);
    }
  });
}