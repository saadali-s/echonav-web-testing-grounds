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

    // Helper function to fetch the Org ID from your existing profiles table
    const fetchUserProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setActiveOrgId(data.organization_id);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes (Login, Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setActiveOrgId(null); 
      }
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
