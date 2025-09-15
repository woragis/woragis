import type { bookList, bookStatusEnum } from "@/server/db/schemas/about/books";

// Book status enum
export type BookStatus = (typeof bookStatusEnum.enumValues)[number];

// Base types from schema
export type Book = typeof bookList.$inferSelect;
export type NewBook = typeof bookList.$inferInsert;

// Extended types
export interface BookFilters {
  visible?: boolean;
  search?: string;
  status?: BookStatus;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface BookFormData {
  title: string;
  author: string;
  description?: string;
  status: BookStatus;
  isbn?: string;
  coverImage?: string;
  genres?: string[];
  pages?: number;
  currentPage?: number;
  rating?: number;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  plannedReadAt?: Date;
  order: number;
  visible: boolean;
}

// API response types
export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BookCreateRequest {
  book: NewBook;
}

export interface BookUpdateRequest {
  id: string;
  book: Partial<NewBook>;
}

export interface BookStatusUpdateRequest {
  id: string;
  status: BookStatus;
  currentPage?: number;
  completedAt?: Date;
  startedAt?: Date;
}
