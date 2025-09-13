// Legacy API utility - bridges old hooks with new API client
import { apiClient } from "./api-client";

// Re-export the API client as the default export for backward compatibility
export default apiClient;

// Also export named exports for convenience
export { apiClient } from "./api-client";
export {
  projectApi,
  categoryApi,
  tagApi,
  languageApi,
  frameworkApi,
  settingsApi,
} from "./api-service";
export { blogApi } from "./api/blog";
export { experienceApi } from "./api/experience";
export { testimonialApi } from "./api/testimonials";
export { authService } from "./auth-service";
export { useAuthStore, useAuth, useAuthActions } from "../stores/auth-store";
