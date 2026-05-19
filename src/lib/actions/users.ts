import { axiosInstance } from "@/lib/api/axios";
import { InviteUserRequest, InviteUserResponse, PairingPinDto, UserDto } from "@/lib/api/types";
import { AxiosError } from "axios";

export const userActions = {
  getUsers: async (orgId: number): Promise<UserDto[]> => {
    try {
      const response = await axiosInstance.get<UserDto[]>(`/api/users/organisation/${orgId}`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch users.");
    }
  },

  inviteUser: async (payload: InviteUserRequest): Promise<InviteUserResponse> => {
    try {
      const response = await axiosInstance.post<InviteUserResponse>("/api/users/invite", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to generate pairing PIN.");
    }
  },


  getPendingUserPins: async (orgId: number): Promise<PairingPinDto[]> => {
    const response = await axiosInstance.get<PairingPinDto[]>(`/api/users/pins/organisation/${orgId}`);
    return response.data;
  },
  
  deleteUser: async (userId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to delete user.");
    }
  }
};