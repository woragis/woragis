import { eq, and, desc, lt } from "drizzle-orm";
import { db } from "../db";
import { users, userSessions } from "../db/schemas";
import type {
  CreateUser,
  CreateUserSession,
  UpdateUser,
  UpdateUserSession,
  User,
  UserSession,
} from "../../types";

export class AuthRepository {
  // User operations
  async createUser(userData: CreateUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || null;
  }

  async updateUser(id: string, userData: UpdateUser): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getUsersCount(): Promise<number> {
    const result = await db.select({ count: users.id }).from(users);
    return result.length;
  }

  // User session operations
  async createSession(sessionData: CreateUserSession): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getSessionByTokenHash(tokenHash: string): Promise<UserSession | null> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.tokenHash, tokenHash),
          eq(userSessions.isActive, true)
        )
      );
    return session || null;
  }

  async getSessionById(id: string): Promise<UserSession | null> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, id));
    return session || null;
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.createdAt));
  }

  async updateSession(
    id: string,
    sessionData: UpdateUserSession
  ): Promise<UserSession | null> {
    const [session] = await db
      .update(userSessions)
      .set(sessionData)
      .where(eq(userSessions.id, id))
      .returning();
    return session || null;
  }

  async deactivateSession(id: string): Promise<boolean> {
    const result = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.id, id));
    return result.rowCount > 0;
  }

  async deactivateAllUserSessions(userId: string): Promise<boolean> {
    const result = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.userId, userId));
    return result.rowCount > 0;
  }

  async deleteSession(id: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.id, id));
    return result.rowCount > 0;
  }

  async deleteExpiredSessions(): Promise<number> {
    const result = await db
      .delete(userSessions)
      .where(lt(userSessions.expiresAt, new Date()));
    return result.rowCount;
  }

  async deleteAllUserSessions(userId: string): Promise<number> {
    const result = await db
      .delete(userSessions)
      .where(eq(userSessions.userId, userId));
    return result.rowCount;
  }

  // Utility methods
  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const query = db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (excludeUserId) {
      query.where(and(eq(users.email, email), eq(users.id, excludeUserId)));
    }

    const result = await query;
    return result.length > 0;
  }

  async isUsernameTaken(
    username: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const query = db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username));

    if (excludeUserId) {
      query.where(
        and(eq(users.username, username), eq(users.id, excludeUserId))
      );
    }

    const result = await query;
    return result.length > 0;
  }

  async getUserWithSessions(
    userId: string
  ): Promise<{ user: User; sessions: UserSession[] } | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const sessions = await this.getUserSessions(userId);
    return { user, sessions };
  }
}
