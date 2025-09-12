import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { ApiResponse } from "../../../../types";

export async function POST(request: NextRequest) {
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

    const success = await authService.logoutAllSessions(tokenData.userId);

    const response: ApiResponse = {
      success,
      message: success
        ? "All sessions logged out successfully"
        : "Failed to logout all sessions",
    };

    return NextResponse.json(response, { status: success ? 200 : 400 });
  } catch (error) {
    console.error("Logout all sessions error:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to logout all sessions",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
