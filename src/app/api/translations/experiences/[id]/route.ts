import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { CreateExperienceTranslation, SupportedLanguage } from "@/types";

// GET /api/translations/experiences/[id] - Get experience with translation
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { searchParams } = new URL(request.url);
  const language = (searchParams.get("lang") || "en") as SupportedLanguage;
  const fallback = searchParams.get("fallback") !== "false";
  const resolvedParams = await params;

  const result = await translationService.getExperienceWithTranslation(
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
    message: "Experience with translation fetched successfully"
  });
});

// POST /api/translations/experiences/[id] - Create experience translation
export const POST = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await request.json();
  const resolvedParams = await params;
  const translation: CreateExperienceTranslation = {
    experienceId: resolvedParams.id,
    languageCode: body.languageCode,
    title: body.title,
    company: body.company,
    period: body.period,
    location: body.location,
    description: body.description,
    achievements: body.achievements,
  };

  // Validate translation data
  const validation = translationService.validateTranslationData("experience", translation);
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

  const result = await translationService.createExperienceTranslation(translation);
  return NextResponse.json({
    success: true,
    data: result,
    message: "Experience translation created successfully"
  }, { status: 201 });
});

// PUT /api/translations/experiences/[id] - Update experience translation
export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await request.json();
  const resolvedParams = await params;
  const languageCode = body.languageCode as SupportedLanguage;
  const translation = {
    title: body.title,
    company: body.company,
    period: body.period,
    location: body.location,
    description: body.description,
    achievements: body.achievements,
  };

  // Validate translation data
  const validation = translationService.validateTranslationData("experience", translation);
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

  const result = await translationService.updateExperienceTranslation(
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
    message: "Experience translation updated successfully"
  });
});
