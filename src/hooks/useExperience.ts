import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experienceApi } from "@/lib/api";
import { Experience, NewExperience, UpdateExperience } from "@/types";

// Admin hooks
export const useExperience = () => {
  return useQuery({
    queryKey: ["admin-experience"],
    queryFn: async () => {
      const response = await experienceApi.getAllExperience();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch experience");
      }
      return response.data;
    },
  });
};

export const useExperienceById = (id: string) => {
  return useQuery({
    queryKey: ["admin-experience", id],
    queryFn: async () => {
      const response = await experienceApi.getExperienceById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch experience");
      }
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewExperience) => {
      const response = await experienceApi.createExperience(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create experience");
      }
      return response.data;
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
      const response = await experienceApi.updateExperience(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update experience");
      }
      return response.data;
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
      const response = await experienceApi.deleteExperience(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete experience");
      }
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
      const response = await experienceApi.toggleExperienceVisibility(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle experience visibility"
        );
      }
      return response.data;
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
      const response = await experienceApi.updateExperienceOrder(id, order);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update experience order");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["public-experience"] });
    },
  });
};
