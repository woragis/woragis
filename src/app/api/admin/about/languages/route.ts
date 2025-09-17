import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";
import { languagesService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewLanguage } from "@/server/db/schemas/about/languages";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await languagesService.getLanguagesByUserId(authResult.userId);
  return handleServiceResult(result, "Languages fetched successfully");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const languageData: NewLanguage = body;

  const result = await languagesService.createLanguage(
    languageData,
    authResult.userId
  );
  return handleServiceResult(result, "Language created successfully", 201);
});
