import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { RefreshTokenRequestSchema } from "../../../../types";
import { ApiResponse } from "../../../../types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RefreshTokenRequestSchema.parse(body);

    const success = await authService.logout(validatedData.refreshToken);

    const response: ApiResponse = {
      success,
      message: success ? "Logout successful" : "Logout failed",
    };

    return NextResponse.json(response, { status: success ? 200 : 400 });
  } catch (error) {
    console.error("Logout error:", error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
