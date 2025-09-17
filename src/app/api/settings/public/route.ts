import { NextRequest } from "next/server";
import { settingsService, biographyService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/settings/public - Get public settings
export const GET = withErrorHandling(async (request: NextRequest) => {
  // Get all public settings in parallel
  const [biographyResult, socialResult, contactResult, siteResult] =
    await Promise.all([
      biographyService.getFirstVisibleBiography(),
      settingsService.getFirstSocialMedia(),
      settingsService.getFirstContactInfo(),
      settingsService.getFirstSiteSettings(),
    ]);

  const publicSettings = {
    biography: biographyResult.success ? biographyResult.data : null,
    social: socialResult.success ? socialResult.data : null,
    contact: contactResult.success ? contactResult.data : null,
    site: siteResult.success ? siteResult.data : null,
  };

  return Response.json({
    success: true,
    data: publicSettings,
    message: "Public settings fetched successfully",
  });
});
