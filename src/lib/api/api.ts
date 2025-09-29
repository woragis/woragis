// Legacy API utility - bridges old hooks with new API client
import { apiClient } from "../clients/apiClient";

// Re-export the API client as the default export for backward compatibility
export default apiClient;

// Also export named exports for convenience
export { apiClient } from "../clients/apiClient";
export {
  projectApi,
  languageApi,
  frameworkApi,
  settingsApi,
} from "./api-service";
export { blogApi } from "./blog";
export { blogTagApi } from "./blog-tags";
export { experienceApi } from "./experience";
export { testimonialApi } from "./testimonials";
export {
  musicGenreApi,
  lastListenedSongApi,
  animeApi,
  bookApi,
  politicalViewApi,
  youtuberApi,
  gameApi,
} from "./about";
export { authApi as authService } from "./auth";
export { useAuthStore, useAuth, useAuthActions } from "../../stores/auth-store";
