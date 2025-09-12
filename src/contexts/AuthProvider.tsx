"use client";

import { useEffect } from "react";
import { useAuthActions } from "@/stores/auth-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth } = useAuthActions();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
