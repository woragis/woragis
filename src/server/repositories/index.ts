// Export all repositories
export { ProjectRepository } from "./project.repository";
export { TagRepository } from "./tag.repository";
export { CategoryRepository } from "./category.repository";
export { LanguageRepository } from "./language.repository";
export { FrameworkRepository } from "./framework.repository";
export { SettingsRepository } from "./settings.repository";

// Create singleton instances
export const projectRepository = new ProjectRepository();
export const tagRepository = new TagRepository();
export const categoryRepository = new CategoryRepository();
export const languageRepository = new LanguageRepository();
export const frameworkRepository = new FrameworkRepository();
export const settingsRepository = new SettingsRepository();
