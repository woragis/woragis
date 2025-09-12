import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/server/services";
import type { NewProject } from "@/types";

// GET /api/admin/projects/[id] - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await projectService.getProjectById(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// PUT /api/admin/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const projectData: Partial<NewProject> = body;

  const result = await projectService.updateProject(params.id, projectData);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// DELETE /api/admin/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await projectService.deleteProject(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
