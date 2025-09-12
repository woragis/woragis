import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
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
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
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
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
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
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  }
);
