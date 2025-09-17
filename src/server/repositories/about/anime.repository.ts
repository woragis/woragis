import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { animeList } from "../../db/schemas";
import type { Anime, NewAnime, AnimeFilters, AnimeStatus } from "@/types";

export class AnimeRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Anime[]> {
    const query = db.select().from(animeList) as any;
    if (userId) {
      query.where(eq(animeList.userId, userId));
    }
    return await query.orderBy(asc(animeList.order), asc(animeList.title));
  }

  async findVisible(userId?: string): Promise<Anime[]> {
    const conditions = [eq(animeList.visible, true)];
    if (userId) {
      conditions.push(eq(animeList.userId, userId));
    }
    return await db
      .select()
      .from(animeList)
      .where(and(...conditions))
      .orderBy(asc(animeList.order), asc(animeList.title));
  }

  async findByStatus(status: AnimeStatus, userId?: string): Promise<Anime[]> {
    const conditions = [eq(animeList.status, status)];
    if (userId) {
      conditions.push(eq(animeList.userId, userId));
    }
    return await db
      .select()
      .from(animeList)
      .where(and(...conditions))
      .orderBy(asc(animeList.order), asc(animeList.title));
  }

  async findById(id: string, userId?: string): Promise<Anime | null> {
    const conditions = [eq(animeList.id, id)];
    if (userId) {
      conditions.push(eq(animeList.userId, userId));
    }
    const result = await db
      .select()
      .from(animeList)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(anime: NewAnime): Promise<Anime> {
    const result = await db.insert(animeList).values(anime).returning();
    return result[0];
  }

  async update(
    id: string,
    anime: Partial<NewAnime>,
    userId?: string
  ): Promise<Anime | null> {
    const conditions = [eq(animeList.id, id)];
    if (userId) {
      conditions.push(eq(animeList.userId, userId));
    }
    const result = await db
      .update(animeList)
      .set({ ...anime, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(animeList.id, id)];
    if (userId) {
      conditions.push(eq(animeList.userId, userId));
    }
    await db.delete(animeList).where(and(...conditions));
  }

  // Search and filtering
  async search(filters: AnimeFilters, userId?: string): Promise<Anime[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(animeList.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(animeList.visible, filters.visible));
    }

    if (filters.status) {
      conditions.push(eq(animeList.status, filters.status));
    }

    if (filters.search) {
      conditions.push(like(animeList.title, `%${filters.search}%`));
    }

    let query = db.select().from(animeList) as any;

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(animeList.order), asc(animeList.title));
  }
}
