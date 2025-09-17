import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import {
  biography,
  type Biography,
  type NewBiography,
} from "../../db/schemas/about/biography";

export class BiographyRepository {
  async create(biographyData: NewBiography): Promise<Biography> {
    const result = await db.insert(biography).values(biographyData).returning();
    return result[0];
  }

  async findById(id: string): Promise<Biography | null> {
    const result = await db
      .select()
      .from(biography)
      .where(eq(biography.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<Biography | null> {
    const result = await db
      .select()
      .from(biography)
      .where(eq(biography.userId, userId))
      .limit(1);
    return result[0] || null;
  }

  async findFirstVisible(): Promise<Biography | null> {
    const result = await db
      .select()
      .from(biography)
      .where(eq(biography.visible, true))
      .limit(1);
    return result[0] || null;
  }

  async update(
    id: string,
    biographyData: Partial<NewBiography>
  ): Promise<Biography | null> {
    const { updatedAt, ...dataWithoutUpdatedAt } = biographyData;
    const result = await db
      .update(biography)
      .set({ ...dataWithoutUpdatedAt, updatedAt: new Date() })
      .where(eq(biography.id, id))
      .returning();
    return result[0] || null;
  }

  async updateByUserId(
    userId: string,
    biographyData: Partial<NewBiography>
  ): Promise<Biography | null> {
    const { updatedAt, ...dataWithoutUpdatedAt } = biographyData;
    const result = await db
      .update(biography)
      .set({ ...dataWithoutUpdatedAt, updatedAt: new Date() })
      .where(eq(biography.userId, userId))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(biography)
      .where(eq(biography.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await db
      .delete(biography)
      .where(eq(biography.userId, userId))
      .returning();
    return result.length > 0;
  }

  async findAll(): Promise<Biography[]> {
    const result = await db
      .select()
      .from(biography)
      .orderBy(biography.createdAt);
    return result;
  }

  async findVisible(): Promise<Biography[]> {
    const result = await db
      .select()
      .from(biography)
      .where(eq(biography.visible, true))
      .orderBy(biography.createdAt);
    return result;
  }
}
