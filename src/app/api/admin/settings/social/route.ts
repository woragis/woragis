import { NextRequest } from "next/server";
import { settingsService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// GET /api/admin/settings/social - Get social media
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await settingsService.getSocialMedia(authResult.userId);
  return handleServiceResult(result, "Social media fetched successfully");
});

// PUT /api/admin/settings/social - Update social media
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
  const { createdAt, updatedAt, id, ...socialMediaData } = body;

  const result = await settingsService.updateSocialMedia(
    authResult.userId,
    socialMediaData
  );
  return handleServiceResult(result, "Social media updated successfully");
});
