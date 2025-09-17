import { NextRequest } from "next/server";
import { withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";
import { instrumentsService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";
import { type NewInstrument } from "@/server/db/schemas/about/instruments";

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError("Unauthorized");
    }

    const { id } = await params;
    const result = await instrumentsService.getInstrumentById(id);
    return handleServiceResult(result, "Instrument fetched successfully");
  }
);

export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError("Unauthorized");
    }

    const body = await request.json();
    const instrumentData: Partial<NewInstrument> = body;
    const { id } = await params;

    const result = await instrumentsService.updateInstrument(
      id,
      instrumentData
    );
    return handleServiceResult(result, "Instrument updated successfully");
  }
);

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError("Unauthorized");
    }

    const { id } = await params;
    const result = await instrumentsService.deleteInstrument(id);
    return handleServiceResult(result, "Instrument deleted successfully");
  }
);
