import { NextRequest } from "next/server";
import { biographyService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// GET /api/admin/settings/core - Get biography (legacy endpoint for compatibility)
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await biographyService.getBiographyByUserId(authResult.userId);
  return handleServiceResult(result, "Biography fetched successfully");
});

// PUT /api/admin/settings/core - Update biography (legacy endpoint for compatibility)
export const PUT = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const result = await biographyService.updateBiographyByUserId(
    authResult.userId,
    body
  );
  return handleServiceResult(result, "Biography updated successfully");
});

// POST /api/admin/settings/core - Create biography (legacy endpoint for compatibility)
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const result = await biographyService.createBiography({
    ...body,
    userId: authResult.userId,
  });
  return handleServiceResult(result, "Biography created successfully");
});
