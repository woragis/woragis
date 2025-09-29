import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/clients/apiClient";
import type { Framework, FrameworkFilters } from "@/types";
import type { ApiResponse } from "@/types";

// Query keys for public frameworks
export const publicFrameworkKeys = {
  all: ["public-frameworks"] as const,
  lists: () => [...publicFrameworkKeys.all, "list"] as const,
  list: (filters: FrameworkFilters) =>
    [...publicFrameworkKeys.lists(), filters] as const,
  byType: (type: string) => [...publicFrameworkKeys.all, "type", type] as const,
};

// Hook for fetching public (visible) frameworks
export function usePublicFrameworks(filters: FrameworkFilters = {}) {
  return useQuery({
    queryKey: publicFrameworkKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Only include visible frameworks for public API
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await apiClient.get(`/frameworks?${params.toString()}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch frameworks");
      }
      
      return response.data as Framework[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching frameworks by type (frontend, backend, tools, etc.)
export function usePublicFrameworksByType(type: string) {
  return useQuery({
    queryKey: publicFrameworkKeys.byType(type),
    queryFn: async () => {
      const response = await apiClient.get(`/frameworks?type=${type}&visible=true`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch frameworks by type");
      }
      
      return response.data as Framework[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
