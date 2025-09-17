import { eq, and, desc, lt } from "drizzle-orm";
import { db } from "../db";
import { users, userSessions } from "../db/schemas";
import type {
  CreateUser,
  CreateUserSession,
  UpdateUser,
  UpdateUserSession,
  User,
  UserWithPassword,
  UserSession,
} from "../../types";

export class AuthRepository {
  // User operations
  async createUser(userData: CreateUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async getUserByIdWithPassword(id: string): Promise<UserWithPassword | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.passwordHash,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async getUserByEmailWithPassword(
    email: string
  ): Promise<UserWithPassword | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.passwordHash,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async updateUser(id: string, userData: UpdateUser): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result as any).rowCount > 0;
  }

  async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    const usersList = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
    
    return usersList.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    }));
  }

  async getUsersCount(): Promise<number> {
    const result = await db.select({ count: users.id }).from(users);
    return result.length;
  }

  async getFirstUser(): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .orderBy(users.createdAt)
      .limit(1);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin" | "super_admin",
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatar: user.avatar ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async isFirstUser(userId: string): Promise<boolean> {
    const firstUser = await this.getFirstUser();
    return firstUser?.id === userId;
  }

  // User session operations
  async createSession(sessionData: CreateUserSession): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values(sessionData)
      .returning();
    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      isActive: session.isActive ?? true,
      createdAt: session.createdAt ?? new Date(),
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
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
    if (!session) return null;
    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      isActive: session.isActive ?? true,
      createdAt: session.createdAt ?? new Date(),
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async getSessionById(id: string): Promise<UserSession | null> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, id));
    if (!session) return null;
    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      isActive: session.isActive ?? true,
      createdAt: session.createdAt ?? new Date(),
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    const sessions = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.createdAt));
    
    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      isActive: session.isActive ?? true,
      createdAt: session.createdAt ?? new Date(),
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    }));
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
    if (!session) return null;
    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      isActive: session.isActive ?? true,
      createdAt: session.createdAt ?? new Date(),
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async deactivateSession(id: string): Promise<boolean> {
    const result = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.id, id));
    return (result as any).rowCount > 0;
  }

  async deactivateAllUserSessions(userId: string): Promise<boolean> {
    const result = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.userId, userId));
    return (result as any).rowCount > 0;
  }

  async deleteSession(id: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.id, id));
    return (result as any).rowCount > 0;
  }

  async deleteExpiredSessions(): Promise<number> {
    const result = await db
      .delete(userSessions)
      .where(lt(userSessions.expiresAt, new Date()));
    return (result as any).rowCount;
  }

  async deleteAllUserSessions(userId: string): Promise<number> {
    const result = await db
      .delete(userSessions)
      .where(eq(userSessions.userId, userId));
    return (result as any).rowCount;
  }

  // Utility methods
  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const conditions = [eq(users.email, email)];
    
    if (excludeUserId) {
      // Exclude the user with the given ID from the check
      conditions.push(eq(users.id, excludeUserId));
    }

    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(and(...conditions));

    return result.length > 0;
  }

  async isUsernameTaken(
    username: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const conditions = [eq(users.username, username)];
    
    if (excludeUserId) {
      // Exclude the user with the given ID from the check
      conditions.push(eq(users.id, excludeUserId));
    }

    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(and(...conditions));

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
