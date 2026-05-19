import { axiosInstance } from "@/lib/api/axios";
import {
  BuildingDto,
  FloorPlanDto,
  GraphDto,
  RegisterBuildingRequest,
  UpdateFloorPlanRequest,
  UpdateGraphRequest
} from "@/lib/api/types";
import { AxiosError } from "axios";

export const mapStudioActions = {
  // --- BUILDINGS ---
  createBuilding: async (orgId: number, payload: RegisterBuildingRequest): Promise<BuildingDto> => {
    try {
      const response = await axiosInstance.post<BuildingDto>(`/api/mapstudio/organisations/${orgId}/buildings`, payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to create building.");
    }
  },

  deleteBuilding: async (buildingId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/mapstudio/buildings/${buildingId}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to delete building.");
    }
  },

  getBuildings: async (orgId: number): Promise<BuildingDto[]> => {
    try {
      const response = await axiosInstance.get<BuildingDto[]>(`/api/mapstudio/organisations/${orgId}/buildings`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch buildings.");
    }
  },

  // --- FLOOR PLANS ---
  getFloorPlans: async (buildingId: number): Promise<FloorPlanDto[]> => {
    try {
      const response = await axiosInstance.get<FloorPlanDto[]>(`/api/mapstudio/buildings/${buildingId}/floorplans`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch floor plans.");
    }
  },

  updateFloorPlan: async (floorPlanId: number, payload: UpdateFloorPlanRequest): Promise<FloorPlanDto> => {
    try {
      const response = await axiosInstance.put<FloorPlanDto>(`/api/mapstudio/floorplans/${floorPlanId}`, payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to update floor plan.");
    }
  },

  deleteFloorPlan: async (floorPlanId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/mapstudio/floorplans/${floorPlanId}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to delete floor plan.");
    }
  },

  uploadFloorPlan: async (buildingId: number, name: string, file: File): Promise<FloorPlanDto> => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const response = await axiosInstance.post<FloorPlanDto>(
        `/api/mapstudio/buildings/${buildingId}/floorplans/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to upload floor plan.");
    }
  },

  // --- SPATIAL GRAPHS ---
  getSpatialGraph: async (floorPlanId: number): Promise<GraphDto> => {
    try {
      const response = await axiosInstance.get<GraphDto>(`/api/mapstudio/floorplans/${floorPlanId}/graph`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch spatial graph.");
    }
  },

  updateSpatialGraph: async (floorPlanId: number, payload: UpdateGraphRequest): Promise<GraphDto> => {
    try {
      const response = await axiosInstance.put<GraphDto>(`/api/mapstudio/floorplans/${floorPlanId}/graph`, payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to save vector graph.");
    }
  }
};