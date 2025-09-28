import { NextRequest } from "next/server";
import { testimonialService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  badRequestResponse,
} from "@/utils/response-helpers";

// GET /api/admin/testimonials - Get all testimonials for admin
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const visible = searchParams.get("visible");
  const publicOnly = searchParams.get("public");
  const rating = searchParams.get("rating");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const filters = {
    featured: featured ? featured === "true" : undefined,
    visible: visible ? visible === "true" : undefined,
    public: publicOnly ? publicOnly === "true" : undefined,
    rating: rating ? parseInt(rating) : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  };

  const result = await testimonialService.searchTestimonials(
    filters,
    authResult.userId
  );

  return handleServiceResult(result, "Testimonials fetched successfully");
});

// POST /api/admin/testimonials - Create new testimonial
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const testimonialData = await request.json();
  const result = await testimonialService.createTestimonial(
    testimonialData,
    authResult.userId
  );

  return handleServiceResult(result, "Testimonial created successfully", 201);
});
