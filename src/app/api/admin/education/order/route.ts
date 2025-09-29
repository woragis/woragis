import { NextRequest } from "next/server";
import { educationService } from "@/server/services/education.service";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// POST /api/admin/education/order - Update education order
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const body = await request.json();
  const { educationOrders }: { educationOrders: { id: string; order: number }[] } = body;

  const result = await educationService.updateEducationOrder(educationOrders);
  return handleServiceResult(result, "Education order updated successfully");
});
