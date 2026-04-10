"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client"; // Use your central client!

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Use your lib's createClient function
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    // If createClient returned null (due to missing keys), stop here
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = () => setIsLoggedIn(true);
  
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
    }
  };

  const value = React.useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, supabase]
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