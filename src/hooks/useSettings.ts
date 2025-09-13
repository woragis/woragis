import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import type { Setting, NewSetting } from "@/types";

// Query keys
export const settingKeys = {
  all: ["settings"] as const,
  lists: () => [...settingKeys.all, "list"] as const,
  detail: (key: string) => [...settingKeys.all, "detail", key] as const,
};

// Hooks for fetching settings
export function useSettings() {
  return useQuery({
    queryKey: settingKeys.lists(),
    queryFn: async () => {
      const response = await settingsApi.getAllSettings();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch settings");
      }
      return response.data;
    },
  });
}

export function useSetting(key: string) {
  return useQuery({
    queryKey: settingKeys.detail(key),
    queryFn: async () => {
      const response = await settingsApi.getSettingByKey(key);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch setting");
      }
      return response.data;
    },
    enabled: !!key,
  });
}

// Hooks for setting mutations
export function useCreateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (setting: NewSetting) => {
      const response = await settingsApi.createSetting(setting);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create setting");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await settingsApi.updateSetting(key, value);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update setting");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
      queryClient.setQueryData(settingKeys.detail(variables.key), data);
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const response = await settingsApi.updateManySettings(settings);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update settings");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      const response = await settingsApi.deleteSetting(key);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete setting");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}
