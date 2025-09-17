import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";
import { hobbiesService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewHobby } from "@/server/db/schemas/about/hobbies";

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
    const result = await hobbiesService.getHobbyById(id);
    return handleServiceResult(result, "Hobby fetched successfully");
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
    const hobbyData: Partial<NewHobby> = body;
    const { id } = await params;

    const result = await hobbiesService.updateHobby(id, hobbyData);
    return handleServiceResult(result, "Hobby updated successfully");
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
    const result = await hobbiesService.deleteHobby(id);
    return handleServiceResult(result, "Hobby deleted successfully");
  }
);
