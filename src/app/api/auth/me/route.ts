import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  withErrorHandling,
} from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorizedResponse("No authorization token provided");
  }

  const token = authHeader.substring(7);
  const tokenData = await authService.verifyToken(token);

  if (!tokenData) {
    return unauthorizedResponse("Invalid or expired token");
  }

  const user = await authService.getUserById(tokenData.userId);
  if (!user) {
    return notFoundResponse("User not found");
  }

  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    role: user.role,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return successResponse(userData, "User profile fetched successfully");
});
