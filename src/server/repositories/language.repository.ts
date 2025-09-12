import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { languages, projectLanguages } from "../db/schemas";
import type {
  Language,
  NewLanguage,
  LanguageFilters,
  ProficiencyLevel,
} from "@/types";

export class LanguageRepository {
  // Basic CRUD operations
  async findAll(): Promise<Language[]> {
    return await db
      .select()
      .from(languages)
      .orderBy(asc(languages.order), asc(languages.name));
  }

  async findVisible(): Promise<Language[]> {
    return await db
      .select()
      .from(languages)
      .where(eq(languages.visible, true))
      .orderBy(asc(languages.order), asc(languages.name));
  }

  async findById(id: string): Promise<Language | null> {
    const result = await db
      .select()
      .from(languages)
      .where(eq(languages.id, id));
    return result[0] || null;
  }

  async findBySlug(slug: string): Promise<Language | null> {
    const result = await db
      .select()
      .from(languages)
      .where(eq(languages.slug, slug));
    return result[0] || null;
  }

  async create(language: NewLanguage): Promise<Language> {
    const result = await db.insert(languages).values(language).returning();
    return result[0];
  }

  async update(
    id: string,
    language: Partial<NewLanguage>
  ): Promise<Language | null> {
    const result = await db
      .update(languages)
      .set({ ...language, updatedAt: new Date() })
      .where(eq(languages.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(languages).where(eq(languages.id, id));
  }

  // Search and filtering
  async search(filters: LanguageFilters): Promise<Language[]> {
    let query = db.select().from(languages);

    if (filters.visible !== undefined) {
      query = query.where(eq(languages.visible, filters.visible));
    }

    if (filters.search) {
      query = query.where(like(languages.name, `%${filters.search}%`));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(languages.order), asc(languages.name));
  }

  // Project relations
  async getProjectCount(languageId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectLanguages)
      .where(eq(projectLanguages.languageId, languageId));

    return result[0]?.count || 0;
  }

  async findWithProjectCount(
    languageId: string
  ): Promise<{ language: Language; projectCount: number } | null> {
    const language = await this.findById(languageId);
    if (!language) return null;

    const projectCount = await this.getProjectCount(languageId);
    return { language, projectCount };
  }

  async findPopular(
    limit: number = 10
  ): Promise<Array<{ language: Language; projectCount: number }>> {
    const result = await db
      .select({
        language: languages,
        projectCount: sql<number>`count(${projectLanguages.id})`,
      })
      .from(languages)
      .leftJoin(projectLanguages, eq(languages.id, projectLanguages.languageId))
      .groupBy(languages.id)
      .orderBy(desc(sql`count(${projectLanguages.id})`))
      .limit(limit);

    return result.map(({ language, projectCount }) => ({
      language,
      projectCount,
    }));
  }

  // Proficiency analysis
  async getProficiencyDistribution(
    languageId: string
  ): Promise<Array<{ proficiency: string; count: number }>> {
    const result = await db
      .select({
        proficiency: projectLanguages.proficiency,
        count: sql<number>`count(*)`,
      })
      .from(projectLanguages)
      .where(eq(projectLanguages.languageId, languageId))
      .groupBy(projectLanguages.proficiency)
      .orderBy(desc(sql`count(*)`));

    return result.map(({ proficiency, count }) => ({
      proficiency: proficiency || "unknown",
      count,
    }));
  }

  // Ordering operations
  async updateOrder(
    languageOrders: { id: string; order: number }[]
  ): Promise<void> {
    const promises = languageOrders.map(({ id, order }) =>
      db
        .update(languages)
        .set({ order, updatedAt: new Date() })
        .where(eq(languages.id, id))
    );
    await Promise.all(promises);
  }
}
