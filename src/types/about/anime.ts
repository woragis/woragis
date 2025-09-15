import type {
  animeList,
  animeStatusEnum,
} from "@/server/db/schemas/about/anime";

// Anime status enum
export type AnimeStatus = (typeof animeStatusEnum.enumValues)[number];

// Base types from schema
export type Anime = typeof animeList.$inferSelect;
export type NewAnime = typeof animeList.$inferInsert;

// Extended types
export interface AnimeFilters {
  visible?: boolean;
  search?: string;
  status?: AnimeStatus;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface AnimeFormData {
  title: string;
  description?: string;
  status: AnimeStatus;
  myAnimeListId?: string;
  coverImage?: string;
  genres?: string[];
  episodes?: number;
  currentEpisode?: number;
  rating?: number;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  order: number;
  visible: boolean;
}

// API response types
export interface AnimeListResponse {
  anime: Anime[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AnimeCreateRequest {
  anime: NewAnime;
}

export interface AnimeUpdateRequest {
  id: string;
  anime: Partial<NewAnime>;
}

export interface AnimeStatusUpdateRequest {
  id: string;
  status: AnimeStatus;
  currentEpisode?: number;
  completedAt?: Date;
}
