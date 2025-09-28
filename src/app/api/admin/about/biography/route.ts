import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth";
import { biographyService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewBiography } from "@/server/db/schemas/about/biography";

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

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const biographyData: NewBiography = {
    ...body,
    userId: authResult.userId,
  };

  const result = await biographyService.createBiography(biographyData);
  return handleServiceResult(result, "Biography created successfully", 201);
});

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
  const { createdAt, updatedAt, ...biographyData } = body;
  const sanitizedBiographyData: Partial<NewBiography> = biographyData;

  const result = await biographyService.updateBiographyByUserId(
    authResult.userId,
    sanitizedBiographyData
  );
  return handleServiceResult(result, "Biography updated successfully");
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await biographyService.deleteBiographyByUserId(
    authResult.userId
  );
  return handleServiceResult(result, "Biography deleted successfully");
});
