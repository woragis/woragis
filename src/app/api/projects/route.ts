import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/server/services";

// GET /api/projects - Get public projects for frontend
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  if (featured === "true") {
    // Use default limit of 3 for featured projects if not specified
    const limitValue = parseInt(limit || "3");
    const result = await projectService.getPublicFeaturedProjects(limitValue);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  }

  const result = await projectService.getPublicProjects();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
