import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../../db";
import { aiChats } from "../../db/schemas/money";
import type { ChatMessage } from "../../db/schemas/money/ai-chats";
import type {
  AiChat,
  NewAiChat,
  AiChatFilters,
} from "@/types/money";

export class AiChatsRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<AiChat[]> {
    let query = db.select().from(aiChats) as any;
    if (userId) {
      query = query.where(eq(aiChats.userId, userId)) as any;
    }
    return await query.orderBy(desc(aiChats.createdAt));
  }

  async findByIdeaNode(ideaNodeId: string, userId?: string): Promise<AiChat[]> {
    const conditions = [eq(aiChats.ideaNodeId, ideaNodeId)];
    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }
    return await db
      .select()
      .from(aiChats)
      .where(and(...conditions))
      .orderBy(desc(aiChats.createdAt));
  }

  async findVisible(userId?: string): Promise<AiChat[]> {
    const conditions = [eq(aiChats.visible, true)];
    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }
    return await db
      .select()
      .from(aiChats)
      .where(and(...conditions))
      .orderBy(desc(aiChats.createdAt));
  }

  async findById(id: string, userId?: string): Promise<AiChat | null> {
    const conditions = [eq(aiChats.id, id)];
    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }
    const result = await db
      .select()
      .from(aiChats)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(chat: NewAiChat): Promise<AiChat> {
    const result = await db.insert(aiChats).values(chat).returning();
    return result[0];
  }

  async update(
    id: string,
    chat: Partial<NewAiChat>,
    userId?: string
  ): Promise<AiChat | null> {
    const conditions = [eq(aiChats.id, id)];
    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }
    const result = await db
      .update(aiChats)
      .set({ ...chat, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(aiChats.id, id)];
    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }
    await db.delete(aiChats).where(and(...conditions));
  }

  // Message operations
  async addMessage(
    id: string,
    message: ChatMessage,
    userId?: string
  ): Promise<AiChat | null> {
    const chat = await this.findById(id, userId);
    if (!chat) return null;

    const messages = [...chat.messages, message];
    return await this.update(id, { messages }, userId);
  }

  async addMessages(
    id: string,
    newMessages: ChatMessage[],
    userId?: string
  ): Promise<AiChat | null> {
    const chat = await this.findById(id, userId);
    if (!chat) return null;

    const messages = [...chat.messages, ...newMessages];
    return await this.update(id, { messages }, userId);
  }

  async clearMessages(id: string, userId?: string): Promise<AiChat | null> {
    return await this.update(id, { messages: [] }, userId);
  }

  // Advanced operations
  async toggleVisibility(id: string, userId?: string): Promise<AiChat | null> {
    const chat = await this.findById(id, userId);
    if (!chat) return null;

    return await this.update(id, { visible: !chat.visible }, userId);
  }

  async toggleArchived(id: string, userId?: string): Promise<AiChat | null> {
    const chat = await this.findById(id, userId);
    if (!chat) return null;

    return await this.update(id, { archived: !chat.archived }, userId);
  }

  async search(filters: AiChatFilters, userId?: string): Promise<AiChat[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }

    if (filters.ideaNodeId) {
      conditions.push(eq(aiChats.ideaNodeId, filters.ideaNodeId));
    }

    if (filters.agent) {
      conditions.push(eq(aiChats.agent, filters.agent));
    }

    if (filters.archived !== undefined) {
      conditions.push(eq(aiChats.archived, filters.archived));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(aiChats.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(like(aiChats.title, `%${filters.search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Apply sorting
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";

    let orderByClause;
    if (sortBy === "title") {
      orderByClause = sortOrder === "asc" ? asc(aiChats.title) : desc(aiChats.title);
    } else if (sortBy === "updatedAt") {
      orderByClause = sortOrder === "asc" ? asc(aiChats.updatedAt) : desc(aiChats.updatedAt);
    } else {
      orderByClause = sortOrder === "asc" ? asc(aiChats.createdAt) : desc(aiChats.createdAt);
    }

    let query = db.select().from(aiChats) as any;

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
      conditions.push(eq(aiChats.userId, userId));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChats)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
  }

  async getCountByIdeaNode(ideaNodeId: string, userId?: string): Promise<number> {
    const conditions = [eq(aiChats.ideaNodeId, ideaNodeId)];
    if (userId) {
      conditions.push(eq(aiChats.userId, userId));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChats)
      .where(and(...conditions));

    return result[0]?.count || 0;
  }
}
