import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import type { SocialMedia, ContactInfo, SiteSettings } from "@/types/settings";
import type { Biography } from "@/types/about/biography";

// Public settings response type
export interface PublicSettings {
  biography: Biography | null;
  social: SocialMedia | null;
  contact: ContactInfo | null;
  site: SiteSettings | null;
}

// Query keys
export const publicSettingsKeys = {
  all: ["publicSettings"] as const,
  public: () => [...publicSettingsKeys.all, "public"] as const,
};

// Hook for fetching public settings
export function usePublicSettings() {
  return useQuery<PublicSettings, Error>({
    queryKey: publicSettingsKeys.public(),
    queryFn: async () => {
      const response = await settingsApi.getPublicSettings();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public settings");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
