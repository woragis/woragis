import { apiClient } from "../client";
import type {
  Book,
  NewBook,
  BookFilters,
  BookStatus,
} from "@/types/about/books";
import type { ApiResponse } from "@/types";

// Book API functions
export const bookApi = {
  async getAllBooks(): Promise<ApiResponse<Book[]>> {
    return apiClient.get("/admin/about/books");
  },

  async getVisibleBooks(): Promise<ApiResponse<Book[]>> {
    return apiClient.get("/about/books");
  },

  async getBookById(id: string): Promise<ApiResponse<Book | null>> {
    return apiClient.get(`/admin/about/books/${id}`);
  },

  async createBook(bookData: NewBook): Promise<ApiResponse<Book>> {
    return apiClient.post("/admin/about/books", bookData);
  },

  async updateBook(
    id: string,
    bookData: Partial<NewBook>
  ): Promise<ApiResponse<Book | null>> {
    return apiClient.put(`/admin/about/books/${id}`, bookData);
  },

  async deleteBook(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/books/${id}`);
  },

  async searchBooks(filters: BookFilters): Promise<ApiResponse<Book[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/books?${params.toString()}`);
  },

  async updateBookStatus(
    id: string,
    status: BookStatus,
    currentPage?: number,
    completedAt?: Date,
    startedAt?: Date
  ): Promise<ApiResponse<Book | null>> {
    return apiClient.put(`/admin/about/books/${id}/status`, {
      status,
      currentPage,
      completedAt,
      startedAt,
    });
  },

  async toggleBookVisibility(id: string): Promise<ApiResponse<Book | null>> {
    return apiClient.put(`/admin/about/books/${id}/toggle-visibility`);
  },
};
