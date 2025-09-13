import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import {
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  withErrorHandling,
} from "@/utils/response-helpers";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorizedResponse("No authorization token provided");
  }

  const token = authHeader.substring(7);
  const tokenData = await authService.verifyToken(token);

  if (!tokenData) {
    return unauthorizedResponse("Invalid or expired token");
  }

  const success = await authService.logoutAllSessions(tokenData.userId);

  if (success) {
    return successResponse(null, "All sessions logged out successfully");
  } else {
    return badRequestResponse("Failed to logout all sessions");
  }
});
