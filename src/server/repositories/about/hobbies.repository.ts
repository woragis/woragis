import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import {
  hobbies,
  type Hobby,
  type NewHobby,
} from "../../db/schemas/about/hobbies";

export class HobbiesRepository {
  async create(hobbyData: NewHobby): Promise<Hobby> {
    const result = await db.insert(hobbies).values(hobbyData).returning();
    return result[0];
  }

  async findById(id: string): Promise<Hobby | null> {
    const result = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<Hobby[]> {
    const result = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.userId, userId))
      .orderBy(desc(hobbies.createdAt));
    return result;
  }

  async findVisibleByUserId(userId: string): Promise<Hobby[]> {
    const result = await db
      .select()
      .from(hobbies)
      .where(and(eq(hobbies.userId, userId), eq(hobbies.visible, true)))
      .orderBy(desc(hobbies.createdAt));
    return result;
  }

  async update(
    id: string,
    hobbyData: Partial<NewHobby>
  ): Promise<Hobby | null> {
    const result = await db
      .update(hobbies)
      .set({ ...hobbyData, updatedAt: new Date() })
      .where(eq(hobbies.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(hobbies)
      .where(eq(hobbies.id, id))
      .returning();
    return result.length > 0;
  }

  async findAll(): Promise<Hobby[]> {
    const result = await db
      .select()
      .from(hobbies)
      .orderBy(desc(hobbies.createdAt));
    return result;
  }

  async findVisible(): Promise<Hobby[]> {
    const result = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.visible, true))
      .orderBy(desc(hobbies.createdAt));
    return result;
  }
}
