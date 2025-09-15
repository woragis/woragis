import { NextRequest } from "next/server";
import { aboutCoreService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/about/core - Get public about core information
export const GET = withErrorHandling(async (request: NextRequest) => {
  // For now, we'll get the first user's about core
  // In a real app, you might want to get it by a specific user ID or slug
  const result = await aboutCoreService.getAboutCoreWithProfession(
    "default-user-id"
  );
  return handleServiceResult(result, "About core fetched successfully");
});
