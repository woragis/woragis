import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";
import { languagesService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewLanguage } from "@/server/db/schemas/about/languages";

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError("Unauthorized");
    }

    const { id } = await params;
    const result = await languagesService.getLanguageById(id);
    return handleServiceResult(result, "Language fetched successfully");
  }
);

export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError("Unauthorized");
    }

    const body = await request.json();
    const languageData: Partial<NewLanguage> = body;
    const { id } = await params;

    const result = await languagesService.updateLanguage(id, languageData);
    return handleServiceResult(result, "Language updated successfully");
  }
);

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError("Unauthorized");
    }

    const { id } = await params;
    const result = await languagesService.deleteLanguage(id);
    return handleServiceResult(result, "Language deleted successfully");
  }
);
