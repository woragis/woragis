import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import { UpdateProfileRequestSchema } from "../../../../types";
import {
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  validationErrorResponse,
  withErrorHandling,
} from "@/utils/response-helpers";
import { z } from "zod";

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorizedResponse("No authorization token provided");
  }

  const token = authHeader.substring(7);
  const tokenData = await authService.verifyToken(token);

  if (!tokenData) {
    return unauthorizedResponse("Invalid or expired token");
  }

  try {
    const body = await request.json();
    const validatedData = UpdateProfileRequestSchema.parse(body);

    const user = await authService.updateProfile(
      tokenData.userId,
      validatedData
    );

    if (!user) {
      return badRequestResponse("Failed to update profile");
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

    return successResponse(userData, "Profile updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.flatten().fieldErrors,
        "Invalid profile data"
      );
    }

    // Re-throw to be handled by withErrorHandling
    throw error;
  }
});
