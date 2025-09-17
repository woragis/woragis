import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { musicGenres, lastListenedSongs } from "../../db/schemas";
import type {
  MusicGenre,
  NewMusicGenre,
  MusicGenreFilters,
  LastListenedSong,
  NewLastListenedSong,
  LastListenedSongFilters,
} from "@/types";

export class MusicGenreRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<MusicGenre[]> {
    const query = db.select().from(musicGenres) as any;
    if (userId) {
      query.where(eq(musicGenres.userId, userId));
    }
    return await query.orderBy(asc(musicGenres.order), asc(musicGenres.name));
  }

  async findVisible(userId?: string): Promise<MusicGenre[]> {
    const conditions = [eq(musicGenres.visible, true)];
    if (userId) {
      conditions.push(eq(musicGenres.userId, userId));
    }
    return await db
      .select()
      .from(musicGenres)
      .where(and(...conditions))
      .orderBy(asc(musicGenres.order), asc(musicGenres.name));
  }

  async findById(id: string, userId?: string): Promise<MusicGenre | null> {
    const conditions = [eq(musicGenres.id, id)];
    if (userId) {
      conditions.push(eq(musicGenres.userId, userId));
    }
    const result = await db
      .select()
      .from(musicGenres)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(genre: NewMusicGenre): Promise<MusicGenre> {
    const result = await db.insert(musicGenres).values(genre).returning();
    return result[0];
  }

  async update(
    id: string,
    genre: Partial<NewMusicGenre>,
    userId?: string
  ): Promise<MusicGenre | null> {
    const conditions = [eq(musicGenres.id, id)];
    if (userId) {
      conditions.push(eq(musicGenres.userId, userId));
    }
    const result = await db
      .update(musicGenres)
      .set({ ...genre, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(musicGenres.id, id)];
    if (userId) {
      conditions.push(eq(musicGenres.userId, userId));
    }
    await db.delete(musicGenres).where(and(...conditions));
  }

  // Search and filtering
  async search(
    filters: MusicGenreFilters,
    userId?: string
  ): Promise<MusicGenre[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(musicGenres.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(musicGenres.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(like(musicGenres.name, `%${filters.search}%`));
    }

    let query = db.select().from(musicGenres) as any;

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(musicGenres.order), asc(musicGenres.name));
  }
}

export class LastListenedSongRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<LastListenedSong[]> {
    const query = db.select().from(lastListenedSongs) as any;
    if (userId) {
      query.where(eq(lastListenedSongs.userId, userId));
    }
    return await query.orderBy(
      desc(lastListenedSongs.listenedAt),
      asc(lastListenedSongs.order)
    );
  }

  async findVisible(userId?: string): Promise<LastListenedSong[]> {
    const conditions = [eq(lastListenedSongs.visible, true)];
    if (userId) {
      conditions.push(eq(lastListenedSongs.userId, userId));
    }
    return await db
      .select()
      .from(lastListenedSongs)
      .where(and(...conditions))
      .orderBy(
        desc(lastListenedSongs.listenedAt),
        asc(lastListenedSongs.order)
      );
  }

  async findById(
    id: string,
    userId?: string
  ): Promise<LastListenedSong | null> {
    const conditions = [eq(lastListenedSongs.id, id)];
    if (userId) {
      conditions.push(eq(lastListenedSongs.userId, userId));
    }
    const result = await db
      .select()
      .from(lastListenedSongs)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(song: NewLastListenedSong): Promise<LastListenedSong> {
    const result = await db.insert(lastListenedSongs).values(song).returning();
    return result[0];
  }

  async update(
    id: string,
    song: Partial<NewLastListenedSong>,
    userId?: string
  ): Promise<LastListenedSong | null> {
    const conditions = [eq(lastListenedSongs.id, id)];
    if (userId) {
      conditions.push(eq(lastListenedSongs.userId, userId));
    }
    const result = await db
      .update(lastListenedSongs)
      .set({ ...song, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(lastListenedSongs.id, id)];
    if (userId) {
      conditions.push(eq(lastListenedSongs.userId, userId));
    }
    await db.delete(lastListenedSongs).where(and(...conditions));
  }

  // Search and filtering
  async search(
    filters: LastListenedSongFilters,
    userId?: string
  ): Promise<LastListenedSong[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(lastListenedSongs.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(lastListenedSongs.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(
        and(
          like(lastListenedSongs.title, `%${filters.search}%`),
          like(lastListenedSongs.artist, `%${filters.search}%`)
        )
      );
    }

    let query = db.select().from(lastListenedSongs) as any;

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(
      desc(lastListenedSongs.listenedAt),
      asc(lastListenedSongs.order)
    );
  }
}
