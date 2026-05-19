import { axiosInstance } from "@/lib/api/axios";
import {
  LoginResponse,
  MobileSignupRequest,
  PairingRequest,
  RegisterOrgRequest
} from "@/lib/api/types";
import { AxiosError } from "axios";

export const authActions = {
  register: async (payload: RegisterOrgRequest): Promise<string> => {
    try {
      const response = await axiosInstance.post("/api/auth/register", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Registration failed.");
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>("/api/auth/login", { email, password });
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Invalid credentials.");
    }
  },

  pairDevice: async (payload: PairingRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>("/api/auth/pair", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Invalid pairing PIN.");
    }
  },

  mobileSignup: async (payload: MobileSignupRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>("/api/auth/mobile-signup", payload);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Mobile signup failed.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch {
      console.error("Server logout failed, clearing local state anyway.");
    }
  }
};