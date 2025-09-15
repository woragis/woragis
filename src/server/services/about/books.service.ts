import { bookRepository } from "@/server/repositories";
import type { Book, NewBook, BookFilters, ApiResponse } from "@/types";
import { BaseService } from "../base.service";

export class BookService extends BaseService {
  async getAllBooks(filters?: BookFilters, userId?: string): Promise<ApiResponse<Book[]>> {
    try {
      const books = filters
        ? await bookRepository.search(filters, userId)
        : await bookRepository.findAll(userId);
      return this.success(books);
    } catch (error) {
      return this.handleError(error, "getAllBooks");
    }
  }

  async getVisibleBooks(): Promise<ApiResponse<Book[]>> {
    try {
      const books = await bookRepository.findVisible();
      return this.success(books);
    } catch (error) {
      return this.handleError(error, "getVisibleBooks");
    }
  }

  async getBookById(id: string): Promise<ApiResponse<Book | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid book ID",
        };
      }

      const book = await bookRepository.findById(id);
      return this.success(book);
    } catch (error) {
      return this.handleError(error, "getBookById");
    }
  }

  async createBook(bookData: NewBook, userId: string): Promise<ApiResponse<Book>> {
    try {
      const requiredFields: (keyof NewBook)[] = ["title", "author"];
      const validationErrors = this.validateRequired(bookData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const bookWithUserId = { ...bookData, userId };
      const book = await bookRepository.create(bookWithUserId);
      return this.success(book, "Book created successfully");
    } catch (error) {
      return this.handleError(error, "createBook");
    }
  }

  async updateBook(
    id: string,
    bookData: Partial<NewBook>
  ): Promise<ApiResponse<Book | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid book ID",
        };
      }

      const book = await bookRepository.update(id, bookData);
      if (!book) {
        return {
          success: false,
          error: "Book not found",
        };
      }

      return this.success(book, "Book updated successfully");
    } catch (error) {
      return this.handleError(error, "updateBook");
    }
  }

  async deleteBook(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid book ID",
        };
      }

      await bookRepository.delete(id);
      return this.success(undefined, "Book deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteBook");
    }
  }

  async searchBooks(filters: BookFilters): Promise<ApiResponse<Book[]>> {
    try {
      const books = await bookRepository.search(filters);
      return this.success(books);
    } catch (error) {
      return this.handleError(error, "searchBooks");
    }
  }
}
