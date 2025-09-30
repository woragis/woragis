// Supported languages in the system
export type SupportedLanguage = "en" | "es" | "pt" | "it" | "fr" | "ja" | "zh" | "ko";

// Base translation interface
export interface BaseTranslation {
  languageCode: SupportedLanguage;
  createdAt: Date;
  updatedAt: Date;
}

// Blog post translation
export interface BlogPostTranslation extends BaseTranslation {
  blogPostId: string;
  title: string;
  excerpt: string;
  content: string;
}

// Project translation
export interface ProjectTranslation extends BaseTranslation {
  projectId: string;
  title: string;
  description: string;
  longDescription?: string | null;
  content?: string | null;
}

// Experience translation
export interface ExperienceTranslation extends BaseTranslation {
  experienceId: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string; // JSON string of translated achievements
}

// Education translation
export interface EducationTranslation extends BaseTranslation {
  educationId: string;
  degree: string;
  school: string;
  year: string;
  description?: string | null;
}

// Testimonial translation
export interface TestimonialTranslation extends BaseTranslation {
  testimonialId: string;
  name: string;
  role: string;
  company: string;
  content: string;
}

// About translation
export interface AboutTranslation extends BaseTranslation {
  aboutId: string;
  title: string;
  content: string;
}

// Union type for all translations
export type Translation = 
  | BlogPostTranslation 
  | ProjectTranslation 
  | ExperienceTranslation 
  | EducationTranslation 
  | TestimonialTranslation 
  | AboutTranslation;

// Translation creation/update types
export interface CreateBlogPostTranslation {
  blogPostId: string;
  languageCode: SupportedLanguage;
  title: string;
  excerpt: string;
  content: string;
}

export interface CreateProjectTranslation {
  projectId: string;
  languageCode: SupportedLanguage;
  title: string;
  description: string;
  longDescription?: string | null;
  content?: string | null;
}

export interface CreateExperienceTranslation {
  experienceId: string;
  languageCode: SupportedLanguage;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface CreateEducationTranslation {
  educationId: string;
  languageCode: SupportedLanguage;
  degree: string;
  school: string;
  year: string;
  description?: string | null;
}

export interface CreateTestimonialTranslation {
  testimonialId: string;
  languageCode: SupportedLanguage;
  name: string;
  role: string;
  company: string;
  content: string;
}

export interface CreateAboutTranslation {
  aboutId: string;
  languageCode: SupportedLanguage;
  title: string;
  content: string;
}

// Translation status for admin interface
export interface TranslationStatus {
  languageCode: SupportedLanguage;
  isComplete: boolean;
  isPublished: boolean;
  lastUpdated?: Date;
  missingFields: string[];
}

// Content with translations
export interface TranslatableContent<T> {
  id: string;
  original: T;
  translations: Record<SupportedLanguage, Partial<T>>;
  translationStatus: TranslationStatus[];
}

// Translation query options
export interface TranslationQueryOptions {
  language: SupportedLanguage;
  fallbackToDefault?: boolean;
  includeOriginal?: boolean;
}

// Translation response wrapper
export interface TranslationResponse<T> {
  content: T;
  language: SupportedLanguage;
  isTranslated: boolean;
  isFallback: boolean;
}

// Language metadata
export interface LanguageMetadata {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

// Translation statistics
export interface TranslationStats {
  totalContent: number;
  translatedContent: Record<SupportedLanguage, number>;
  completionPercentage: Record<SupportedLanguage, number>;
  missingTranslations: Record<SupportedLanguage, string[]>;
}
