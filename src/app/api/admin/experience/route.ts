import { NextRequest } from "next/server";
import { experienceService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import { NewExperience } from "@/types";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const result = await experienceService.getAllExperiencesForAdmin();
  return handleServiceResult(result, "Admin experiences fetched successfully");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const body = await request.json();
  const experienceData: NewExperience = {
    title: body.title,
    company: body.company,
    period: body.period,
    location: body.location,
    description: body.description,
    achievements: body.achievements || [],
    technologies: body.technologies || [],
    icon: body.icon || "💼",
    order: body.order || 0,
    isActive: body.isActive ? "true" : "false",
  };

  const result = await experienceService.createExperience(experienceData);
  return handleServiceResult(result, "Experience created successfully", 201);
});
