import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import { ChangePasswordRequestSchema } from "../../../../types";
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
    const validatedData = ChangePasswordRequestSchema.parse(body);

    const success = await authService.changePassword(
      tokenData.userId,
      validatedData
    );

    if (success) {
      return successResponse(null, "Password changed successfully");
    } else {
      return badRequestResponse("Failed to change password");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.flatten().fieldErrors,
        "Invalid password data"
      );
    }

    // Re-throw to be handled by withErrorHandling
    throw error;
  }
});
