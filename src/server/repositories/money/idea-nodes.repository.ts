import { eq, and, sql } from "drizzle-orm";
import { db } from "../../db";
import { ideaNodes } from "../../db/schemas/money";
import type {
  IdeaNode,
  NewIdeaNode,
  IdeaNodeFilters,
  IdeaNodePositionUpdate,
  IdeaNodeConnectionUpdate,
} from "@/types/money";

export class IdeaNodesRepository {
  // Basic CRUD operations
  async findAll(ideaId: string): Promise<IdeaNode[]> {
    return await db
      .select()
      .from(ideaNodes)
      .where(eq(ideaNodes.ideaId, ideaId));
  }

  async findVisible(ideaId: string): Promise<IdeaNode[]> {
    return await db
      .select()
      .from(ideaNodes)
      .where(
        and(
          eq(ideaNodes.ideaId, ideaId),
          eq(ideaNodes.visible, true)
        )
      );
  }

  async findById(id: string, ideaId?: string): Promise<IdeaNode | null> {
    const conditions = [eq(ideaNodes.id, id)];
    if (ideaId) {
      conditions.push(eq(ideaNodes.ideaId, ideaId));
    }
    const result = await db
      .select()
      .from(ideaNodes)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(node: NewIdeaNode): Promise<IdeaNode> {
    const result = await db.insert(ideaNodes).values(node).returning();
    return result[0];
  }

  async update(
    id: string,
    node: Partial<NewIdeaNode>,
    ideaId?: string
  ): Promise<IdeaNode | null> {
    const conditions = [eq(ideaNodes.id, id)];
    if (ideaId) {
      conditions.push(eq(ideaNodes.ideaId, ideaId));
    }
    const result = await db
      .update(ideaNodes)
      .set({ ...node, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, ideaId?: string): Promise<void> {
    const conditions = [eq(ideaNodes.id, id)];
    if (ideaId) {
      conditions.push(eq(ideaNodes.ideaId, ideaId));
    }
    await db.delete(ideaNodes).where(and(...conditions));
  }

  // Canvas operations
  async updatePosition(
    id: string,
    position: Omit<IdeaNodePositionUpdate, "id">,
    ideaId?: string
  ): Promise<IdeaNode | null> {
    return await this.update(
      id,
      {
        positionX: position.positionX,
        positionY: position.positionY,
      },
      ideaId
    );
  }

  async updatePositions(
    positions: IdeaNodePositionUpdate[],
    ideaId?: string
  ): Promise<void> {
    const promises = positions.map(({ id, positionX, positionY }) => {
      const conditions = [eq(ideaNodes.id, id)];
      if (ideaId) {
        conditions.push(eq(ideaNodes.ideaId, ideaId));
      }
      return db
        .update(ideaNodes)
        .set({ positionX, positionY, updatedAt: new Date() })
        .where(and(...conditions));
    });
    await Promise.all(promises);
  }

  async updateConnections(
    id: string,
    connections: string[],
    ideaId?: string
  ): Promise<IdeaNode | null> {
    return await this.update(id, { connections }, ideaId);
  }

  async toggleVisibility(
    id: string,
    ideaId?: string
  ): Promise<IdeaNode | null> {
    const node = await this.findById(id, ideaId);
    if (!node) return null;

    return await this.update(id, { visible: !node.visible }, ideaId);
  }

  async search(filters: IdeaNodeFilters): Promise<IdeaNode[]> {
    const conditions = [];

    if (filters.ideaId) {
      conditions.push(eq(ideaNodes.ideaId, filters.ideaId));
    }

    if (filters.type) {
      conditions.push(eq(ideaNodes.type, filters.type));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(ideaNodes.visible, filters.visible));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db.select().from(ideaNodes) as any;

    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  }

  // Statistics
  async getCountByIdea(ideaId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(ideaNodes)
      .where(eq(ideaNodes.ideaId, ideaId));

    return result[0]?.count || 0;
  }
}
