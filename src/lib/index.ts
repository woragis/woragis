// API Client
export { apiClient, ApiClient } from "./api-client";
export type {
  ApiClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from "./api-client";

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

// API Services
export {
  projectApi,
  categoryApi,
  tagApi,
  languageApi,
  frameworkApi,
  settingsApi,
  ProjectApiService,
  CategoryApiService,
  TagApiService,
  LanguageApiService,
  FrameworkApiService,
  SettingsApiService,
} from "./api-service";

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
