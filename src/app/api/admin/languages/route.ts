import { NextRequest } from "next/server";
import { frameworkService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewFramework, FrameworkFilters } from "@/types";

// GET /api/admin/languages - Get all languages with optional filtering
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const { searchParams } = new URL(request.url);
  const filters: FrameworkFilters = {
    visible:
      searchParams.get("visible") === "true"
        ? true
        : searchParams.get("visible") === "false"
        ? false
        : undefined,
    search: searchParams.get("search") || undefined,
    type: "language", // Always filter for languages
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await frameworkService.searchFrameworks(filters);
  return handleServiceResult(result, "Languages fetched successfully");
});

// POST /api/admin/languages - Create new language
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const languageData: NewFramework = { ...body, type: "language" };

  const result = await frameworkService.createFramework(
    languageData,
    authResult.userId
  );
  return handleServiceResult(result, "Language created successfully", 201);
});
