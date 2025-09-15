import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aboutCoreApi } from "@/lib/api";
import type {
  AboutCore,
  NewAboutCore,
  AboutCoreFilters,
  AboutCoreWithProfession,
  AboutCoreResponse,
} from "@/types";

// Query keys
export const aboutCoreKeys = {
  all: ["aboutCore"] as const,
  lists: () => [...aboutCoreKeys.all, "list"] as const,
  list: (filters: AboutCoreFilters) =>
    [...aboutCoreKeys.lists(), filters] as const,
  details: () => [...aboutCoreKeys.all, "detail"] as const,
  detail: (id: string) => [...aboutCoreKeys.details(), id] as const,
  public: () => [...aboutCoreKeys.all, "public"] as const,
};

// Hooks for fetching about core
export function useAboutCore() {
  return useQuery({
    queryKey: aboutCoreKeys.details(),
    queryFn: async () => {
      const response = await aboutCoreApi.getAboutCore();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch about core");
      }
      return response.data;
    },
  });
}

export function usePublicAboutCore() {
  return useQuery({
    queryKey: aboutCoreKeys.public(),
    queryFn: async () => {
      const response = await aboutCoreApi.getPublicAboutCore();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch public about core");
      }
      return response.data;
    },
  });
}

export function useSearchAboutCore(filters: AboutCoreFilters = {}) {
  return useQuery({
    queryKey: aboutCoreKeys.list(filters),
    queryFn: async () => {
      const response = await aboutCoreApi.searchAboutCore(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to search about core");
      }
      return response.data;
    },
  });
}

// Hooks for about core mutations
export function useCreateAboutCore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (aboutCore: NewAboutCore) => {
      const response = await aboutCoreApi.createAboutCore(aboutCore);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create about core");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutCoreKeys.all });
    },
  });
}

export function useUpdateAboutCore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (aboutCore: Partial<NewAboutCore>) => {
      const response = await aboutCoreApi.updateAboutCore(aboutCore);
      if (!response.success) {
        throw new Error(response.error || "Failed to update about core");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutCoreKeys.all });
    },
  });
}

export function useDeleteAboutCore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await aboutCoreApi.deleteAboutCore(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete about core");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutCoreKeys.all });
    },
  });
}

export function useToggleAboutCoreVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await aboutCoreApi.toggleAboutCoreVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle about core visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: aboutCoreKeys.all });
      queryClient.setQueryData(aboutCoreKeys.detail(variables), data);
    },
  });
}
