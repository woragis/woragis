import { NextRequest, NextResponse } from "next/server";
import { languageService } from "@/server/services";
import type { NewLanguage, LanguageFilters } from "@/types";

// GET /api/admin/languages - Get all languages with optional filtering
export async function GET(request: NextRequest) {
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

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

// POST /api/admin/languages - Create new language
export async function POST(request: NextRequest) {
  const body = await request.json();
  const languageData: NewLanguage = body;

  const result = await languageService.createLanguage(languageData);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
