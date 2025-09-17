import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import {
  languages,
  type Language,
  type NewLanguage,
} from "../../db/schemas/about/languages";

export class LanguagesRepository {
  async create(languageData: NewLanguage): Promise<Language> {
    const result = await db.insert(languages).values(languageData).returning();
    return result[0];
  }

  async findById(id: string): Promise<Language | null> {
    const result = await db
      .select()
      .from(languages)
      .where(eq(languages.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<Language[]> {
    const result = await db
      .select()
      .from(languages)
      .where(eq(languages.userId, userId))
      .orderBy(desc(languages.createdAt));
    return result;
  }

  async findVisibleByUserId(userId: string): Promise<Language[]> {
    const result = await db
      .select()
      .from(languages)
      .where(and(eq(languages.userId, userId), eq(languages.visible, true)))
      .orderBy(desc(languages.createdAt));
    return result;
  }

  async update(
    id: string,
    languageData: Partial<NewLanguage>
  ): Promise<Language | null> {
    const result = await db
      .update(languages)
      .set({ ...languageData, updatedAt: new Date() })
      .where(eq(languages.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(languages)
      .where(eq(languages.id, id))
      .returning();
    return result.length > 0;
  }

  async findAll(): Promise<Language[]> {
    const result = await db
      .select()
      .from(languages)
      .orderBy(desc(languages.createdAt));
    return result;
  }

  async findVisible(): Promise<Language[]> {
    const result = await db
      .select()
      .from(languages)
      .where(eq(languages.visible, true))
      .orderBy(desc(languages.createdAt));
    return result;
  }
}
