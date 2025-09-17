import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import {
  martialArts,
  type MartialArt,
  type NewMartialArt,
} from "../../db/schemas/about/martial-arts";

export class MartialArtsRepository {
  async create(martialArtData: NewMartialArt): Promise<MartialArt> {
    const result = await db
      .insert(martialArts)
      .values(martialArtData)
      .returning();
    return result[0];
  }

  async findById(id: string): Promise<MartialArt | null> {
    const result = await db
      .select()
      .from(martialArts)
      .where(eq(martialArts.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<MartialArt[]> {
    const result = await db
      .select()
      .from(martialArts)
      .where(eq(martialArts.userId, userId))
      .orderBy(desc(martialArts.createdAt));
    return result;
  }

  async findVisibleByUserId(userId: string): Promise<MartialArt[]> {
    const result = await db
      .select()
      .from(martialArts)
      .where(and(eq(martialArts.userId, userId), eq(martialArts.visible, true)))
      .orderBy(desc(martialArts.createdAt));
    return result;
  }

  async update(
    id: string,
    martialArtData: Partial<NewMartialArt>
  ): Promise<MartialArt | null> {
    const { updatedAt, ...dataWithoutUpdatedAt } = martialArtData;
    const result = await db
      .update(martialArts)
      .set({ ...dataWithoutUpdatedAt, updatedAt: new Date() })
      .where(eq(martialArts.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(martialArts)
      .where(eq(martialArts.id, id))
      .returning();
    return result.length > 0;
  }

  async findAll(): Promise<MartialArt[]> {
    const result = await db
      .select()
      .from(martialArts)
      .orderBy(desc(martialArts.createdAt));
    return result;
  }

  async findVisible(): Promise<MartialArt[]> {
    const result = await db
      .select()
      .from(martialArts)
      .where(eq(martialArts.visible, true))
      .orderBy(desc(martialArts.createdAt));
    return result;
  }
}
