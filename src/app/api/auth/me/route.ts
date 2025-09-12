import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { ApiResponse } from "../../../../types";

export async function GET(request: NextRequest) {
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

    const user = await authService.getUserById(tokenData.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get user profile error:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get user profile",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
