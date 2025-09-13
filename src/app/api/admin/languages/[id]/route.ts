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
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const result = await languageService.getLanguageById(params.id);

    if (!result.success) {
      return notFoundResponse(result.error || "Language not found");
    }

    return handleServiceResult(result, "Language fetched successfully");
  }
);

// PUT /api/admin/languages/[id] - Update language
export const PUT = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const body = await request.json();
    const languageData: Partial<NewLanguage> = body;

    const result = await languageService.updateLanguage(
      params.id,
      languageData
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Language not found");
    }

    return handleServiceResult(result, "Language updated successfully");
  }
);

// DELETE /api/admin/languages/[id] - Delete language
export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const result = await languageService.deleteLanguage(params.id);

    if (!result.success) {
      return notFoundResponse(result.error || "Language not found");
    }

    return deletedResponse("Language deleted successfully");
  }
);
