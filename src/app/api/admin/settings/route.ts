import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/server/services";

// GET /api/admin/settings - Get all settings
export async function GET() {
  const result = await settingsService.getAllSettings();

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

// POST /api/admin/settings - Create or update setting
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      { success: false, error: "Key and value are required" },
      { status: 400 }
    );
  }

  const result = await settingsService.updateSetting(key, value);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
