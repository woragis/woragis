import { NextRequest, NextResponse } from "next/server";
import { frameworkService } from "@/server/services";
import type { NewFramework } from "@/types";

// GET /api/admin/frameworks/[id] - Get framework by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await frameworkService.getFrameworkById(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// PUT /api/admin/frameworks/[id] - Update framework
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const frameworkData: Partial<NewFramework> = body;

  const result = await frameworkService.updateFramework(
    params.id,
    frameworkData
  );

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// DELETE /api/admin/frameworks/[id] - Delete framework
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await frameworkService.deleteFramework(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
