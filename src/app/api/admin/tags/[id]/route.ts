import { NextRequest, NextResponse } from "next/server";
import { tagService } from "@/server/services";
import type { NewTag } from "@/types";

// GET /api/admin/tags/[id] - Get tag by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await tagService.getTagById(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const tagData: Partial<NewTag> = body;

  const result = await tagService.updateTag(params.id, tagData);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// DELETE /api/admin/tags/[id] - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await tagService.deleteTag(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
