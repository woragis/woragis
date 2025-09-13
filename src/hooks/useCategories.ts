import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api";
import type { Category, NewCategory, CategoryFilters } from "@/types";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: CategoryFilters) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  popular: (limit: number) => [...categoryKeys.all, "popular", limit] as const,
};

// Hooks for fetching categories
export function useCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: async () => {
      const response = await categoryApi.searchCategories(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch categories");
      }
      return response.data;
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await categoryApi.getCategoryById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch category");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePopularCategories(limit: number = 10) {
  return useQuery({
    queryKey: categoryKeys.popular(limit),
    queryFn: async () => {
      const response = await categoryApi.getPopularCategories(limit);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch popular categories");
      }
      return response.data;
    },
  });
}

// Hooks for category mutations
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: NewCategory) => {
      const response = await categoryApi.createCategory(category);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create category");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      category,
    }: {
      id: string;
      category: Partial<NewCategory>;
    }) => {
      const response = await categoryApi.updateCategory(id, category);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update category");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.setQueryData(categoryKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await categoryApi.deleteCategory(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategoryOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryOrders: { id: string; order: number }[]) => {
      const response = await categoryApi.updateCategoryOrder(categoryOrders);
      if (!response.success) {
        throw new Error(response.error || "Failed to update category order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
