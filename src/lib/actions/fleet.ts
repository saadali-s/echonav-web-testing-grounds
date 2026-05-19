import { axiosInstance } from "@/lib/api/axios";
import {
    BeaconDto,
    CreateBatchTasksRequest,
    DeploymentTaskDto,
    LinkBeaconRequest,
    UpdateTaskRequest
} from "@/lib/api/types";
import { AxiosError } from "axios";

export const fleetActions = {
  getStaffTasks: async (staffId: number): Promise<DeploymentTaskDto[]> => {
    try {
      const response = await axiosInstance.get<DeploymentTaskDto[]>(`/api/fleet/tasks/staff/${staffId}`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch tasks.");
    }
  },
  // --- SUBTASK 5.3 FIX: Global Fetch Actions ---
  getOrganizationTasks: async (orgId: number) => {
    const response = await axiosInstance.get(`/api/fleet/tasks/organisation/${orgId}`);
    return response.data;
  },
  getOrganizationBeacons: async (orgId: number) => {
    const response = await axiosInstance.get(`/api/fleet/beacons/organisation/${orgId}`);
    return response.data;
  },
  updateTaskStatus: async (taskId: number, payload: UpdateTaskRequest): Promise<DeploymentTaskDto> => {
    try {
      const response = await axiosInstance.put<DeploymentTaskDto>(`/api/fleet/tasks/${taskId}`, payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to update task status.");
    }
  },

  linkBeacon: async (payload: LinkBeaconRequest): Promise<BeaconDto> => {
    try {
      const response = await axiosInstance.post<BeaconDto>("/api/fleet/beacons/link", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to link beacon.");
    }
  },

  // --- SUBTASK 2.8 FIX: Create Batch Tasks ---
  createTasks: async (payload: CreateBatchTasksRequest): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>("/api/fleet/tasks", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to assign tasks.");
    }
  }
};