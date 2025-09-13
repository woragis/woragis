import { NextRequest } from "next/server";
import { projectService } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewProject } from "@/types";

// GET /api/admin/projects/[id] - Get project by ID
export const GET = requireAuth(
  async (
    request: NextRequest,
    user: AuthenticatedUser,
    context: { params: { id: string } }
  ) => {
    const result = await projectService.getProjectById(
      context.params.id,
      user.userId
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return handleServiceResult(result, "Project fetched successfully");
  }
);

// PUT /api/admin/projects/[id] - Update project
export const PUT = requireAuth(
  async (
    request: NextRequest,
    user: AuthenticatedUser,
    context: { params: { id: string } }
  ) => {
    const body = await request.json();
    const projectData: Partial<NewProject> = body;

    const result = await projectService.updateProject(
      context.params.id,
      projectData,
      user.userId
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return handleServiceResult(result, "Project updated successfully");
  }
);

// DELETE /api/admin/projects/[id] - Delete project
export const DELETE = requireAuth(
  async (
    request: NextRequest,
    user: AuthenticatedUser,
    context: { params: { id: string } }
  ) => {
    const result = await projectService.deleteProject(
      context.params.id,
      user.userId
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return deletedResponse("Project deleted successfully");
  }
);
