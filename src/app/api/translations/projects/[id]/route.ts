import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { CreateProjectTranslation, SupportedLanguage } from "@/types";

// GET /api/translations/projects/[id] - Get project with translation
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { searchParams } = new URL(request.url);
  const language = (searchParams.get("lang") || "en") as SupportedLanguage;
  const fallback = searchParams.get("fallback") !== "false";
  const resolvedParams = await params;

  const result = await translationService.getProjectWithTranslation(
    resolvedParams.id,
    language,
    fallback
  );

  if (!result) {
    return NextResponse.json(
      { success: false, error: 'No result returned' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: result,
    message: "Project with translation fetched successfully"
  });
});

// POST /api/translations/projects/[id] - Create project translation
export const POST = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await request.json();
  const resolvedParams = await params;
  const translation: CreateProjectTranslation = {
    projectId: resolvedParams.id,
    languageCode: body.languageCode,
    title: body.title,
    description: body.description,
    longDescription: body.longDescription,
    content: body.content,
  };

  // Validate translation data
  const validation = translationService.validateTranslationData("project", translation);
  if (!validation.isValid) {
    return Response.json(
      {
        success: false,
        error: "Validation failed",
        details: validation.errors,
      },
      { status: 400 }
    );
  }

  const result = await translationService.createProjectTranslation(translation);
  return NextResponse.json({
    success: true,
    data: result,
    message: "Project translation created successfully"
  }, { status: 201 });
});

// PUT /api/translations/projects/[id] - Update project translation
export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await request.json();
  const resolvedParams = await params;
  const languageCode = body.languageCode as SupportedLanguage;
  const translation = {
    title: body.title,
    description: body.description,
    longDescription: body.longDescription,
    content: body.content,
  };

  // Validate translation data
  const validation = translationService.validateTranslationData("project", translation);
  if (!validation.isValid) {
    return Response.json(
      {
        success: false,
        error: "Validation failed",
        details: validation.errors,
      },
      { status: 400 }
    );
  }

  const result = await translationService.updateProjectTranslation(
    resolvedParams.id,
    languageCode,
    translation
  );

  if (!result) {
    return NextResponse.json(
      { success: false, error: 'Translation not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result,
    message: "Project translation updated successfully"
  });
});
