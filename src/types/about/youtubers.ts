import type {
  youtubers,
  youtuberCategoryEnum,
} from "@/server/db/schemas/about/youtubers";

// Youtuber category enum
export type YoutuberCategory = (typeof youtuberCategoryEnum.enumValues)[number];

// Base types from schema
export type Youtuber = typeof youtubers.$inferSelect;
export type NewYoutuber = typeof youtubers.$inferInsert;

// Extended types
export interface YoutuberFilters {
  visible?: boolean;
  search?: string;
  category?: YoutuberCategory;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface YoutuberFormData {
  channelName: string;
  description?: string;
  category: YoutuberCategory;
  youtubeUrl?: string;
  profileImage?: string;
  subscriberCount?: string;
  contentType?: string;
  notes?: string;
  order: number;
  visible: boolean;
}

// API response types
export interface YoutuberListResponse {
  youtubers: Youtuber[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface YoutuberCreateRequest {
  youtuber: NewYoutuber;
}

export interface YoutuberUpdateRequest {
  id: string;
  youtuber: Partial<NewYoutuber>;
}
