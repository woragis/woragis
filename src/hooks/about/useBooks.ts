import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "@/lib/api";
import type { Book, NewBook, BookFilters, BookStatus } from "@/types";

// Query keys
export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (filters: BookFilters) => [...bookKeys.lists(), filters] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  public: () => [...bookKeys.all, "public"] as const,
};

// Hooks for fetching books
export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: async () => {
      const response = await bookApi.searchBooks(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch books");
      }
      return response.data;
    },
  });
}

export function usePublicBooks() {
  return useQuery({
    queryKey: bookKeys.public(),
    queryFn: async () => {
      const response = await bookApi.getVisibleBooks();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public books");
      }
      return response.data;
    },
  });
}

export function useBookById(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => {
      const response = await bookApi.getBookById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch book");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for book mutations
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: NewBook) => {
      const response = await bookApi.createBook(book);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create book");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      book,
    }: {
      id: string;
      book: Partial<NewBook>;
    }) => {
      const response = await bookApi.updateBook(id, book);
      if (!response.success) {
        throw new Error(response.error || "Failed to update book");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      queryClient.setQueryData(bookKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await bookApi.deleteBook(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete book");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
    },
  });
}

export function useUpdateBookStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      currentPage,
      completedAt,
      startedAt,
    }: {
      id: string;
      status: BookStatus;
      currentPage?: number;
      completedAt?: Date;
      startedAt?: Date;
    }) => {
      const response = await bookApi.updateBookStatus(
        id,
        status,
        currentPage,
        completedAt,
        startedAt
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update book status");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      queryClient.setQueryData(bookKeys.detail(variables.id), data);
    },
  });
}
