import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { politicalViews } from "../../db/schemas";
import type {
  PoliticalView,
  NewPoliticalView,
  PoliticalViewFilters,
} from "@/types";

export class PoliticalViewRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<PoliticalView[]> {
    const query = db.select().from(politicalViews);
    if (userId) {
      query.where(eq(politicalViews.userId, userId));
    }
    return await query.orderBy(
      asc(politicalViews.order),
      asc(politicalViews.personName)
    );
  }

  async findVisible(userId?: string): Promise<PoliticalView[]> {
    const conditions = [eq(politicalViews.visible, true)];
    if (userId) {
      conditions.push(eq(politicalViews.userId, userId));
    }
    return await db
      .select()
      .from(politicalViews)
      .where(and(...conditions))
      .orderBy(asc(politicalViews.order), asc(politicalViews.personName));
  }

  async findById(id: string, userId?: string): Promise<PoliticalView | null> {
    const conditions = [eq(politicalViews.id, id)];
    if (userId) {
      conditions.push(eq(politicalViews.userId, userId));
    }
    const result = await db
      .select()
      .from(politicalViews)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(politicalView: NewPoliticalView): Promise<PoliticalView> {
    const result = await db
      .insert(politicalViews)
      .values(politicalView)
      .returning();
    return result[0];
  }

  async update(
    id: string,
    politicalView: Partial<NewPoliticalView>,
    userId?: string
  ): Promise<PoliticalView | null> {
    const conditions = [eq(politicalViews.id, id)];
    if (userId) {
      conditions.push(eq(politicalViews.userId, userId));
    }
    const result = await db
      .update(politicalViews)
      .set({ ...politicalView, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(politicalViews.id, id)];
    if (userId) {
      conditions.push(eq(politicalViews.userId, userId));
    }
    await db.delete(politicalViews).where(and(...conditions));
  }

  // Search and filtering
  async search(
    filters: PoliticalViewFilters,
    userId?: string
  ): Promise<PoliticalView[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(politicalViews.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(politicalViews.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(like(politicalViews.personName, `%${filters.search}%`));
    }

    let query = db.select().from(politicalViews);

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
      asc(politicalViews.order),
      asc(politicalViews.personName)
    );
  }
}
