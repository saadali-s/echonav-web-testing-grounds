import { axiosInstance } from "@/lib/api/axios";
import { RouteRequest, RouteResponse } from "@/lib/api/types";
import { AxiosError } from "axios";

export const navigationActions = {
  getRoute: async (payload: RouteRequest): Promise<RouteResponse> => {
    try {
      const response = await axiosInstance.post<RouteResponse>("/api/navigation/route", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to calculate route. Ensure nodes are saved.");
    }
  }
};