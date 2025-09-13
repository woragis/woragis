import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import { LoginRequestSchema } from "../../../../types";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  withErrorHandling,
} from "@/utils/response-helpers";
import { z } from "zod";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();

  try {
    const validatedData = LoginRequestSchema.parse(body);

    // Get user agent and IP address
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0] : undefined;

    const result = await authService.login(validatedData, userAgent, ipAddress);

    return successResponse(result, "Login successful");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.flatten().fieldErrors,
        "Invalid login credentials"
      );
    }

    // Re-throw to be handled by withErrorHandling
    throw error;
  }
});
