import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { ChangePasswordRequestSchema } from "../../../../types";
import { ApiResponse } from "../../../../types";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        error: "No authorization token provided",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const token = authHeader.substring(7);
    const tokenData = await authService.verifyToken(token);

    if (!tokenData) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid or expired token",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ChangePasswordRequestSchema.parse(body);

    const success = await authService.changePassword(
      tokenData.userId,
      validatedData
    );

    const response: ApiResponse = {
      success,
      message: success
        ? "Password changed successfully"
        : "Failed to change password",
    };

    return NextResponse.json(response, { status: success ? 200 : 400 });
  } catch (error) {
    console.error("Change password error:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to change password",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
