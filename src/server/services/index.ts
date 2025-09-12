// Export all services
export { ProjectService } from "./project.service";
export { CategoryService } from "./category.service";
export { TagService } from "./tag.service";
export { LanguageService } from "./language.service";
export { FrameworkService } from "./framework.service";
export { SettingsService } from "./settings.service";

// Create singleton instances
export const projectService = new ProjectService();
export const categoryService = new CategoryService();
export const tagService = new TagService();
export const languageService = new LanguageService();
export const frameworkService = new FrameworkService();
export const settingsService = new SettingsService();
