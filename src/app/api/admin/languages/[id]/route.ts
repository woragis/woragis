import { NextRequest, NextResponse } from "next/server";
import { languageService } from "@/server/services";
import type { NewLanguage } from "@/types";

// GET /api/admin/languages/[id] - Get language by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await languageService.getLanguageById(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// PUT /api/admin/languages/[id] - Update language
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const languageData: Partial<NewLanguage> = body;

  const result = await languageService.updateLanguage(params.id, languageData);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// DELETE /api/admin/languages/[id] - Delete language
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await languageService.deleteLanguage(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
