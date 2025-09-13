import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import { RefreshTokenRequestSchema } from "../../../../types";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  withErrorHandling,
} from "@/utils/response-helpers";
import { z } from "zod";

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedData = RefreshTokenRequestSchema.parse(body);

    const result = await authService.refreshToken(validatedData.refreshToken);

    return successResponse(result, "Token refreshed successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.flatten().fieldErrors,
        "Invalid refresh token data"
      );
    }

    // Re-throw to be handled by withErrorHandling
    throw error;
  }
});
