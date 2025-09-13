import { NextRequest } from "next/server";
import { languageService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { NewLanguage, LanguageFilters } from "@/types";

// GET /api/admin/languages - Get all languages with optional filtering
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const filters: LanguageFilters = {
    visible:
      searchParams.get("visible") === "true"
        ? true
        : searchParams.get("visible") === "false"
        ? false
        : undefined,
    search: searchParams.get("search") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await languageService.searchLanguages(filters);
  return handleServiceResult(result, "Languages fetched successfully");
});

// POST /api/admin/languages - Create new language
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const languageData: NewLanguage = body;

  const result = await languageService.createLanguage(languageData);
  return handleServiceResult(result, "Language created successfully", 201);
});
