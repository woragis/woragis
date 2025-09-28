import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth";
import { martialArtsService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewMartialArt } from "@/server/db/schemas/about/martial-arts";

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
    const result = await martialArtsService.getMartialArtById(id);
    return handleServiceResult(result, "Martial art fetched successfully");
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
    const martialArtData: Partial<NewMartialArt> = body;
    const { id } = await params;

    const result = await martialArtsService.updateMartialArt(
      id,
      martialArtData
    );
    return handleServiceResult(result, "Martial art updated successfully");
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
    const result = await martialArtsService.deleteMartialArt(id);
    return handleServiceResult(result, "Martial art deleted successfully");
  }
);
