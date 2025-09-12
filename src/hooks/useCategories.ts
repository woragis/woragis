import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
      const params = new URLSearchParams();
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await api.get(`/admin/categories?${params.toString()}`);
      return response.data.data as Category[];
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/admin/categories/${id}`);
      return response.data.data as Category;
    },
    enabled: !!id,
  });
}

export function usePopularCategories(limit: number = 10) {
  return useQuery({
    queryKey: categoryKeys.popular(limit),
    queryFn: async () => {
      const response = await api.get(
        `/admin/categories/popular?limit=${limit}`
      );
      return response.data.data as Array<{
        category: Category;
        projectCount: number;
      }>;
    },
  });
}

// Hooks for category mutations
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: NewCategory) => {
      const response = await api.post("/admin/categories", category);
      return response.data.data as Category;
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
      const response = await api.put(`/admin/categories/${id}`, category);
      return response.data.data as Category;
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
      await api.delete(`/admin/categories/${id}`);
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
      await api.patch("/admin/categories/order", { categoryOrders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
