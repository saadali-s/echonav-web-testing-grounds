"use client";

import { authActions } from "@/lib/actions/auth";
import { RegisterOrgRequest } from "@/lib/api/types";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface User {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: {
    organization_id?: string;
    display_name?: string;
  };
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  activeOrgId: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterOrgRequest) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    activeOrgId: null,
  });

  useEffect(() => {
    // Hydrate the UI state entirely from localStorage
    const storedUser = localStorage.getItem("echonav_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthState({
        isLoggedIn: true,
        user: parsedUser,
        activeOrgId: parsedUser.user_metadata?.organization_id || null,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authActions.login(email, password);
    
    const { token, role, organisationId, userId } = response;

    const userData: User = {
      id: String(userId),
      email: email,
      role: role,
      user_metadata: {
        organization_id: String(organisationId),
        display_name: email.split("@")[0],
      },
    };

    // 1. Store the UI user state
    localStorage.setItem("echonav_user", JSON.stringify(userData));
    
    // 2. Store the REAL JWT in a standard cookie so both Client and Server can read it
    document.cookie = `echonav_token=${token}; path=/; max-age=86400; SameSite=Lax`;

    setAuthState({
      isLoggedIn: true,
      user: userData,
      activeOrgId: String(organisationId),
    });

    window.location.href = "/dashboard";
  }, []);

  const register = useCallback(async (payload: RegisterOrgRequest) => {
    await authActions.register(payload);
    // The backend login requires a password, which is optional on the frontend type but required here
    if (payload.password) {
      await login(payload.email, payload.password);
    } else {
      // Fallback if password isn't passed through for some reason
      window.location.href = "/auth?tab=login";
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await authActions.logout();
    } catch {
      console.warn("Cleared local state regardless of server response.");
    } finally {
      // 1. Clear Local Storage
      localStorage.removeItem("echonav_user");
      
      // Destroy the real JWT cookie
      document.cookie = `echonav_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      setAuthState({ isLoggedIn: false, user: null, activeOrgId: null });
      window.location.href = "/";
    }
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      register,
    }),
    [authState, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}