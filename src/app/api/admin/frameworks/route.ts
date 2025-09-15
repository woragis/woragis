import { NextRequest } from "next/server";
import { frameworkService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewFramework, FrameworkFilters, FrameworkType } from "@/types";

// GET /api/admin/frameworks - Get all frameworks with optional filtering
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
    type: (searchParams.get("type") as FrameworkType) || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await frameworkService.searchFrameworks(filters);
  return handleServiceResult(result, "Frameworks fetched successfully");
});

// POST /api/admin/frameworks - Create new framework
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const frameworkData: NewFramework = body;

  const result = await frameworkService.createFramework(
    frameworkData,
    authResult.userId
  );
  return handleServiceResult(result, "Framework created successfully", 201);
});
