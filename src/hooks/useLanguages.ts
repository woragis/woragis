import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Language, NewLanguage, LanguageFilters } from "@/types";

// Query keys
export const languageKeys = {
  all: ["languages"] as const,
  lists: () => [...languageKeys.all, "list"] as const,
  list: (filters: LanguageFilters) =>
    [...languageKeys.lists(), filters] as const,
  details: () => [...languageKeys.all, "detail"] as const,
  detail: (id: string) => [...languageKeys.details(), id] as const,
  popular: (limit: number) => [...languageKeys.all, "popular", limit] as const,
};

// Hooks for fetching languages
export function useLanguages(filters: LanguageFilters = {}) {
  return useQuery({
    queryKey: languageKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await api.get(`/admin/languages?${params.toString()}`);
      return response.data.data as Language[];
    },
  });
}

export function useLanguage(id: string) {
  return useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/admin/languages/${id}`);
      return response.data.data as Language;
    },
    enabled: !!id,
  });
}

export function usePopularLanguages(limit: number = 10) {
  return useQuery({
    queryKey: languageKeys.popular(limit),
    queryFn: async () => {
      const response = await api.get(`/admin/languages/popular?limit=${limit}`);
      return response.data.data as Array<{
        language: Language;
        projectCount: number;
      }>;
    },
  });
}

// Hooks for language mutations
export function useCreateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: NewLanguage) => {
      const response = await api.post("/admin/languages", language);
      return response.data.data as Language;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      language,
    }: {
      id: string;
      language: Partial<NewLanguage>;
    }) => {
      const response = await api.put(`/admin/languages/${id}`, language);
      return response.data.data as Language;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
      queryClient.setQueryData(languageKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/languages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}

export function useUpdateLanguageOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (languageOrders: { id: string; order: number }[]) => {
      await api.patch("/admin/languages/order", { languageOrders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}
