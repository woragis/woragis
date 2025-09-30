import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { CreateBlogPostTranslation, SupportedLanguage } from "@/types";

// GET /api/translations/blog/[id] - Get blog post with translation
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { searchParams } = new URL(request.url);
  const language = (searchParams.get("lang") || "en") as SupportedLanguage;
  const fallback = searchParams.get("fallback") !== "false";
  const resolvedParams = await params;

  const result = await translationService.getBlogPostWithTranslation(
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
    message: "Blog post with translation fetched successfully"
  });
});

// POST /api/translations/blog/[id] - Create blog post translation
export const POST = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await request.json();
  const resolvedParams = await params;
  const translation: CreateBlogPostTranslation = {
    blogPostId: resolvedParams.id,
    languageCode: body.languageCode,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
  };

  // Validate translation data
  const validation = translationService.validateTranslationData("blog", translation);
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

  const result = await translationService.createBlogPostTranslation(translation);
  return NextResponse.json({
    success: true,
    data: result,
    message: "Blog post translation created successfully"
  }, { status: 201 });
});

// PUT /api/translations/blog/[id] - Update blog post translation
export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await request.json();
  const resolvedParams = await params;
  const languageCode = body.languageCode as SupportedLanguage;
  const translation = {
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
  };

  // Validate translation data
  const validation = translationService.validateTranslationData("blog", translation);
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

  const result = await translationService.updateBlogPostTranslation(
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
    message: "Blog post translation updated successfully"
  });
});
