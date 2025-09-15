import type { games, gameCategoryEnum } from "@/server/db/schemas/about/games";

// Game category enum
export type GameCategory = (typeof gameCategoryEnum.enumValues)[number];

// Base types from schema
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

// Extended types
export interface GameFilters {
  visible?: boolean;
  search?: string;
  category?: GameCategory;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface GameFormData {
  title: string;
  description?: string;
  category: GameCategory;
  platform?: string;
  genre?: string;
  coverImage?: string;
  steamUrl?: string;
  playtime?: number;
  rating?: number;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  plannedPlayAt?: Date;
  order: number;
  visible: boolean;
}

// API response types
export interface GameListResponse {
  games: Game[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GameCreateRequest {
  game: NewGame;
}

export interface GameUpdateRequest {
  id: string;
  game: Partial<NewGame>;
}

export interface GameStatusUpdateRequest {
  id: string;
  category: GameCategory;
  playtime?: number;
  completedAt?: Date;
  startedAt?: Date;
}
