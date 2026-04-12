"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  activeOrgId: string | null;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [activeOrgId, setActiveOrgId] = React.useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    if (!supabase) return;

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsLoggedIn(!!session);

      // INSTANT READ: No database await required!
      setActiveOrgId(currentUser?.user_metadata?.organization_id || null);
    });

    // 2. Listen for auth changes (Login, Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsLoggedIn(!!session);

      // INSTANT READ
      setActiveOrgId(currentUser?.user_metadata?.organization_id || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      setActiveOrgId(null);
      setIsLoggedIn(false);
    }
  };

  const value = React.useMemo(
    () => ({
      isLoggedIn,
      user,
      activeOrgId,
      login,
      logout,
    }),
    [isLoggedIn, user, activeOrgId, supabase],
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
