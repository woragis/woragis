import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api/settings";
import { biographyApi } from "@/lib/api/about/biography";
import type {
  Setting,
  NewSetting,
  Biography,
  NewBiography,
  SocialMedia,
  NewSocialMedia,
  ContactInfo,
  NewContactInfo,
  SiteSettings,
  NewSiteSettings,
} from "@/types";

// Query keys
export const settingKeys = {
  all: ["settings"] as const,
  lists: () => [...settingKeys.all, "list"] as const,
  detail: (key: string) => [...settingKeys.all, "detail", key] as const,
  core: () => [...settingKeys.all, "core"] as const,
  social: () => [...settingKeys.all, "social"] as const,
  contact: () => [...settingKeys.all, "contact"] as const,
  site: () => [...settingKeys.all, "site"] as const,
  public: () => [...settingKeys.all, "public"] as const,
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

// Structured Settings Hooks
// Biography
export function useBiography() {
  return useQuery({
    queryKey: settingKeys.core(),
    queryFn: async () => {
      const response = await biographyApi.getBiography();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch biography");
      }
      return response.data;
    },
  });
}

export function useUpdateBiography() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (biographySettings: Partial<NewBiography>) => {
      const response = await biographyApi.updateBiography(biographySettings);
      if (!response.success) {
        throw new Error(response.error || "Failed to update biography");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.core() });
      queryClient.invalidateQueries({ queryKey: settingKeys.public() });
    },
  });
}

// Social Media
export function useSocialMedia() {
  return useQuery({
    queryKey: settingKeys.social(),
    queryFn: async () => {
      const response = await settingsApi.getSocialMedia();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch social media");
      }
      return response.data;
    },
  });
}

export function useUpdateSocialMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (socialSettings: Partial<NewSocialMedia>) => {
      const response = await settingsApi.updateSocialMedia(socialSettings);
      if (!response.success) {
        throw new Error(response.error || "Failed to update social media");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.social() });
      queryClient.invalidateQueries({ queryKey: settingKeys.public() });
    },
  });
}

// Contact Info
export function useContactInfo() {
  return useQuery({
    queryKey: settingKeys.contact(),
    queryFn: async () => {
      const response = await settingsApi.getContactInfo();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch contact info");
      }
      return response.data;
    },
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactSettings: Partial<NewContactInfo>) => {
      const response = await settingsApi.updateContactInfo(contactSettings);
      if (!response.success) {
        throw new Error(response.error || "Failed to update contact info");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.contact() });
      queryClient.invalidateQueries({ queryKey: settingKeys.public() });
    },
  });
}

// Site Settings
export function useSiteSettings() {
  return useQuery({
    queryKey: settingKeys.site(),
    queryFn: async () => {
      const response = await settingsApi.getSiteSettings();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch site settings");
      }
      return response.data;
    },
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (siteSettings: Partial<NewSiteSettings>) => {
      const response = await settingsApi.updateSiteSettings(siteSettings);
      if (!response.success) {
        throw new Error(response.error || "Failed to update site settings");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.site() });
      queryClient.invalidateQueries({ queryKey: settingKeys.public() });
    },
  });
}

// Public Settings
export function usePublicSettings() {
  return useQuery({
    queryKey: settingKeys.public(),
    queryFn: async () => {
      const response = await settingsApi.getPublicSettings();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch public settings");
      }
      return response.data;
    },
  });
}
