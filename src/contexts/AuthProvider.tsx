"use client";

import { useEffect, useRef } from "react";
import { useAuthActions, useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, setInitialized } = useAuthActions();
  const { isInitialized } = useAuthStore();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, [checkAuth]); // Include checkAuth in dependencies

  // Handle hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      // If we're on the client and not initialized, mark as initialized
      setInitialized(true);
    }
  }, [isInitialized, setInitialized]);

  return <>{children}</>;
}
