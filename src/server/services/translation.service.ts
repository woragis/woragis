import { translationRepository } from "../repositories";
import type {
  SupportedLanguage,
  CreateBlogPostTranslation,
  CreateProjectTranslation,
  CreateExperienceTranslation,
  CreateEducationTranslation,
  CreateTestimonialTranslation,
  TranslationStatus,
  TranslationStats,
  TranslationResponse,
} from "@/types";

export class TranslationService {
  // Blog Post Translation Services
  async createBlogPostTranslation(
    translation: CreateBlogPostTranslation
  ): Promise<TranslationResponse<any>> {
    const result = await translationRepository.createBlogPostTranslation(translation);
    return {
      content: result,
      language: translation.languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async updateBlogPostTranslation(
    blogPostId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateBlogPostTranslation>
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.updateBlogPostTranslation(
      blogPostId,
      languageCode,
      translation
    );
    
    if (!result) return null;

    return {
      content: result,
      language: languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async getBlogPostWithTranslation(
    blogPostId: string,
    languageCode: SupportedLanguage,
    fallbackToDefault: boolean = true
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.getBlogPostWithTranslation(
      blogPostId,
      languageCode,
      fallbackToDefault
    );

    if (!result) return null;

    return {
      content: result,
      language: result.language,
      isTranslated: result.isTranslated,
      isFallback: result.isFallback || false,
    };
  }

  // Project Translation Services
  async createProjectTranslation(
    translation: CreateProjectTranslation
  ): Promise<TranslationResponse<any>> {
    const result = await translationRepository.createProjectTranslation(translation);
    return {
      content: result,
      language: translation.languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async updateProjectTranslation(
    projectId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateProjectTranslation>
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.updateProjectTranslation(
      projectId,
      languageCode,
      translation
    );
    
    if (!result) return null;

    return {
      content: result,
      language: languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async getProjectWithTranslation(
    projectId: string,
    languageCode: SupportedLanguage,
    fallbackToDefault: boolean = true
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.getProjectWithTranslation(
      projectId,
      languageCode,
      fallbackToDefault
    );

    if (!result) return null;

    return {
      content: result,
      language: result.language,
      isTranslated: result.isTranslated,
      isFallback: result.isFallback || false,
    };
  }

  // Experience Translation Services
  async createExperienceTranslation(
    translation: CreateExperienceTranslation
  ): Promise<TranslationResponse<any>> {
    const result = await translationRepository.createExperienceTranslation(translation);
    return {
      content: result,
      language: translation.languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async updateExperienceTranslation(
    experienceId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateExperienceTranslation>
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.updateExperienceTranslation(
      experienceId,
      languageCode,
      translation
    );
    
    if (!result) return null;

    return {
      content: result,
      language: languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async getExperienceWithTranslation(
    experienceId: string,
    languageCode: SupportedLanguage,
    fallbackToDefault: boolean = true
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.getExperienceWithTranslation(
      experienceId,
      languageCode,
      fallbackToDefault
    );

    if (!result) return null;

    return {
      content: result,
      language: result.language,
      isTranslated: result.isTranslated,
      isFallback: result.isFallback || false,
    };
  }

  // Education Translation Services
  async createEducationTranslation(
    translation: CreateEducationTranslation
  ): Promise<TranslationResponse<any>> {
    const result = await translationRepository.createEducationTranslation(translation);
    return {
      content: result,
      language: translation.languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async updateEducationTranslation(
    educationId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateEducationTranslation>
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.updateEducationTranslation(
      educationId,
      languageCode,
      translation
    );
    
    if (!result) return null;

    return {
      content: result,
      language: languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  // Testimonial Translation Services
  async createTestimonialTranslation(
    translation: CreateTestimonialTranslation
  ): Promise<TranslationResponse<any>> {
    const result = await translationRepository.createTestimonialTranslation(translation);
    return {
      content: result,
      language: translation.languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  async updateTestimonialTranslation(
    testimonialId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateTestimonialTranslation>
  ): Promise<TranslationResponse<any> | null> {
    const result = await translationRepository.updateTestimonialTranslation(
      testimonialId,
      languageCode,
      translation
    );
    
    if (!result) return null;

    return {
      content: result,
      language: languageCode,
      isTranslated: true,
      isFallback: false,
    };
  }

  // Translation Management Services
  async getTranslationStatus(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string
  ): Promise<TranslationStatus[]> {
    return await translationRepository.getTranslationStatus(contentType, contentId);
  }

  async getTranslationStats(): Promise<TranslationStats> {
    return await translationRepository.getTranslationStats();
  }

  async deleteTranslations(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string
  ): Promise<void> {
    await translationRepository.deleteTranslations(contentType, contentId);
  }

  // Bulk Translation Operations
  async createMultipleTranslations(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string,
    translations: Record<SupportedLanguage, any>
  ): Promise<TranslationResponse<any>[]> {
    const results: TranslationResponse<any>[] = [];

    for (const [languageCode, translationData] of Object.entries(translations)) {
      if (!translationData) continue;

      const lang = languageCode as SupportedLanguage;
      let result: TranslationResponse<any> | null = null;

      switch (contentType) {
        case "blog":
          result = await this.createBlogPostTranslation({
            blogPostId: contentId,
            languageCode: lang,
            ...translationData,
          });
          break;
        case "project":
          result = await this.createProjectTranslation({
            projectId: contentId,
            languageCode: lang,
            ...translationData,
          });
          break;
        case "experience":
          result = await this.createExperienceTranslation({
            experienceId: contentId,
            languageCode: lang,
            ...translationData,
          });
          break;
        case "education":
          result = await this.createEducationTranslation({
            educationId: contentId,
            languageCode: lang,
            ...translationData,
          });
          break;
        case "testimonial":
          result = await this.createTestimonialTranslation({
            testimonialId: contentId,
            languageCode: lang,
            ...translationData,
          });
          break;
      }

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  // Translation Validation
  validateTranslationData(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    data: any
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (contentType) {
      case "blog":
        if (!data.title || data.title.trim().length === 0) {
          errors.push("Title is required");
        }
        if (!data.excerpt || data.excerpt.trim().length === 0) {
          errors.push("Excerpt is required");
        }
        if (!data.content || data.content.trim().length === 0) {
          errors.push("Content is required");
        }
        break;
      case "project":
        if (!data.title || data.title.trim().length === 0) {
          errors.push("Title is required");
        }
        if (!data.description || data.description.trim().length === 0) {
          errors.push("Description is required");
        }
        break;
      case "experience":
        if (!data.title || data.title.trim().length === 0) {
          errors.push("Title is required");
        }
        if (!data.company || data.company.trim().length === 0) {
          errors.push("Company is required");
        }
        if (!data.period || data.period.trim().length === 0) {
          errors.push("Period is required");
        }
        if (!data.location || data.location.trim().length === 0) {
          errors.push("Location is required");
        }
        if (!data.description || data.description.trim().length === 0) {
          errors.push("Description is required");
        }
        if (!data.achievements || !Array.isArray(data.achievements) || data.achievements.length === 0) {
          errors.push("At least one achievement is required");
        }
        break;
      case "education":
        if (!data.degree || data.degree.trim().length === 0) {
          errors.push("Degree is required");
        }
        if (!data.school || data.school.trim().length === 0) {
          errors.push("School is required");
        }
        if (!data.year || data.year.trim().length === 0) {
          errors.push("Year is required");
        }
        break;
      case "testimonial":
        if (!data.name || data.name.trim().length === 0) {
          errors.push("Name is required");
        }
        if (!data.role || data.role.trim().length === 0) {
          errors.push("Role is required");
        }
        if (!data.company || data.company.trim().length === 0) {
          errors.push("Company is required");
        }
        if (!data.content || data.content.trim().length === 0) {
          errors.push("Content is required");
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Language Detection and Auto-translation (placeholder for future implementation)
  async detectLanguage(text: string): Promise<SupportedLanguage> {
    // This would integrate with a language detection service
    // For now, return English as default
    return "en";
  }

  async autoTranslate(
    text: string,
    fromLanguage: SupportedLanguage,
    toLanguage: SupportedLanguage
  ): Promise<string> {
    // This would integrate with translation services like Google Translate
    // For now, return the original text
    return text;
  }
}
