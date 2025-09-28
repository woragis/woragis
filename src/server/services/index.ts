// Import all services
import { AuthService } from "./auth.service";
import { ProjectService } from "./project.service";
import { FrameworkService } from "./framework.service";
import { SettingsService } from "./settings.service";
import { TestimonialService } from "./testimonial.service";
import { BlogService } from "./blog.service";
import { ExperienceService } from "./experience.service";
import { BlogTagService } from "./blog-tag.service";
import { ProjectTagService } from "./project-tag.service";
import {
  BiographyService,
  MusicGenreService,
  LastListenedSongService,
  AnimeService,
  BookService,
  GameService,
  PoliticalViewService,
  YoutuberService,
  InstrumentsService,
  MartialArtsService,
  LanguagesService,
  HobbiesService,
} from "./about";
import { UploadService, getUploadConfig } from "./common";

// Export all services
export {
  AuthService,
  ProjectService,
  FrameworkService,
  SettingsService,
  TestimonialService,
  BlogService,
  ExperienceService,
  BlogTagService,
  ProjectTagService,
  BiographyService,
  MusicGenreService,
  LastListenedSongService,
  AnimeService,
  BookService,
  GameService,
  PoliticalViewService,
  YoutuberService,
  InstrumentsService,
  MartialArtsService,
  LanguagesService,
  HobbiesService,
  UploadService,
};

// Create singleton instances
export const authService = new AuthService();
export const projectService = new ProjectService();
export const frameworkService = new FrameworkService();
export const settingsService = new SettingsService();
export const testimonialService = new TestimonialService();
export const blogService = new BlogService();
export const experienceService = new ExperienceService();
export const blogTagService = new BlogTagService();
export const projectTagService = new ProjectTagService();

// Create about service instances
export const biographyService = new BiographyService();
export const musicGenreService = new MusicGenreService();
export const lastListenedSongService = new LastListenedSongService();
export const animeService = new AnimeService();
export const bookService = new BookService();
export const gameService = new GameService();
export const politicalViewService = new PoliticalViewService();
export const youtuberService = new YoutuberService();
export const instrumentsService = new InstrumentsService();
export const martialArtsService = new MartialArtsService();
export const languagesService = new LanguagesService();
export const hobbiesService = new HobbiesService();

// Create common service instances
export const uploadService = new UploadService(getUploadConfig());
