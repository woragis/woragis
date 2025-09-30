import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../../db";
import { ideas } from "../../db/schemas/money";
import type {
  Idea,
  NewIdea,
  IdeaOrderUpdate,
  IdeaFilters,
} from "@/types/money";

export class IdeasRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Idea[]> {
    let query = db.select().from(ideas) as any;
    if (userId) {
      query = query.where(eq(ideas.userId, userId)) as any;
    }
    return await query.orderBy(desc(ideas.createdAt));
  }

  async findVisible(userId?: string): Promise<Idea[]> {
    const conditions = [eq(ideas.visible, true)];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }
    return await db
      .select()
      .from(ideas)
      .where(and(...conditions))
      .orderBy(desc(ideas.createdAt));
  }

  async findPublic(): Promise<Idea[]> {
    return await db
      .select()
      .from(ideas)
      .where(
        and(
          eq(ideas.visible, true),
          eq(ideas.public, true)
        )
      )
      .orderBy(desc(ideas.createdAt));
  }

  async findFeatured(limit: number = 3, userId?: string): Promise<Idea[]> {
    const conditions = [eq(ideas.featured, true)];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }
    return await db
      .select()
      .from(ideas)
      .where(and(...conditions))
      .orderBy(desc(ideas.createdAt))
      .limit(limit);
  }

  async findById(id: string, userId?: string): Promise<Idea | null> {
    const conditions = [eq(ideas.id, id)];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }
    const result = await db
      .select()
      .from(ideas)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findBySlug(slug: string, userId?: string): Promise<Idea | null> {
    const conditions = [eq(ideas.slug, slug)];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }
    const result = await db
      .select()
      .from(ideas)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(idea: NewIdea): Promise<Idea> {
    const result = await db.insert(ideas).values(idea).returning();
    return result[0];
  }

  async update(
    id: string,
    idea: Partial<NewIdea>,
    userId?: string
  ): Promise<Idea | null> {
    const conditions = [eq(ideas.id, id)];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }
    const result = await db
      .update(ideas)
      .set({ ...idea, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(ideas.id, id)];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }
    await db.delete(ideas).where(and(...conditions));
  }

  // Advanced operations
  async updateOrder(
    ideaOrders: IdeaOrderUpdate[],
    userId?: string
  ): Promise<void> {
    const promises = ideaOrders.map(({ id, order }) => {
      const conditions = [eq(ideas.id, id)];
      if (userId) {
        conditions.push(eq(ideas.userId, userId));
      }
      return db
        .update(ideas)
        .set({ order, updatedAt: new Date() })
        .where(and(...conditions));
    });
    await Promise.all(promises);
  }

  async toggleVisibility(id: string, userId?: string): Promise<Idea | null> {
    const idea = await this.findById(id, userId);
    if (!idea) return null;

    return await this.update(id, { visible: !idea.visible }, userId);
  }

  async toggleFeatured(id: string, userId?: string): Promise<Idea | null> {
    const idea = await this.findById(id, userId);
    if (!idea) return null;

    return await this.update(id, { featured: !idea.featured }, userId);
  }

  async search(filters: IdeaFilters, userId?: string): Promise<Idea[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(ideas.featured, filters.featured));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(ideas.visible, filters.visible));
    }

    if (filters.public !== undefined) {
      conditions.push(eq(ideas.public, filters.public));
    }

    if (filters.search) {
      conditions.push(
        like(ideas.title, `%${filters.search}%`)
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Apply sorting
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";

    let orderByClause;
    if (sortBy === "title") {
      orderByClause = sortOrder === "asc" ? asc(ideas.title) : desc(ideas.title);
    } else if (sortBy === "order") {
      orderByClause = sortOrder === "asc" ? asc(ideas.order) : desc(ideas.order);
    } else if (sortBy === "updatedAt") {
      orderByClause = sortOrder === "asc" ? asc(ideas.updatedAt) : desc(ideas.updatedAt);
    } else {
      orderByClause = sortOrder === "asc" ? asc(ideas.createdAt) : desc(ideas.createdAt);
    }

    let query = db.select().from(ideas) as any;

    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    query = query.orderBy(orderByClause) as any;

    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  }

  // Statistics
  async getTotalCount(userId?: string): Promise<number> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(ideas.userId, userId));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(ideas)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
  }
}
