import { NextRequest } from "next/server";
import { projectService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  notFoundResponse,
} from "@/utils/response-helpers";

// POST /api/admin/projects/[id]/toggle-visibility - Toggle project visibility
export const POST = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await projectService.toggleProjectVisibility(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Project not found");
    }

    return handleServiceResult(
      result,
      "Project visibility toggled successfully"
    );
  }
);
