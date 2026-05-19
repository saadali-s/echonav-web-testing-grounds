import { navigationActions } from "@/lib/actions/navigation";
import { RouteRequest } from "@/lib/api/types";
import { useMutation } from "@tanstack/react-query";

export function useCalculateRoute() {
  return useMutation({
    mutationFn: (data: RouteRequest) => navigationActions.getRoute(data),
  });
}