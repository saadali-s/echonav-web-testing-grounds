import { dashboardActions } from "@/lib/actions/dashboard";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useGetDashboard(orgId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboard.data(orgId),
    queryFn: () => dashboardActions.getDashboardData(orgId!),
    enabled: !!orgId && !isNaN(orgId),
  });
}