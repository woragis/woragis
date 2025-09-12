import { apiClient } from "./api-client";
import {
  authRequestInterceptor,
  authResponseInterceptor,
  authErrorInterceptor,
  tokenRefreshInterceptor,
  networkErrorInterceptor,
  requestLoggingInterceptor,
  responseLoggingInterceptor,
  errorLoggingInterceptor,
} from "./auth-interceptors";

// Initialize API client with interceptors
export const initializeApiClient = () => {
  // Add authentication interceptors
  apiClient.addRequestInterceptor(authRequestInterceptor);
  apiClient.addRequestInterceptor(tokenRefreshInterceptor);
  apiClient.addResponseInterceptor(authResponseInterceptor);
  apiClient.addErrorInterceptor(authErrorInterceptor);
  apiClient.addErrorInterceptor(networkErrorInterceptor);

  // Add logging interceptors in development
  if (process.env.NODE_ENV === "development") {
    apiClient.addRequestInterceptor(requestLoggingInterceptor);
    apiClient.addResponseInterceptor(responseLoggingInterceptor);
    apiClient.addErrorInterceptor(errorLoggingInterceptor);
  }

  console.log("🚀 API Client initialized with authentication interceptors");
};

// Initialize on module load
initializeApiClient();
