import { axiosInstance } from "@/lib/api/axios";
import { InviteStaffRequest, StaffDto } from "@/lib/api/types";
import { AxiosError } from "axios";

interface ActivateInvitePayload {
  role: "ADMIN" | "TECHNICIAN";
  email: string;
}

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
  activateInvite: async (staffId: number, payload: ActivateInvitePayload): Promise<void> => {
    try {
      const response = await axiosInstance.put(`/api/staff/${staffId}/accept`, payload);
      return response.data;
    }
    catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.log("Server Status Status:", axiosError.response?.status);
      console.log("Server Error Body:", axiosError.response?.data);

      throw new Error(axiosError.response?.data?.message || "Failed to accept system invitation");
    }
  },
  // Inside src/lib/actions/staff.ts
  inviteStaff: async (data: InviteStaffRequest) => {
    try {
      const response = await axiosInstance.post("/api/staff/invite", data);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      const rawErrorMessage = typeof axiosError.response?.data === 'string'
        ? axiosError.response.data
        : axiosError.response?.data?.message;

      console.error("CRITICAL BACKEND ERROR:", rawErrorMessage || axiosError.message);

      throw new Error(rawErrorMessage || axiosError.message || "Failed to invite staff.");
    }
  },
  getPendingInvites: async (orgId: number): Promise<StaffDto[]> => {
    const response = await axiosInstance.get<StaffDto[]>(`/api/staff/invites/organisation/${orgId}`);
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