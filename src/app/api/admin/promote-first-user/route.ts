import { NextRequest } from "next/server";
import { authService } from "../../../../server/services";
import {
  successResponse,
  badRequestResponse,
  withErrorHandling,
} from "@/utils/response-helpers";

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const result = await authService.promoteFirstUserToAdmin();

    if (result) {
      return successResponse(
        { promoted: true },
        "First user successfully promoted to admin"
      );
    } else {
      return successResponse(
        { promoted: false },
        "No promotion needed - either no users exist or first user is already admin"
      );
    }
  } catch (error) {
    return badRequestResponse("Failed to promote first user to admin");
  }
});
