import { NextRequest } from "next/server";
import { projectService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewProject } from "@/types";

// GET /api/admin/projects/[id] - Get project by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await projectService.getProjectById(id, authResult.userId!);

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return handleServiceResult(result, "Project fetched successfully");
  }
);

// PUT /api/admin/projects/[id] - Update project
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const body = await request.json();
    const projectData: Partial<NewProject> = body;

    const result = await projectService.updateProject(
      id,
      projectData,
      authResult.userId!
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return handleServiceResult(result, "Project updated successfully");
  }
);

// DELETE /api/admin/projects/[id] - Delete project
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await projectService.deleteProject(id, authResult.userId!);

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return deletedResponse("Project deleted successfully");
  }
);
