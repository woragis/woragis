import { NextResponse } from "next/server";
import { getHealthCheckData } from "@/lib/config/startup-validation";

export async function GET() {
  try {
    const healthData = await getHealthCheckData();
    
    return NextResponse.json(healthData, {
      status: healthData.status === "healthy" ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
