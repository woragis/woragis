import { NextRequest } from "next/server";
import { educationService } from "@/server/services/education.service";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { EducationFilters, EducationType, DegreeLevel } from "@/types/education";

// GET /api/education - Get visible education records for public display
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  const filters: EducationFilters = {
    visible: true, // Only get visible education for public API
    search: searchParams.get("search") || undefined,
    type: (searchParams.get("type") as EducationType) || undefined,
    degreeLevel: (searchParams.get("degreeLevel") as DegreeLevel) || undefined,
    institution: searchParams.get("institution") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await educationService.searchEducation(filters);
  return handleServiceResult(result, "Education records fetched successfully");
});
