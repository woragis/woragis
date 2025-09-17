import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import {
  instruments,
  type Instrument,
  type NewInstrument,
} from "../../db/schemas/about/instruments";

export class InstrumentsRepository {
  async create(instrumentData: NewInstrument): Promise<Instrument> {
    const result = await db
      .insert(instruments)
      .values(instrumentData)
      .returning();
    return result[0];
  }

  async findById(id: string): Promise<Instrument | null> {
    const result = await db
      .select()
      .from(instruments)
      .where(eq(instruments.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<Instrument[]> {
    const result = await db
      .select()
      .from(instruments)
      .where(eq(instruments.userId, userId))
      .orderBy(desc(instruments.createdAt));
    return result;
  }

  async findVisibleByUserId(userId: string): Promise<Instrument[]> {
    const result = await db
      .select()
      .from(instruments)
      .where(and(eq(instruments.userId, userId), eq(instruments.visible, true)))
      .orderBy(desc(instruments.createdAt));
    return result;
  }

  async update(
    id: string,
    instrumentData: Partial<NewInstrument>
  ): Promise<Instrument | null> {
    const result = await db
      .update(instruments)
      .set({ ...instrumentData, updatedAt: new Date() })
      .where(eq(instruments.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(instruments)
      .where(eq(instruments.id, id))
      .returning();
    return result.length > 0;
  }

  async findAll(): Promise<Instrument[]> {
    const result = await db
      .select()
      .from(instruments)
      .orderBy(desc(instruments.createdAt));
    return result;
  }

  async findVisible(): Promise<Instrument[]> {
    const result = await db
      .select()
      .from(instruments)
      .where(eq(instruments.visible, true))
      .orderBy(desc(instruments.createdAt));
    return result;
  }
}
