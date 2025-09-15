import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { aboutCore, experiences } from "../../db/schemas";
import type { AboutCore, NewAboutCore, AboutCoreFilters } from "@/types";

export class AboutCoreRepository {
  // Basic CRUD operations
  async findById(id: string, userId?: string): Promise<AboutCore | null> {
    const conditions = [eq(aboutCore.id, id)];
    if (userId) {
      conditions.push(eq(aboutCore.userId, userId));
    }
    const result = await db
      .select()
      .from(aboutCore)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<AboutCore | null> {
    const result = await db
      .select()
      .from(aboutCore)
      .where(eq(aboutCore.userId, userId));
    return result[0] || null;
  }

  async findWithProfession(userId: string): Promise<{
    about: AboutCore;
    currentProfession: any;
  } | null> {
    const result = await db
      .select({
        about: aboutCore,
        currentProfession: experiences,
      })
      .from(aboutCore)
      .leftJoin(experiences, eq(aboutCore.currentProfessionId, experiences.id))
      .where(eq(aboutCore.userId, userId));

    if (result.length === 0) return null;

    return {
      about: result[0].about,
      currentProfession: result[0].currentProfession,
    };
  }

  async create(about: NewAboutCore): Promise<AboutCore> {
    const result = await db.insert(aboutCore).values(about).returning();
    return result[0];
  }

  async update(
    id: string,
    about: Partial<NewAboutCore>,
    userId?: string
  ): Promise<AboutCore | null> {
    const conditions = [eq(aboutCore.id, id)];
    if (userId) {
      conditions.push(eq(aboutCore.userId, userId));
    }
    const result = await db
      .update(aboutCore)
      .set({ ...about, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(aboutCore.id, id)];
    if (userId) {
      conditions.push(eq(aboutCore.userId, userId));
    }
    await db.delete(aboutCore).where(and(...conditions));
  }

  // Search and filtering
  async search(
    filters: AboutCoreFilters,
    userId?: string
  ): Promise<AboutCore[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(aboutCore.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(aboutCore.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(like(aboutCore.name, `%${filters.search}%`));
    }

    let query = db.select().from(aboutCore);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(aboutCore.name));
  }
}
