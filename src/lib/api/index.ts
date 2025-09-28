// Legacy API utility - bridges old hooks with new API client
export { default } from './api';

// API Services
export {
  projectApi,
  languageApi,
  frameworkApi,
  settingsApi,
} from './api-service';

// Blog API
export { blogApi } from './blog';
export { blogTagApi } from './blog-tags';

// Experience API
export { experienceApi } from './experience';

// Testimonials API
export { testimonialApi } from './testimonials';

// About API
export {
  musicGenreApi,
  lastListenedSongApi,
  animeApi,
  bookApi,
  politicalViewApi,
  youtuberApi,
  gameApi,
} from './about';