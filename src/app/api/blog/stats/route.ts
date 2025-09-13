import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/server/services";

// GET /api/blog/stats - Get public blog statistics
export async function GET(request: NextRequest) {
  try {
    const result = await blogService.getPublicBlogStats();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

