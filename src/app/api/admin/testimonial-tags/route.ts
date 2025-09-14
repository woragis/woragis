import { NextRequest } from "next/server";
import { testimonialTagService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  badRequestResponse,
} from "@/utils/response-helpers";

// GET /api/admin/testimonial-tags - Get all testimonial tags for admin
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  const { searchParams } = new URL(request.url);
  const visible = searchParams.get("visible");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const filters = {
    visible: visible ? visible === "true" : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  };

  const result = await testimonialTagService.searchTestimonialTags(
    filters,
    authResult.userId || undefined
  );

  return handleServiceResult(result, "Testimonial tags fetched successfully");
});

// POST /api/admin/testimonial-tags - Create new testimonial tag
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();

  if (!body.name || !body.slug) {
    return badRequestResponse("Name and slug are required");
  }

  const result = await testimonialTagService.createTestimonialTag(
    body,
    authResult.userId
  );

  return handleServiceResult(
    result,
    "Testimonial tag created successfully",
    201
  );
});
