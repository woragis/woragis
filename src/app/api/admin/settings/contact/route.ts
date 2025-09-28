import { NextRequest } from "next/server";
import { settingsService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// GET /api/admin/settings/contact - Get contact info
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await settingsService.getContactInfo(authResult.userId);
  return handleServiceResult(result, "Contact info fetched successfully");
});

// PUT /api/admin/settings/contact - Update contact info
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
  const { createdAt, updatedAt, id, ...contactInfoData } = body;

  const result = await settingsService.updateContactInfo(
    authResult.userId,
    contactInfoData
  );
  return handleServiceResult(result, "Contact info updated successfully");
});
