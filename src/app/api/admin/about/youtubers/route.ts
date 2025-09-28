import { NextRequest } from "next/server";
import { youtuberService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewYoutuber, YoutuberFilters } from "@/types";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const { searchParams } = new URL(request.url);
  const filters: YoutuberFilters = {
    search: searchParams.get("search") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await youtuberService.getAllYoutubers(filters, authResult.userId);
  return handleServiceResult(result, "Youtubers fetched successfully");
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
  const youtuberData: NewYoutuber = body;

  const result = await youtuberService.createYoutuber(youtuberData, authResult.userId);
  return handleServiceResult(result, "Youtuber created successfully", 201);
});
