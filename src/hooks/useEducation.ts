import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/clients/apiClient";
import type { Education, NewEducation, EducationFilters } from "@/types/education";
import type { ApiResponse } from "@/types";

// Query keys
export const educationKeys = {
  all: ["education"] as const,
  lists: () => [...educationKeys.all, "list"] as const,
  list: (filters: EducationFilters) =>
    [...educationKeys.lists(), filters] as const,
  details: () => [...educationKeys.all, "detail"] as const,
  detail: (id: string) => [...educationKeys.details(), id] as const,
};

// Hooks for fetching education
export function useEducation(filters: EducationFilters = {}) {
  return useQuery({
    queryKey: educationKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.degreeLevel) params.append("degreeLevel", filters.degreeLevel);
      if (filters.institution) params.append("institution", filters.institution);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await apiClient.get(`/admin/education?${params.toString()}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch education");
      }
      
      return response.data;
    },
  });
}

export function useEducationById(id: string) {
  return useQuery({
    queryKey: educationKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/admin/education/${id}`);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch education");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for education mutations
export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (education: NewEducation) => {
      const response = await apiClient.post("/admin/education", education);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create education");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      education,
    }: {
      id: string;
      education: Partial<NewEducation>;
    }) => {
      const response = await apiClient.put(`/admin/education/${id}`, education);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update education");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
      queryClient.setQueryData(educationKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/education/${id}`);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete education");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
    },
  });
}

export function useUpdateEducationOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (educationOrders: { id: string; order: number }[]) => {
      const response = await apiClient.post("/admin/education/order", { educationOrders });
      if (!response.success) {
        throw new Error(response.error || "Failed to update education order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
    },
  });
}
