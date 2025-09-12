import type { blogPosts } from "@/server/db/schemas/blog";

// Base types from schema
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

// Extended types for specific use cases
export interface BlogPostWithStats extends BlogPost {
  viewCount: number | null;
  likeCount: number | null;
  readingTime: number | null;
}

export interface BlogPostFilters {
  published?: boolean;
  featured?: boolean;
  visible?: boolean;
  public?: boolean;
  category?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "viewCount" | "title";
  sortOrder?: "asc" | "desc";
}

export interface BlogPostOrderUpdate {
  id: string;
  order: number;
}

// Form types for admin
export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  category?: string;
  readingTime?: number;
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  order: number;
  visible: boolean;
  public: boolean;
}

// API response types
export interface BlogPostListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BlogPostCreateRequest {
  blogPost: NewBlogPost;
}

export interface BlogPostUpdateRequest {
  id: string;
  blogPost: Partial<NewBlogPost>;
}

export interface BlogPostOrderUpdateRequest {
  blogPostOrders: BlogPostOrderUpdate[];
}

// Public blog post types (without sensitive fields)
export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  category?: string;
  readingTime?: number;
  featured: boolean;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog categories and tags
export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}

export interface BlogTag {
  name: string;
  count: number;
}
