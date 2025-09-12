import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { RefreshTokenRequestSchema } from "../../../../types";
import { ApiResponse } from "../../../../types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RefreshTokenRequestSchema.parse(body);

    const result = await authService.refreshToken(validatedData.refreshToken);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "Token refreshed successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Token refresh error:", error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Token refresh failed",
    };

    return NextResponse.json(response, { status: 401 });
  }
}
