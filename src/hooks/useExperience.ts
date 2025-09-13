import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Experience,
  NewExperience,
  UpdateExperience,
  ApiResponse,
} from "@/types";

// Admin hooks
export const useExperience = () => {
  return useQuery({
    queryKey: ["admin-experience"],
    queryFn: async () => {
      const response = await apiClient.get("/api/admin/experience");
      const result = response.data as ApiResponse<Experience[]>;
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch experiences");
      }
      return result.data || [];
    },
  });
};

export const useExperienceById = (id: string) => {
  return useQuery({
    queryKey: ["admin-experience", id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/experience/${id}`);
      const result = response.data as ApiResponse<Experience>;
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch experience");
      }
      return result.data;
    },
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewExperience) => {
      const response = await apiClient.post("/api/admin/experience", data);
      const result = response.data as ApiResponse<Experience>;
      if (!result.success) {
        throw new Error(result.error || "Failed to create experience");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["public-experience"] });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExperience;
    }) => {
      const response = await apiClient.put(`/api/admin/experience/${id}`, data);
      const result = response.data as ApiResponse<Experience>;
      if (!result.success) {
        throw new Error(result.error || "Failed to update experience");
      }
      return result.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["admin-experience", id] });
      queryClient.invalidateQueries({ queryKey: ["public-experience"] });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/api/admin/experience/${id}`);
      const result = response.data as ApiResponse<void>;
      if (!result.success) {
        throw new Error(result.error || "Failed to delete experience");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["public-experience"] });
    },
  });
};

export const useToggleExperienceVisible = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(
        `/api/admin/experience/${id}/toggle`
      );
      const result = response.data as ApiResponse<Experience>;
      if (!result.success) {
        throw new Error(
          result.error || "Failed to toggle experience visibility"
        );
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["public-experience"] });
    },
  });
};

export const useUpdateExperienceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, order }: { id: string; order: number }) => {
      const response = await apiClient.patch(
        `/api/admin/experience/${id}/order`,
        { order }
      );
      const result = response.data as ApiResponse<Experience>;
      if (!result.success) {
        throw new Error(result.error || "Failed to update experience order");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["public-experience"] });
    },
  });
};
