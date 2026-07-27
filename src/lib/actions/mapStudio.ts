import { axiosInstance } from "@/lib/api/axios";
import {
  BuildingDto,
  FloorPlanDto,
  GraphDto,
  NodeDto,
  RegisterBuildingRequest,
  UpdateBuildingPrivacyRequest,
  UpdateFloorPlanRequest,
  UpdateGraphRequest,
  BuildingStatsDto, // <-- Added
  FloorPlanStatsDto // <-- Added
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

  updateBuildingPrivacy: async (buildingId: number, payload: UpdateBuildingPrivacyRequest): Promise<BuildingDto> => {
    try {
      const response = await axiosInstance.patch<BuildingDto>(`/api/mapstudio/buildings/${buildingId}/privacy`, payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to update building privacy.");
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

  uploadFloorPlan: async (buildingId: number, name: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const res = await axiosInstance.post(`/api/mapstudio/buildings/${buildingId}/floorplans/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const rawData = axiosError.response?.data;
      const errorMessage = typeof rawData === "string" ? rawData : rawData?.message;
      
      throw new Error(errorMessage || "Failed to upload floor plan.");
    }
  },

  downloadExportZip: async (orgId: number) => {
    const res = await axiosInstance.get(`/api/exportmap/organisations/${orgId}/export`, {
      responseType: 'blob'
    });
    return res.data;
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
  },

  deleteNode: async (nodeId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/mapstudio/nodes/${nodeId}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to delete node.");
    }
  },

  // --- TTS INTEGRATION ---
  generateNodeTts: async (nodeId: number, text: string): Promise<NodeDto> => {
    try {
      const response = await axiosInstance.post<NodeDto>(`/api/mapstudio/nodes/${nodeId}/tts/generate`, { text });
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to generate TTS audio.");
    }
  },

  deleteNodeTts: async (nodeId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/mapstudio/nodes/${nodeId}/tts`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to delete TTS audio.");
    }
  },

  // --- STATS (TICKET 8) ---
  getBuildingStats: async (buildingId: number): Promise<BuildingStatsDto> => {
    try {
      const response = await axiosInstance.get<BuildingStatsDto>(`/api/mapstudio/buildings/${buildingId}/stats`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch building stats.");
    }
  },

  getFloorPlanStats: async (floorPlanId: number): Promise<FloorPlanStatsDto> => {
    try {
      const response = await axiosInstance.get<FloorPlanStatsDto>(`/api/mapstudio/floorplans/${floorPlanId}/stats`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Failed to fetch floor plan stats.");
    }
  }
};