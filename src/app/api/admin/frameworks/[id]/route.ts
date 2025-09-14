import { NextRequest } from "next/server";
import { frameworkService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewFramework } from "@/types";

// GET /api/admin/frameworks/[id] - Get framework by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await frameworkService.getFrameworkById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Framework not found");
    }

    return handleServiceResult(result, "Framework fetched successfully");
  }
);

// PUT /api/admin/frameworks/[id] - Update framework
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const body = await request.json();
    const frameworkData: Partial<NewFramework> = body;

    const result = await frameworkService.updateFramework(id, frameworkData);

    if (!result.success) {
      return notFoundResponse(result.error || "Framework not found");
    }

    return handleServiceResult(result, "Framework updated successfully");
  }
);

// DELETE /api/admin/frameworks/[id] - Delete framework
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await frameworkService.deleteFramework(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Framework not found");
    }

    return deletedResponse("Framework deleted successfully");
  }
);
