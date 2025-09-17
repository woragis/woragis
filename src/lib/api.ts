// Legacy API utility - bridges old hooks with new API client
import { apiClient } from "./api-client";

// Re-export the API client as the default export for backward compatibility
export default apiClient;

// Also export named exports for convenience
export { apiClient } from "./api-client";
export {
  projectApi,
  languageApi,
  frameworkApi,
  settingsApi,
} from "./api-service";
export { blogApi } from "./api/blog";
export { blogTagApi } from "./api/blog-tags";
export { projectTagApi } from "./api/project-tags";
export { testimonialTagApi } from "./api/testimonial-tags";
export { experienceApi } from "./api/experience";
export { testimonialApi } from "./api/testimonials";
export {
  musicGenreApi,
  lastListenedSongApi,
  animeApi,
  bookApi,
  politicalViewApi,
  youtuberApi,
  gameApi,
} from "./api/about";
export { authService } from "./auth-service";
export { useAuthStore, useAuth, useAuthActions } from "../stores/auth-store";
