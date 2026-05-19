import { axiosInstance } from "@/lib/api/axios";
import { InviteStaffRequest, StaffDto, StaffInviteDto } from "@/lib/api/types";
import { AxiosError } from "axios";

export const staffActions = {
  getStaff: async (orgId: number): Promise<StaffDto[]> => {
    try {
      const response = await axiosInstance.get<StaffDto[]>(`/api/staff/organisation/${orgId}`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch staff roster.");
    }
  },

  inviteStaff: async (payload: InviteStaffRequest): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>("/api/staff/invite", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to invite staff.");
    }
  },
  getPendingInvites: async (orgId: number): Promise<StaffInviteDto[]> => {
    const response = await axiosInstance.get<StaffInviteDto[]>(`/api/staff/invites/organisation/${orgId}`);
    return response.data;
  },
  deleteStaff: async (staffId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/staff/${staffId}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to delete staff member.");
    }
  }
};