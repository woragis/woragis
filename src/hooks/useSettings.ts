import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Setting } from "@/types";

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
      const response = await api.get("/admin/settings");
      return response.data.data as Setting[];
    },
  });
}

export function useSetting(key: string) {
  return useQuery({
    queryKey: settingKeys.detail(key),
    queryFn: async () => {
      const response = await api.get(`/admin/settings/${key}`);
      return response.data.data as Setting;
    },
    enabled: !!key,
  });
}

// Hooks for setting mutations
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await api.post("/admin/settings", { key, value });
      return response.data.data as Setting;
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
      const response = await api.post("/admin/settings/bulk", { settings });
      return response.data.data as Setting[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}
