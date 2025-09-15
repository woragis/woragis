import type {
  musicGenres,
  lastListenedSongs,
} from "@/server/db/schemas/about/music";

// Base types from schema
export type MusicGenre = typeof musicGenres.$inferSelect;
export type NewMusicGenre = typeof musicGenres.$inferInsert;
export type LastListenedSong = typeof lastListenedSongs.$inferSelect;
export type NewLastListenedSong = typeof lastListenedSongs.$inferInsert;

// Extended types
export interface MusicGenreFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface LastListenedSongFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface MusicGenreFormData {
  name: string;
  description?: string;
  order: number;
  visible: boolean;
}

export interface LastListenedSongFormData {
  title: string;
  artist: string;
  album?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  order: number;
  visible: boolean;
}

// API response types
export interface MusicGenreListResponse {
  genres: MusicGenre[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LastListenedSongListResponse {
  songs: LastListenedSong[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MusicGenreCreateRequest {
  genre: NewMusicGenre;
}

export interface MusicGenreUpdateRequest {
  id: string;
  genre: Partial<NewMusicGenre>;
}

export interface LastListenedSongCreateRequest {
  song: NewLastListenedSong;
}

export interface LastListenedSongUpdateRequest {
  id: string;
  song: Partial<NewLastListenedSong>;
}
