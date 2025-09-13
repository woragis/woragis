import { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { authService } from "./auth-service";
import { useAuthStore } from "@/stores/auth-store";

// Request interceptor to add authentication headers
export const authRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // Skip auth for auth endpoints
  if (config.url?.includes("/auth/")) {
    return config;
  }

  // Get tokens from store
  const tokens = useAuthStore.getState().tokens;

  if (tokens && !authService.isTokenExpired(tokens.expiresAt)) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
};

// Response interceptor to handle token refresh
export const authResponseInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  return response;
};

// Error interceptor to handle authentication errors
export const authErrorInterceptor = async (error: any): Promise<any> => {
  const originalRequest = error.config;

  // Skip retry for auth endpoints or if already retried
  if (originalRequest.url?.includes("/auth/") || originalRequest._retry) {
    return Promise.reject(error);
  }

  // Handle 401 Unauthorized
  if (error.response?.status === 401) {
    const { tokens, refreshToken, logout } = useAuthStore.getState();

    if (!tokens) {
      // No tokens available, redirect to login
      logout();
      return Promise.reject(error);
    }

    // Check if refresh token is expired
    if (authService.isTokenExpired(tokens.expiresAt)) {
      try {
        // Try to refresh the token
        await refreshToken();

        // Get the updated tokens from store
        const newTokens = useAuthStore.getState().tokens;
        if (!newTokens) {
          logout();
          return Promise.reject(error);
        }

        // Retry the original request with new token
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

        return Promise.resolve();
      } catch (refreshError) {
        // Refresh failed, logout user
        logout();
        return Promise.reject(error);
      }
    }
  }

  // Handle 403 Forbidden
  if (error.response?.status === 403) {
    // User doesn't have permission, but they're authenticated
    // Don't logout, just show error
    console.warn("Access forbidden:", error.response.data?.message);
  }

  // Handle 429 Too Many Requests
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers["retry-after"];
    if (retryAfter) {
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
    }
  }

  return Promise.reject(error);
};

// Token refresh interceptor (runs before requests)
export const tokenRefreshInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  // Skip for auth endpoints
  if (config.url?.includes("/auth/")) {
    return config;
  }

  const { tokens, refreshToken } = useAuthStore.getState();

  if (!tokens) {
    return config;
  }

  // Check if token is expired or expiring soon
  if (
    authService.isTokenExpired(tokens.expiresAt) ||
    authService.isTokenExpiringSoon(tokens.expiresAt)
  ) {
    try {
      // Refresh the token
      await refreshToken();

      // Get the updated tokens from store
      const newTokens = useAuthStore.getState().tokens;
      if (newTokens) {
        config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      }
    } catch (error) {
      // Refresh failed, but don't block the request
      // The error interceptor will handle it
      console.warn("Token refresh failed:", error);
    }
  }

  return config;
};

// Network error interceptor
export const networkErrorInterceptor = async (error: any): Promise<any> => {
  if (!error.response && error.request) {
    // Network error
    const { setError } = useAuthStore.getState();
    setError("Network error. Please check your connection.");
  }

  return Promise.reject(error);
};

// Request logging interceptor (for development)
export const requestLoggingInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
  }
  return config;
};

// Response logging interceptor (for development)
export const responseLoggingInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        data: response.data,
      }
    );
  }
  return response;
};

// Error logging interceptor (for development)
export const errorLoggingInterceptor = async (error: any): Promise<any> => {
  if (process.env.NODE_ENV === "development") {
    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      }
    );
  }
  return Promise.reject(error);
};
