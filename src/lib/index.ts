// API Client and Services
export * from "./api";

// Authentication
export { authService, AuthService } from "./auth-service";
export { useAuthStore, useAuth, useAuthActions } from "../stores/auth-store";
export type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthState,
} from "../stores/auth-store";

// Interceptors
export {
  authRequestInterceptor,
  authResponseInterceptor,
  authErrorInterceptor,
  tokenRefreshInterceptor,
  networkErrorInterceptor,
  requestLoggingInterceptor,
  responseLoggingInterceptor,
  errorLoggingInterceptor,
} from "./auth-interceptors";

// Initialize API client
export { initializeApiClient } from "./api-init";
