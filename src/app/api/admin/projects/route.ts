import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/server/services";
import type { NewProject, ProjectFilters } from "@/types";

// GET /api/admin/projects - Get all projects with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters: ProjectFilters = {
    featured:
      searchParams.get("featured") === "true"
        ? true
        : searchParams.get("featured") === "false"
        ? false
        : undefined,
    visible:
      searchParams.get("visible") === "true"
        ? true
        : searchParams.get("visible") === "false"
        ? false
        : undefined,
    search: searchParams.get("search") || undefined,
    technologies: searchParams.get("technologies")?.split(",") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await projectService.searchProjects(filters);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

// POST /api/admin/projects - Create new project
export async function POST(request: NextRequest) {
  const body = await request.json();
  const projectData: NewProject = body;

  const result = await projectService.createProject(projectData);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
