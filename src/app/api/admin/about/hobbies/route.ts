import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";
import { hobbiesService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewHobby } from "@/server/db/schemas/about/hobbies";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await hobbiesService.getHobbiesByUserId(authResult.userId);
  return handleServiceResult(result, "Hobbies fetched successfully");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const hobbyData: NewHobby = body;

  const result = await hobbiesService.createHobby(hobbyData, authResult.userId);
  return handleServiceResult(result, "Hobby created successfully", 201);
});
