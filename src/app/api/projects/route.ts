import { NextRequest, NextResponse } from "next/server";
import { projectService, settingsService } from "@/server/services";

// GET /api/projects - Get projects for frontend
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  if (featured === "true") {
    const projectsPerPageResult = await settingsService.getProjectsPerPage();
    if (!projectsPerPageResult.success) {
      return NextResponse.json(
        { error: "Failed to get projects per page setting" },
        { status: 500 }
      );
    }

    const limitValue = parseInt(limit || projectsPerPageResult.data.toString());
    const result = await projectService.getFeaturedProjects(limitValue);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  }

  const result = await projectService.getVisibleProjects();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
