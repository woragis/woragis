import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    // Simple test query
    const result = await db.execute("SELECT 1 as test");
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
