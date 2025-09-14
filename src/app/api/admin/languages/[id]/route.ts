import { NextRequest } from "next/server";
import { languageService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewLanguage } from "@/types";

// GET /api/admin/languages/[id] - Get language by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await languageService.getLanguageById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Language not found");
    }

    return handleServiceResult(result, "Language fetched successfully");
  }
);

// PUT /api/admin/languages/[id] - Update language
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const body = await request.json();
    const languageData: Partial<NewLanguage> = body;

    const result = await languageService.updateLanguage(id, languageData);

    if (!result.success) {
      return notFoundResponse(result.error || "Language not found");
    }

    return handleServiceResult(result, "Language updated successfully");
  }
);

// DELETE /api/admin/languages/[id] - Delete language
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await languageService.deleteLanguage(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Language not found");
    }

    return deletedResponse("Language deleted successfully");
  }
);
