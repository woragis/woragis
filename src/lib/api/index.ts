// Export all API modules
export { apiClient, ApiClient } from "./client";
export type {
  ApiClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from "./client";

export { projectApi } from "./projects";
export { frameworkApi } from "./frameworks";
export { settingsApi } from "./settings";
export { blogApi } from "./blog";
export { experienceApi } from "./experience";
export { testimonialApi } from "./testimonials";
export { authApi } from "./auth";
export { blogTagApi } from "./blog-tags";
export { projectTagApi } from "./project-tags";
export { testimonialTagApi } from "./testimonial-tags";
export {
  aboutCoreApi,
  musicGenreApi,
  lastListenedSongApi,
  animeApi,
  bookApi,
  politicalViewApi,
  youtuberApi,
  gameApi,
} from "./about";

// Re-export the main client as default for backward compatibility
export { apiClient as default } from "./client";
