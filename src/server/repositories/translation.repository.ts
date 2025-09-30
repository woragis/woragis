import { eq, and, sql, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  blogPostTranslations,
  projectTranslations,
  experienceTranslations,
  educationTranslations,
  testimonialTranslations,
  blogPosts,
  projects,
  experiences,
  education,
  testimonials,
} from "../db/schemas";
import type {
  SupportedLanguage,
  BlogPostTranslation,
  ProjectTranslation,
  ExperienceTranslation,
  EducationTranslation,
  TestimonialTranslation,
  CreateBlogPostTranslation,
  CreateProjectTranslation,
  CreateExperienceTranslation,
  CreateEducationTranslation,
  CreateTestimonialTranslation,
  TranslationStatus,
  TranslationStats,
} from "@/types";

export class TranslationRepository {
  // Blog Post Translations
  async createBlogPostTranslation(
    translation: CreateBlogPostTranslation
  ): Promise<BlogPostTranslation> {
    const result = await db
      .insert(blogPostTranslations)
      .values(translation)
      .returning();
    return result[0];
  }

  async updateBlogPostTranslation(
    blogPostId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateBlogPostTranslation>
  ): Promise<BlogPostTranslation | null> {
    const result = await db
      .update(blogPostTranslations)
      .set({ ...translation, updatedAt: new Date() })
      .where(
        and(
          eq(blogPostTranslations.blogPostId, blogPostId),
          eq(blogPostTranslations.languageCode, languageCode)
        )
      )
      .returning();
    return result[0] || null;
  }

  async getBlogPostTranslation(
    blogPostId: string,
    languageCode: SupportedLanguage
  ): Promise<BlogPostTranslation | null> {
    const result = await db
      .select()
      .from(blogPostTranslations)
      .where(
        and(
          eq(blogPostTranslations.blogPostId, blogPostId),
          eq(blogPostTranslations.languageCode, languageCode)
        )
      );
    return result[0] || null;
  }

  async getBlogPostWithTranslation(
    blogPostId: string,
    languageCode: SupportedLanguage,
    fallbackToDefault: boolean = true
  ): Promise<any> {
    // Get the original blog post
    const blogPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, blogPostId));

    if (!blogPost[0]) return null;

    // Get the translation
    const translation = await this.getBlogPostTranslation(blogPostId, languageCode);

    if (translation) {
      return {
        ...blogPost[0],
        title: translation.title,
        excerpt: translation.excerpt,
        content: translation.content,
        isTranslated: true,
        language: languageCode,
      };
    }

    if (fallbackToDefault && languageCode !== "en") {
      // Try to get English translation as fallback
      const englishTranslation = await this.getBlogPostTranslation(blogPostId, "en");
      if (englishTranslation) {
        return {
          ...blogPost[0],
          title: englishTranslation.title,
          excerpt: englishTranslation.excerpt,
          content: englishTranslation.content,
          isTranslated: false,
          isFallback: true,
          language: "en",
        };
      }
    }

    // Return original content
    return {
      ...blogPost[0],
      isTranslated: false,
      isFallback: false,
      language: languageCode,
    };
  }

  // Project Translations
  async createProjectTranslation(
    translation: CreateProjectTranslation
  ): Promise<ProjectTranslation> {
    const result = await db
      .insert(projectTranslations)
      .values(translation)
      .returning();
    return result[0];
  }

  async updateProjectTranslation(
    projectId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateProjectTranslation>
  ): Promise<ProjectTranslation | null> {
    const result = await db
      .update(projectTranslations)
      .set({ ...translation, updatedAt: new Date() })
      .where(
        and(
          eq(projectTranslations.projectId, projectId),
          eq(projectTranslations.languageCode, languageCode)
        )
      )
      .returning();
    return result[0] || null;
  }

  async getProjectTranslation(
    projectId: string,
    languageCode: SupportedLanguage
  ): Promise<ProjectTranslation | null> {
    const result = await db
      .select()
      .from(projectTranslations)
      .where(
        and(
          eq(projectTranslations.projectId, projectId),
          eq(projectTranslations.languageCode, languageCode)
        )
      );
    return result[0] || null;
  }

  async getProjectWithTranslation(
    projectId: string,
    languageCode: SupportedLanguage,
    fallbackToDefault: boolean = true
  ): Promise<any> {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project[0]) return null;

    const translation = await this.getProjectTranslation(projectId, languageCode);

    if (translation) {
      return {
        ...project[0],
        title: translation.title,
        description: translation.description,
        longDescription: translation.longDescription,
        content: translation.content,
        isTranslated: true,
        language: languageCode,
      };
    }

    if (fallbackToDefault && languageCode !== "en") {
      const englishTranslation = await this.getProjectTranslation(projectId, "en");
      if (englishTranslation) {
        return {
          ...project[0],
          title: englishTranslation.title,
          description: englishTranslation.description,
          longDescription: englishTranslation.longDescription,
          content: englishTranslation.content,
          isTranslated: false,
          isFallback: true,
          language: "en",
        };
      }
    }

    return {
      ...project[0],
      isTranslated: false,
      isFallback: false,
      language: languageCode,
    };
  }

  // Experience Translations
  async createExperienceTranslation(
    translation: CreateExperienceTranslation
  ): Promise<ExperienceTranslation> {
    const result = await db
      .insert(experienceTranslations)
      .values({
        ...translation,
        achievements: JSON.stringify(translation.achievements),
      })
      .returning();
    return result[0];
  }

  async updateExperienceTranslation(
    experienceId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateExperienceTranslation>
  ): Promise<ExperienceTranslation | null> {
    const updateData: any = { ...translation, updatedAt: new Date() };
    if (translation.achievements) {
      updateData.achievements = JSON.stringify(translation.achievements);
    }

    const result = await db
      .update(experienceTranslations)
      .set(updateData)
      .where(
        and(
          eq(experienceTranslations.experienceId, experienceId),
          eq(experienceTranslations.languageCode, languageCode)
        )
      )
      .returning();
    return result[0] || null;
  }

  async getExperienceTranslation(
    experienceId: string,
    languageCode: SupportedLanguage
  ): Promise<ExperienceTranslation | null> {
    const result = await db
      .select()
      .from(experienceTranslations)
      .where(
        and(
          eq(experienceTranslations.experienceId, experienceId),
          eq(experienceTranslations.languageCode, languageCode)
        )
      );
    return result[0] || null;
  }

  async getExperienceWithTranslation(
    experienceId: string,
    languageCode: SupportedLanguage,
    fallbackToDefault: boolean = true
  ): Promise<any> {
    const experience = await db
      .select()
      .from(experiences)
      .where(eq(experiences.id, experienceId));

    if (!experience[0]) return null;

    const translation = await this.getExperienceTranslation(experienceId, languageCode);

    if (translation) {
      return {
        ...experience[0],
        title: translation.title,
        company: translation.company,
        period: translation.period,
        location: translation.location,
        description: translation.description,
        achievements: JSON.parse(translation.achievements),
        isTranslated: true,
        language: languageCode,
      };
    }

    if (fallbackToDefault && languageCode !== "en") {
      const englishTranslation = await this.getExperienceTranslation(experienceId, "en");
      if (englishTranslation) {
        return {
          ...experience[0],
          title: englishTranslation.title,
          company: englishTranslation.company,
          period: englishTranslation.period,
          location: englishTranslation.location,
          description: englishTranslation.description,
          achievements: JSON.parse(englishTranslation.achievements),
          isTranslated: false,
          isFallback: true,
          language: "en",
        };
      }
    }

    return {
      ...experience[0],
      isTranslated: false,
      isFallback: false,
      language: languageCode,
    };
  }

  // Education Translations
  async createEducationTranslation(
    translation: CreateEducationTranslation
  ): Promise<EducationTranslation> {
    const result = await db
      .insert(educationTranslations)
      .values(translation)
      .returning();
    return result[0];
  }

  async updateEducationTranslation(
    educationId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateEducationTranslation>
  ): Promise<EducationTranslation | null> {
    const result = await db
      .update(educationTranslations)
      .set({ ...translation, updatedAt: new Date() })
      .where(
        and(
          eq(educationTranslations.educationId, educationId),
          eq(educationTranslations.languageCode, languageCode)
        )
      )
      .returning();
    return result[0] || null;
  }

  async getEducationTranslation(
    educationId: string,
    languageCode: SupportedLanguage
  ): Promise<EducationTranslation | null> {
    const result = await db
      .select()
      .from(educationTranslations)
      .where(
        and(
          eq(educationTranslations.educationId, educationId),
          eq(educationTranslations.languageCode, languageCode)
        )
      );
    return result[0] || null;
  }

  // Testimonial Translations
  async createTestimonialTranslation(
    translation: CreateTestimonialTranslation
  ): Promise<TestimonialTranslation> {
    const result = await db
      .insert(testimonialTranslations)
      .values(translation)
      .returning();
    return result[0];
  }

  async updateTestimonialTranslation(
    testimonialId: string,
    languageCode: SupportedLanguage,
    translation: Partial<CreateTestimonialTranslation>
  ): Promise<TestimonialTranslation | null> {
    const result = await db
      .update(testimonialTranslations)
      .set({ ...translation, updatedAt: new Date() })
      .where(
        and(
          eq(testimonialTranslations.testimonialId, testimonialId),
          eq(testimonialTranslations.languageCode, languageCode)
        )
      )
      .returning();
    return result[0] || null;
  }

  async getTestimonialTranslation(
    testimonialId: string,
    languageCode: SupportedLanguage
  ): Promise<TestimonialTranslation | null> {
    const result = await db
      .select()
      .from(testimonialTranslations)
      .where(
        and(
          eq(testimonialTranslations.testimonialId, testimonialId),
          eq(testimonialTranslations.languageCode, languageCode)
        )
      );
    return result[0] || null;
  }

  // Translation Status and Statistics
  async getTranslationStatus(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string
  ): Promise<TranslationStatus[]> {
    const supportedLanguages: SupportedLanguage[] = ["en", "es", "pt", "it", "fr", "ja", "zh", "ko"];
    const statuses: TranslationStatus[] = [];

    for (const lang of supportedLanguages) {
      let translation: any = null;
      let missingFields: string[] = [];

      switch (contentType) {
        case "blog":
          translation = await this.getBlogPostTranslation(contentId, lang);
          if (translation) {
            if (!translation.title) missingFields.push("title");
            if (!translation.excerpt) missingFields.push("excerpt");
            if (!translation.content) missingFields.push("content");
          } else {
            missingFields = ["title", "excerpt", "content"];
          }
          break;
        case "project":
          translation = await this.getProjectTranslation(contentId, lang);
          if (translation) {
            if (!translation.title) missingFields.push("title");
            if (!translation.description) missingFields.push("description");
            if (!translation.longDescription) missingFields.push("longDescription");
            if (!translation.content) missingFields.push("content");
          } else {
            missingFields = ["title", "description", "longDescription", "content"];
          }
          break;
        case "experience":
          translation = await this.getExperienceTranslation(contentId, lang);
          if (translation) {
            if (!translation.title) missingFields.push("title");
            if (!translation.company) missingFields.push("company");
            if (!translation.period) missingFields.push("period");
            if (!translation.location) missingFields.push("location");
            if (!translation.description) missingFields.push("description");
            if (!translation.achievements) missingFields.push("achievements");
          } else {
            missingFields = ["title", "company", "period", "location", "description", "achievements"];
          }
          break;
        case "education":
          translation = await this.getEducationTranslation(contentId, lang);
          if (translation) {
            if (!translation.degree) missingFields.push("degree");
            if (!translation.school) missingFields.push("school");
            if (!translation.year) missingFields.push("year");
            if (!translation.description) missingFields.push("description");
          } else {
            missingFields = ["degree", "school", "year", "description"];
          }
          break;
        case "testimonial":
          translation = await this.getTestimonialTranslation(contentId, lang);
          if (translation) {
            if (!translation.name) missingFields.push("name");
            if (!translation.role) missingFields.push("role");
            if (!translation.company) missingFields.push("company");
            if (!translation.content) missingFields.push("content");
          } else {
            missingFields = ["name", "role", "company", "content"];
          }
          break;
      }

      statuses.push({
        languageCode: lang,
        isComplete: missingFields.length === 0,
        isPublished: translation !== null,
        lastUpdated: translation?.updatedAt,
        missingFields,
      });
    }

    return statuses;
  }

  async getTranslationStats(): Promise<TranslationStats> {
    const supportedLanguages: SupportedLanguage[] = ["en", "es", "pt", "it", "fr", "ja", "zh", "ko"];
    
    // Get total counts for each content type
    const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const [experienceCount] = await db.select({ count: sql<number>`count(*)` }).from(experiences);
    const [educationCount] = await db.select({ count: sql<number>`count(*)` }).from(education);
    const [testimonialCount] = await db.select({ count: sql<number>`count(*)` }).from(testimonials);

    const totalContent = blogCount.count + projectCount.count + experienceCount.count + educationCount.count + testimonialCount.count;

    const translatedContent: Record<SupportedLanguage, number> = {
      en: 0, es: 0, pt: 0, it: 0, fr: 0, ja: 0, zh: 0, ko: 0
    };

    const completionPercentage: Record<SupportedLanguage, number> = {
      en: 0, es: 0, pt: 0, it: 0, fr: 0, ja: 0, zh: 0, ko: 0
    };

    const missingTranslations: Record<SupportedLanguage, string[]> = {
      en: [], es: [], pt: [], it: [], fr: [], ja: [], zh: [], ko: []
    };

    // Calculate translation statistics for each language
    for (const lang of supportedLanguages) {
      const [blogTransCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogPostTranslations)
        .where(eq(blogPostTranslations.languageCode, lang));

      const [projectTransCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(projectTranslations)
        .where(eq(projectTranslations.languageCode, lang));

      const [experienceTransCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(experienceTranslations)
        .where(eq(experienceTranslations.languageCode, lang));

      const [educationTransCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(educationTranslations)
        .where(eq(educationTranslations.languageCode, lang));

      const [testimonialTransCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(testimonialTranslations)
        .where(eq(testimonialTranslations.languageCode, lang));

      const totalTranslated = blogTransCount.count + projectTransCount.count + 
                            experienceTransCount.count + educationTransCount.count + 
                            testimonialTransCount.count;

      translatedContent[lang] = totalTranslated;
      completionPercentage[lang] = totalContent > 0 ? (totalTranslated / totalContent) * 100 : 0;
    }

    return {
      totalContent,
      translatedContent,
      completionPercentage,
      missingTranslations,
    };
  }

  // Bulk operations
  async deleteTranslations(
    contentType: "blog" | "project" | "experience" | "education" | "testimonial",
    contentId: string
  ): Promise<void> {
    switch (contentType) {
      case "blog":
        await db.delete(blogPostTranslations).where(eq(blogPostTranslations.blogPostId, contentId));
        break;
      case "project":
        await db.delete(projectTranslations).where(eq(projectTranslations.projectId, contentId));
        break;
      case "experience":
        await db.delete(experienceTranslations).where(eq(experienceTranslations.experienceId, contentId));
        break;
      case "education":
        await db.delete(educationTranslations).where(eq(educationTranslations.educationId, contentId));
        break;
      case "testimonial":
        await db.delete(testimonialTranslations).where(eq(testimonialTranslations.testimonialId, contentId));
        break;
    }
  }
}
