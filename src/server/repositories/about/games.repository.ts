import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { games } from "../../db/schemas";
import type { Game, NewGame, GameFilters, GameCategory } from "@/types";

export class GameRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Game[]> {
    const query = db.select().from(games);
    if (userId) {
      query.where(eq(games.userId, userId));
    }
    return await query.orderBy(asc(games.order), asc(games.title));
  }

  async findVisible(userId?: string): Promise<Game[]> {
    const conditions = [eq(games.visible, true)];
    if (userId) {
      conditions.push(eq(games.userId, userId));
    }
    return await db
      .select()
      .from(games)
      .where(and(...conditions))
      .orderBy(asc(games.order), asc(games.title));
  }

  async findByCategory(
    category: GameCategory,
    userId?: string
  ): Promise<Game[]> {
    const conditions = [eq(games.category, category)];
    if (userId) {
      conditions.push(eq(games.userId, userId));
    }
    return await db
      .select()
      .from(games)
      .where(and(...conditions))
      .orderBy(asc(games.order), asc(games.title));
  }

  async findById(id: string, userId?: string): Promise<Game | null> {
    const conditions = [eq(games.id, id)];
    if (userId) {
      conditions.push(eq(games.userId, userId));
    }
    const result = await db
      .select()
      .from(games)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(game: NewGame): Promise<Game> {
    const result = await db.insert(games).values(game).returning();
    return result[0];
  }

  async update(
    id: string,
    game: Partial<NewGame>,
    userId?: string
  ): Promise<Game | null> {
    const conditions = [eq(games.id, id)];
    if (userId) {
      conditions.push(eq(games.userId, userId));
    }
    const result = await db
      .update(games)
      .set({ ...game, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(games.id, id)];
    if (userId) {
      conditions.push(eq(games.userId, userId));
    }
    await db.delete(games).where(and(...conditions));
  }

  // Search and filtering
  async search(filters: GameFilters, userId?: string): Promise<Game[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(games.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(games.visible, filters.visible));
    }

    if (filters.category) {
      conditions.push(eq(games.category, filters.category));
    }

    if (filters.search) {
      conditions.push(like(games.title, `%${filters.search}%`));
    }

    let query = db.select().from(games);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(games.order), asc(games.title));
  }
}
