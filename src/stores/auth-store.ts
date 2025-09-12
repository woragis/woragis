import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
}

// Token utilities
const isTokenExpired = (expiresAt: number): boolean => {
  return Date.now() >= expiresAt;
};

const getStoredTokens = (): AuthTokens | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("auth-tokens");
    if (!stored) return null;

    const tokens = JSON.parse(stored) as AuthTokens;
    return isTokenExpired(tokens.expiresAt) ? null : tokens;
  } catch {
    return null;
  }
};

const storeTokens = (tokens: AuthTokens): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("auth-tokens", JSON.stringify(tokens));
  } catch (error) {
    console.error("Failed to store tokens:", error);
  }
};

const clearStoredTokens = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("auth-tokens");
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // This would typically make an API call
          // For now, we'll simulate the response
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
          }

          const data = await response.json();

          if (data.success && data.data) {
            const { user, tokens } = data.data;

            set({
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Store tokens
            storeTokens(tokens);
          } else {
            throw new Error(data.error || "Login failed");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Registration failed");
          }

          const result = await response.json();

          if (result.success && result.data) {
            const { user, tokens } = result.data;

            set({
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Store tokens
            storeTokens(tokens);
          } else {
            throw new Error(result.error || "Registration failed");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        // Clear stored tokens
        clearStoredTokens();
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens) return;

        try {
          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokens.refreshToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Token refresh failed");
          }

          const data = await response.json();

          if (data.success && data.data) {
            const newTokens = data.data;

            set({
              tokens: newTokens,
              isAuthenticated: true,
            });

            // Update stored tokens
            storeTokens(newTokens);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (error) {
          // If refresh fails, logout the user
          get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      checkAuth: async () => {
        const storedTokens = getStoredTokens();

        if (!storedTokens) {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true });

        try {
          // Verify token with server
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedTokens.accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Token verification failed");
          }

          const data = await response.json();

          if (data.success && data.data) {
            set({
              user: data.data,
              tokens: storedTokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("Token verification failed");
          }
        } catch (error) {
          // If verification fails, clear auth state
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          clearStoredTokens();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    clearError: store.clearError,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    logout: store.logout,
    register: store.register,
    refreshToken: store.refreshToken,
    updateUser: store.updateUser,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    checkAuth: store.checkAuth,
  };
};
