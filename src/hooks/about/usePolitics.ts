import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { politicalViewApi } from "@/lib/api";
import type {
  PoliticalView,
  NewPoliticalView,
  PoliticalViewFilters,
} from "@/types";

// Query keys
export const politicalViewKeys = {
  all: ["politicalViews"] as const,
  lists: () => [...politicalViewKeys.all, "list"] as const,
  list: (filters: PoliticalViewFilters) =>
    [...politicalViewKeys.lists(), filters] as const,
  details: () => [...politicalViewKeys.all, "detail"] as const,
  detail: (id: string) => [...politicalViewKeys.details(), id] as const,
  public: () => [...politicalViewKeys.all, "public"] as const,
};

// Hooks for fetching political views
export function usePoliticalViews(filters: PoliticalViewFilters = {}) {
  return useQuery({
    queryKey: politicalViewKeys.list(filters),
    queryFn: async () => {
      const response = await politicalViewApi.searchPoliticalViews(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch political views");
      }
      return response.data;
    },
  });
}

export function usePublicPoliticalViews() {
  return useQuery({
    queryKey: politicalViewKeys.public(),
    queryFn: async () => {
      const response = await politicalViewApi.getVisiblePoliticalViews();
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch public political views"
        );
      }
      return response.data;
    },
  });
}

export function usePoliticalViewById(id: string) {
  return useQuery({
    queryKey: politicalViewKeys.detail(id),
    queryFn: async () => {
      const response = await politicalViewApi.getPoliticalViewById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch political view");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for political view mutations
export function useCreatePoliticalView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (politicalView: NewPoliticalView) => {
      const response = await politicalViewApi.createPoliticalView(
        politicalView
      );
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create political view");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: politicalViewKeys.all });
    },
  });
}

export function useUpdatePoliticalView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      politicalView,
    }: {
      id: string;
      politicalView: Partial<NewPoliticalView>;
    }) => {
      const response = await politicalViewApi.updatePoliticalView(
        id,
        politicalView
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update political view");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: politicalViewKeys.all });
      queryClient.setQueryData(politicalViewKeys.detail(variables.id), data);
    },
  });
}

export function useDeletePoliticalView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await politicalViewApi.deletePoliticalView(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete political view");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: politicalViewKeys.all });
    },
  });
}
