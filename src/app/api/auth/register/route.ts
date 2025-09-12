import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { RegisterRequestSchema } from "../../../../types";
import { ApiResponse } from "../../../../types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterRequestSchema.parse(body);

    // Get user agent and IP address
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0]
      : request.ip || undefined;

    const result = await authService.register(
      validatedData,
      userAgent,
      ipAddress
    );

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "User registered successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
