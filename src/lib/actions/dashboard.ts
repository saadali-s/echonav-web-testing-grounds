import { axiosInstance } from "@/lib/api/axios";
import { DashboardResponseDto } from "@/lib/api/types";
import { AxiosError } from "axios";

export const dashboardActions = {
  getDashboardData: async (orgId: number): Promise<DashboardResponseDto> => {
    try {
      const response = await axiosInstance.get<DashboardResponseDto>(`/api/dashboard/organisations/${orgId}`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch dashboard data.");
    }
  }
};