import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../server/services";
import { LoginRequestSchema } from "../../../../types";
import { ApiResponse } from "../../../../types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = LoginRequestSchema.parse(body);

    // Get user agent and IP address
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0]
      : request.ip || undefined;

    const result = await authService.login(validatedData, userAgent, ipAddress);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "Login successful",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };

    return NextResponse.json(response, { status: 401 });
  }
}
