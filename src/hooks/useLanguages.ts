import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { languageApi } from "@/lib/api";
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
      const response = await languageApi.searchLanguages(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch languages");
      }
      return response.data;
    },
  });
}

export function useLanguage(id: string) {
  return useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: async () => {
      const response = await languageApi.getLanguageById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch language");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePopularLanguages(limit: number = 10) {
  return useQuery({
    queryKey: languageKeys.popular(limit),
    queryFn: async () => {
      const response = await languageApi.getPopularLanguages(limit);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch popular languages");
      }
      return response.data;
    },
  });
}

// Hooks for language mutations
export function useCreateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: NewLanguage) => {
      const response = await languageApi.createLanguage(language);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create language");
      }
      return response.data;
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
      const response = await languageApi.updateLanguage(id, language);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update language");
      }
      return response.data;
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
      const response = await languageApi.deleteLanguage(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete language");
      }
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
      const response = await languageApi.updateLanguageOrder(languageOrders);
      if (!response.success) {
        throw new Error(response.error || "Failed to update language order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}
