import { NextRequest } from "next/server";
import { projectTagService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// GET /api/admin/project-tags/[id] - Get project tag by ID
export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const result = await projectTagService.getProjectTagById(params.id);

    return handleServiceResult(result, "Project tag fetched successfully");
  }
);

// PUT /api/admin/project-tags/[id] - Update project tag
export const PUT = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const body = await request.json();

    const result = await projectTagService.updateProjectTag(params.id, body);

    return handleServiceResult(result, "Project tag updated successfully");
  }
);

// DELETE /api/admin/project-tags/[id] - Delete project tag
export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const result = await projectTagService.deleteProjectTag(params.id);

    return handleServiceResult(result, "Project tag deleted successfully");
  }
);
