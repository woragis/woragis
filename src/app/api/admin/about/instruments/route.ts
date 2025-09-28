import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth";
import { instrumentsService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewInstrument } from "@/server/db/schemas/about/instruments";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const result = await instrumentsService.getInstrumentsByUserId(
    authResult.userId
  );
  return handleServiceResult(result, "Instruments fetched successfully");
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
  const instrumentData: NewInstrument = body;

  const result = await instrumentsService.createInstrument(
    instrumentData,
    authResult.userId
  );
  return handleServiceResult(result, "Instrument created successfully", 201);
});
