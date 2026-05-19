import { userActions } from "@/lib/actions/users";
import { InviteUserRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useGetUsers(orgId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.users.roster(orgId),
    queryFn: () => userActions.getUsers(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteUserRequest) => userActions.inviteUser(data),
    onSuccess: (_, variables) => {
      // Instantly refresh the user table after a successful invite
      queryClient.invalidateQueries({ queryKey: queryKeys.users.roster(variables.organisationId) });
    },
  });
}

export function useGetPendingUserPins(orgId: number | undefined) {
  return useQuery({
    queryKey: ["users", "pins", orgId],
    queryFn: () => userActions.getPendingUserPins(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}

export function useDeleteUser(orgId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => userActions.deleteUser(userId),
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.roster(orgId) });
      } else {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
  });
}