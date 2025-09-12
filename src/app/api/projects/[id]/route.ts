import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/server/services";

// GET /api/projects/[id] - Get public project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const relations = searchParams.get("relations");

  if (relations === "true") {
    const result = await projectService.getPublicProjectWithRelations(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (!result.data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  }

  const result = await projectService.getPublicProjectById(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (!result.data) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(result.data);
}
