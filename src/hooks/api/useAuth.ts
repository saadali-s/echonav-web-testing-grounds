import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authActions } from "@/lib/actions/auth";
import { UpdateOrgRequest } from "@/lib/api/types";

export const useGetOrganisation = (orgId: number) => {
  return useQuery({
    queryKey: ["organisation", orgId],
    queryFn: () => authActions.getOrganisation(orgId),
    enabled: !!orgId, // Only fetch if we actually have an ID
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, payload }: { orgId: number; payload: UpdateOrgRequest }) =>
      authActions.updateOrganisation(orgId, payload),
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ["organisation", variables.orgId] });
    },
  });
};