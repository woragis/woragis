import { NextRequest } from "next/server";
import { experienceService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  notFoundResponse,
} from "@/utils/response-helpers";

// PATCH /api/admin/experience/[id]/toggle - Toggle experience visibility
export const PATCH = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await experienceService.toggleExperienceVisible(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Experience not found");
    }

    return handleServiceResult(
      result,
      "Experience visibility toggled successfully"
    );
  }
);
