import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/clients/apiClient";
import type { Education, EducationFilters } from "@/types/education";
import type { ApiResponse } from "@/types";

// Query keys for public education
export const publicEducationKeys = {
  all: ["public-education"] as const,
  lists: () => [...publicEducationKeys.all, "list"] as const,
  list: (filters: EducationFilters) =>
    [...publicEducationKeys.lists(), filters] as const,
  byType: (type: string) => [...publicEducationKeys.all, "type", type] as const,
  byDegreeLevel: (level: string) => [...publicEducationKeys.all, "degreeLevel", level] as const,
};

// Hook for fetching public (visible) education
export function usePublicEducation(filters: EducationFilters = {}) {
  return useQuery({
    queryKey: publicEducationKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Only include visible education for public API
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.degreeLevel) params.append("degreeLevel", filters.degreeLevel);
      if (filters.institution) params.append("institution", filters.institution);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await apiClient.get(`/education?${params.toString()}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch education");
      }
      
      // The API returns { education: Education[], total: number }
      return response.data.education as Education[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching education by type (degree, certificate)
export function usePublicEducationByType(type: string) {
  return useQuery({
    queryKey: publicEducationKeys.byType(type),
    queryFn: async () => {
      const response = await apiClient.get(`/education?type=${type}&visible=true`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch education by type");
      }
      
      // The API returns { education: Education[], total: number }
      return response.data.education as Education[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching education by degree level
export function usePublicEducationByDegreeLevel(degreeLevel: string) {
  return useQuery({
    queryKey: publicEducationKeys.byDegreeLevel(degreeLevel),
    queryFn: async () => {
      const response = await apiClient.get(`/education?degreeLevel=${degreeLevel}&visible=true`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch education by degree level");
      }
      
      // The API returns { education: Education[], total: number }
      return response.data.education as Education[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
