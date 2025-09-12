import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { UpdateProfileRequestSchema } from "../../../../types";
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
    const validatedData = UpdateProfileRequestSchema.parse(body);

    const user = await authService.updateProfile(
      tokenData.userId,
      validatedData
    );

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to update profile",
      };
      return NextResponse.json(response, { status: 400 });
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
      message: "Profile updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
