import { NextRequest } from "next/server";
import { projectService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
} from "@/utils/response-helpers";

// GET /api/projects/[id] - Get public project by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const relations = searchParams.get("relations");

    if (relations === "true") {
      const result = await projectService.getPublicProjectWithRelations(id);

      if (!result.success) {
        return notFoundResponse(result.error || "Project not found");
      }

      return handleServiceResult(
        result,
        "Project with relations fetched successfully"
      );
    }

    const result = await projectService.getPublicProjectById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return handleServiceResult(result, "Project fetched successfully");
  }
);
