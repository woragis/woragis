import { NextRequest } from "next/server";
import { blogService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/blog/stats - Get public blog statistics
export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await blogService.getPublicBlogStats();
  return handleServiceResult(result, "Blog statistics fetched successfully");
});
