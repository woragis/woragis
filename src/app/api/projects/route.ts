import { NextRequest } from "next/server";
import { projectService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/projects - Get public projects for frontend
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  if (featured === "true") {
    // Use default limit of 3 for featured projects if not specified
    const limitValue = parseInt(limit || "3");
    const result = await projectService.getPublicFeaturedProjects(limitValue);
    return handleServiceResult(
      result,
      "Featured projects fetched successfully"
    );
  }

  const result = await projectService.getPublicProjects();
  return handleServiceResult(result, "Projects fetched successfully");
});
