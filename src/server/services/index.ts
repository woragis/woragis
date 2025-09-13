// Import all services
import { AuthService } from "./auth.service";
import { ProjectService } from "./project.service";
import { CategoryService } from "./category.service";
import { TagService } from "./tag.service";
import { LanguageService } from "./language.service";
import { FrameworkService } from "./framework.service";
import { SettingsService } from "./settings.service";
import { TestimonialService } from "./testimonial.service";
import { BlogService } from "./blog.service";
import { ExperienceService } from "./experience.service";

// Export all services
export {
  AuthService,
  ProjectService,
  CategoryService,
  TagService,
  LanguageService,
  FrameworkService,
  SettingsService,
  TestimonialService,
  BlogService,
  ExperienceService,
};

// Create singleton instances
export const authService = new AuthService();
export const projectService = new ProjectService();
export const categoryService = new CategoryService();
export const tagService = new TagService();
export const languageService = new LanguageService();
export const frameworkService = new FrameworkService();
export const settingsService = new SettingsService();
export const testimonialService = new TestimonialService();
export const blogService = new BlogService();
export const experienceService = new ExperienceService();
