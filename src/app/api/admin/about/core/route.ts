import { NextRequest } from "next/server";
import { aboutCoreService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewAboutCore, AboutCoreFilters } from "@/types";

// GET /api/admin/about/core - Get about core information
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await aboutCoreService.getAboutCoreWithProfession(
    authResult.userId
  );
  return handleServiceResult(result, "About core fetched successfully");
});

// POST /api/admin/about/core - Create about core information
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const aboutData: NewAboutCore = body;

  const result = await aboutCoreService.createAboutCore(
    aboutData,
    authResult.userId
  );
  return handleServiceResult(result, "About core created successfully", 201);
});

// PUT /api/admin/about/core - Update about core information
export const PUT = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const aboutData: Partial<NewAboutCore> = body;

  // Get the existing about core to get the ID
  const existingAbout = await aboutCoreService.getAboutCore(authResult.userId);
  if (!existingAbout.success || !existingAbout.data) {
    return handleAuthError("About core not found");
  }

  const result = await aboutCoreService.updateAboutCore(
    existingAbout.data.id,
    aboutData
  );
  return handleServiceResult(result, "About core updated successfully");
});
