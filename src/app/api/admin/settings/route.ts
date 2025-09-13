import { NextRequest } from "next/server";
import { settingsService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  badRequestResponse,
} from "@/utils/response-helpers";

// GET /api/admin/settings - Get all settings
export const GET = withErrorHandling(async () => {
  const result = await settingsService.getAllSettings();
  return handleServiceResult(result, "Settings fetched successfully");
});

// POST /api/admin/settings - Create or update setting
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return badRequestResponse("Key and value are required");
  }

  const result = await settingsService.updateSetting(key, value);
  return handleServiceResult(result, "Setting updated successfully");
});
