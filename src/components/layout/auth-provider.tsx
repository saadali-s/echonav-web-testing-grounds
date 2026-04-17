"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface User {
  id: string;
  email?: string;
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
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    activeOrgId: null,
  });

  // Hydrate UI state silently after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSession = document.cookie.includes("echonav_session=true");
      if (hasSession) {
        setAuthState({
          isLoggedIn: true,
          user: {
            id: "mock-user",
            email: "admin@echonav.com",
            user_metadata: { organization_id: "org-123", display_name: "Admin" },
          },
          activeOrgId: "org-123",
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async () => {
    // ---------------------------------------------------------
    // [SPRING BOOT placeholder POINT]
    // const res = await fetch("http://localhost:8080/api/v1/auth/login", { ... });
    // if (!res.ok) throw new Error("Login failed");
    // ---------------------------------------------------------

    // Mocking the backend setting a secure HttpOnly cookie:
    document.cookie = "echonav_session=true; path=/; max-age=86400; SameSite=Lax";
    
    window.location.href = "/dashboard";
  }, []);

  const logout = useCallback(async () => {
    // ---------------------------------------------------------
    // [SPRING BOOT placeholder POINT]
    // await fetch("http://localhost:8080/api/v1/auth/logout", { method: "POST" });
    // ---------------------------------------------------------

    // Mocking the backend clearing the cookie:
    document.cookie = "echonav_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    
    // hard reload to completely destroy the client-side 
    // React tree and route the cleared cookie state to the server middleware.
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
    }),
    [authState, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};