import { NextRequest } from "next/server";
import { frameworkService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { FrameworkFilters, FrameworkType } from "@/types";

// GET /api/frameworks - Get visible frameworks for public display
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  const filters: FrameworkFilters = {
    visible: true, // Only get visible frameworks for public API
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
