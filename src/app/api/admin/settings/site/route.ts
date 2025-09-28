import { NextRequest } from "next/server";
import { settingsService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// GET /api/admin/settings/site - Get site settings
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await settingsService.getSiteSettings(authResult.userId);
  return handleServiceResult(result, "Site settings fetched successfully");
});

// PUT /api/admin/settings/site - Update site settings
export const PUT = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  // Remove any date fields that might be causing issues
  const { createdAt, updatedAt, id, ...siteSettingsData } = body;

  const result = await settingsService.updateSiteSettings(
    authResult.userId,
    siteSettingsData
  );
  return handleServiceResult(result, "Site settings updated successfully");
});
