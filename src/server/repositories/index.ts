// Import all repositories
import { ProjectRepository } from "./project.repository";
import { TagRepository } from "./tag.repository";
import { CategoryRepository } from "./category.repository";
import { LanguageRepository } from "./language.repository";
import { FrameworkRepository } from "./framework.repository";
import { SettingsRepository } from "./settings.repository";

// Export all repositories
export {
  ProjectRepository,
  TagRepository,
  CategoryRepository,
  LanguageRepository,
  FrameworkRepository,
  SettingsRepository,
};

// Create singleton instances
export const projectRepository = new ProjectRepository();
export const tagRepository = new TagRepository();
export const categoryRepository = new CategoryRepository();
export const languageRepository = new LanguageRepository();
export const frameworkRepository = new FrameworkRepository();
export const settingsRepository = new SettingsRepository();
