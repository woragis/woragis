// Import all repositories
import { AuthRepository } from "./auth.repository";
import { ProjectRepository } from "./project.repository";
import { FrameworkRepository } from "./framework.repository";
import { SettingsRepository } from "./settings.repository";
import { TestimonialRepository } from "./testimonial.repository";
import { BlogRepository } from "./blog.repository";
import { ExperienceRepository } from "./experience.repository";
import { BlogTagRepository } from "./blog-tag.repository";
import { ProjectTagRepository } from "./project-tag.repository";
import {
  BiographyRepository,
  MusicGenreRepository,
  LastListenedSongRepository,
  AnimeRepository,
  BookRepository,
  PoliticalViewRepository,
  YoutuberRepository,
  GameRepository,
  InstrumentsRepository,
  MartialArtsRepository,
  LanguagesRepository,
  HobbiesRepository,
} from "./about";

// Export all repositories
export {
  AuthRepository,
  ProjectRepository,
  FrameworkRepository,
  SettingsRepository,
  TestimonialRepository,
  BlogRepository,
  ExperienceRepository,
  BlogTagRepository,
  ProjectTagRepository,
  BiographyRepository,
  MusicGenreRepository,
  LastListenedSongRepository,
  AnimeRepository,
  BookRepository,
  PoliticalViewRepository,
  YoutuberRepository,
  GameRepository,
  InstrumentsRepository,
  MartialArtsRepository,
  LanguagesRepository,
  HobbiesRepository,
};

// Create singleton instances
export const authRepository = new AuthRepository();
export const projectRepository = new ProjectRepository();
export const frameworkRepository = new FrameworkRepository();
export const settingsRepository = new SettingsRepository();
export const testimonialRepository = new TestimonialRepository();
export const blogRepository = new BlogRepository();
export const experienceRepository = new ExperienceRepository();
export const blogTagRepository = new BlogTagRepository();
export const projectTagRepository = new ProjectTagRepository();

// Create about repository instances
export const biographyRepository = new BiographyRepository();
export const musicGenreRepository = new MusicGenreRepository();
export const lastListenedSongRepository = new LastListenedSongRepository();
export const animeRepository = new AnimeRepository();
export const bookRepository = new BookRepository();
export const politicalViewRepository = new PoliticalViewRepository();
export const youtuberRepository = new YoutuberRepository();
export const gameRepository = new GameRepository();
export const instrumentsRepository = new InstrumentsRepository();
export const martialArtsRepository = new MartialArtsRepository();
export const languagesRepository = new LanguagesRepository();
export const hobbiesRepository = new HobbiesRepository();
