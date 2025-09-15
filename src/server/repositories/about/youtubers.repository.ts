import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { youtubers } from "../../db/schemas";
import type {
  Youtuber,
  NewYoutuber,
  YoutuberFilters,
  YoutuberCategory,
} from "@/types";

export class YoutuberRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Youtuber[]> {
    const query = db.select().from(youtubers);
    if (userId) {
      query.where(eq(youtubers.userId, userId));
    }
    return await query.orderBy(
      asc(youtubers.order),
      asc(youtubers.channelName)
    );
  }

  async findVisible(userId?: string): Promise<Youtuber[]> {
    const conditions = [eq(youtubers.visible, true)];
    if (userId) {
      conditions.push(eq(youtubers.userId, userId));
    }
    return await db
      .select()
      .from(youtubers)
      .where(and(...conditions))
      .orderBy(asc(youtubers.order), asc(youtubers.channelName));
  }

  async findByCategory(
    category: YoutuberCategory,
    userId?: string
  ): Promise<Youtuber[]> {
    const conditions = [eq(youtubers.category, category)];
    if (userId) {
      conditions.push(eq(youtubers.userId, userId));
    }
    return await db
      .select()
      .from(youtubers)
      .where(and(...conditions))
      .orderBy(asc(youtubers.order), asc(youtubers.channelName));
  }

  async findById(id: string, userId?: string): Promise<Youtuber | null> {
    const conditions = [eq(youtubers.id, id)];
    if (userId) {
      conditions.push(eq(youtubers.userId, userId));
    }
    const result = await db
      .select()
      .from(youtubers)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(youtuber: NewYoutuber): Promise<Youtuber> {
    const result = await db.insert(youtubers).values(youtuber).returning();
    return result[0];
  }

  async update(
    id: string,
    youtuber: Partial<NewYoutuber>,
    userId?: string
  ): Promise<Youtuber | null> {
    const conditions = [eq(youtubers.id, id)];
    if (userId) {
      conditions.push(eq(youtubers.userId, userId));
    }
    const result = await db
      .update(youtubers)
      .set({ ...youtuber, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(youtubers.id, id)];
    if (userId) {
      conditions.push(eq(youtubers.userId, userId));
    }
    await db.delete(youtubers).where(and(...conditions));
  }

  // Search and filtering
  async search(filters: YoutuberFilters, userId?: string): Promise<Youtuber[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(youtubers.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(youtubers.visible, filters.visible));
    }

    if (filters.category) {
      conditions.push(eq(youtubers.category, filters.category));
    }

    if (filters.search) {
      conditions.push(like(youtubers.channelName, `%${filters.search}%`));
    }

    let query = db.select().from(youtubers);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(
      asc(youtubers.order),
      asc(youtubers.channelName)
    );
  }
}
