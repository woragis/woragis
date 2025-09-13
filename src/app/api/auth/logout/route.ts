import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import { RefreshTokenRequestSchema } from "../../../../types";
import {
  successResponse,
  badRequestResponse,
  validationErrorResponse,
  withErrorHandling,
} from "@/utils/response-helpers";
import { z } from "zod";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();

  try {
    const validatedData = RefreshTokenRequestSchema.parse(body);

    const success = await authService.logout(validatedData.refreshToken);

    if (success) {
      return successResponse(null, "Logout successful");
    } else {
      return badRequestResponse("Logout failed");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.flatten().fieldErrors,
        "Invalid refresh token"
      );
    }

    // Re-throw to be handled by withErrorHandling
    throw error;
  }
});
