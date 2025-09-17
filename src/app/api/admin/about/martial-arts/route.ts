import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";
import { martialArtsService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewMartialArt } from "@/server/db/schemas/about/martial-arts";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await martialArtsService.getMartialArtsByUserId(
    authResult.userId
  );
  return handleServiceResult(result, "Martial arts fetched successfully");
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
  const martialArtData: NewMartialArt = body;

  const result = await martialArtsService.createMartialArt(
    martialArtData,
    authResult.userId
  );
  return handleServiceResult(result, "Martial art created successfully", 201);
});
