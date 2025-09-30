import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { SupportedLanguage } from "@/types";

// GET /api/translations - Get translation statistics
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("contentType");
  const contentId = searchParams.get("contentId");

  if (contentType && contentId) {
    // Get translation status for specific content
    const result = await translationService.getTranslationStatus(
      contentType as "blog" | "project" | "experience" | "education" | "testimonial",
      contentId
    );
    return NextResponse.json({
      success: true,
      data: result,
      message: "Translation status fetched successfully"
    });
  }

  // Get overall translation statistics
  const result = await translationService.getTranslationStats();
  return NextResponse.json({
    success: true,
    data: result,
    message: "Translation statistics fetched successfully"
  });
});
