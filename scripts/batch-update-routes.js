#!/usr/bin/env node

/**
 * Batch script to help update remaining API routes to standardized format
 * This script provides templates and guidance for updating routes
 */

const fs = require("fs");
const path = require("path");

const API_ROUTES_DIR = path.join(__dirname, "../src/app/api");

// Route templates for common patterns
const templates = {
  publicGet: `import { NextRequest } from "next/server";
import { serviceName } from "@/server/services";
import { handleServiceResult, withErrorHandling } from "@/lib/api/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await serviceName.getData();
  return handleServiceResult(result, "Data fetched successfully");
});`,

  publicGetWithParams: `import { NextRequest } from "next/server";
import { serviceName } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
} from "@/lib/api/response-helpers";

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    const result = await serviceName.getById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Resource not found");
    }

    return handleServiceResult(result, "Resource fetched successfully");
  }
);`,

  authenticatedGet: `import { NextRequest } from "next/server";
import { serviceName } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import { handleServiceResult } from "@/lib/api/response-helpers";

export const GET = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    const result = await serviceName.getData(user.userId);
    return handleServiceResult(result, "Data fetched successfully");
  }
);`,

  authenticatedPost: `import { NextRequest } from "next/server";
import { serviceName } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import { handleServiceResult } from "@/lib/api/response-helpers";

export const POST = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    const body = await request.json();
    const result = await serviceName.create(body, user.userId);
    return handleServiceResult(result, "Resource created successfully", 201);
  }
);`,

  authenticatedPut: `import { NextRequest } from "next/server";
import { serviceName } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  notFoundResponse,
} from "@/lib/api/response-helpers";

export const PUT = requireAuth(
  async (
    request: NextRequest,
    user: AuthenticatedUser,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    const body = await request.json();
    const result = await serviceName.update(id, body, user.userId);

    if (!result.success) {
      return notFoundResponse(result.error || "Resource not found");
    }

    return handleServiceResult(result, "Resource updated successfully");
  }
);`,

  authenticatedDelete: `import { NextRequest } from "next/server";
import { serviceName } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import {
  notFoundResponse,
  deletedResponse,
} from "@/lib/api/response-helpers";

export const DELETE = requireAuth(
  async (
    request: NextRequest,
    user: AuthenticatedUser,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    const result = await serviceName.delete(id, user.userId);

    if (!result.success) {
      return notFoundResponse(result.error || "Resource not found");
    }

    return deletedResponse("Resource deleted successfully");
  }
);`,
};

function findRouteFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findRouteFiles(fullPath, files);
    } else if (item === "route.ts") {
      files.push(fullPath);
    }
  }

  return files;
}

function analyzeRoute(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(process.cwd(), filePath);

  const analysis = {
    file: relativePath,
    hasAuth:
      content.includes("requireAuth") || content.includes("authMiddleware"),
    hasParams: content.includes("{ params }"),
    methods: [],
    needsUpdate: false,
  };

  // Detect HTTP methods
  if (
    content.includes("export async function GET") ||
    content.includes("export const GET")
  ) {
    analysis.methods.push("GET");
  }
  if (
    content.includes("export async function POST") ||
    content.includes("export const POST")
  ) {
    analysis.methods.push("POST");
  }
  if (
    content.includes("export async function PUT") ||
    content.includes("export const PUT")
  ) {
    analysis.methods.push("PUT");
  }
  if (
    content.includes("export async function DELETE") ||
    content.includes("export const DELETE")
  ) {
    analysis.methods.push("DELETE");
  }
  if (
    content.includes("export async function PATCH") ||
    content.includes("export const PATCH")
  ) {
    analysis.methods.push("PATCH");
  }

  // Check if needs update
  analysis.needsUpdate =
    content.includes("NextResponse.json(") &&
    !content.includes("response-helpers");

  return analysis;
}

function suggestTemplate(analysis) {
  const { hasAuth, hasParams, methods } = analysis;

  if (methods.includes("GET") && !hasAuth && !hasParams) {
    return "publicGet";
  }
  if (methods.includes("GET") && !hasAuth && hasParams) {
    return "publicGetWithParams";
  }
  if (methods.includes("GET") && hasAuth) {
    return "authenticatedGet";
  }
  if (methods.includes("POST") && hasAuth) {
    return "authenticatedPost";
  }
  if (methods.includes("PUT") && hasAuth) {
    return "authenticatedPut";
  }
  if (methods.includes("DELETE") && hasAuth) {
    return "authenticatedDelete";
  }

  return "publicGet"; // fallback
}

function main() {
  console.log("🔧 API Route Batch Update Helper\n");

  const routeFiles = findRouteFiles(API_ROUTES_DIR);
  const analyses = routeFiles.map(analyzeRoute);
  const needsUpdate = analyses.filter((a) => a.needsUpdate);

  console.log(`📊 Found ${needsUpdate.length} routes that need updating:\n`);

  needsUpdate.forEach((analysis) => {
    console.log(`📁 ${analysis.file}`);
    console.log(`   Methods: ${analysis.methods.join(", ")}`);
    console.log(`   Auth: ${analysis.hasAuth ? "Yes" : "No"}`);
    console.log(`   Params: ${analysis.hasParams ? "Yes" : "No"}`);

    const template = suggestTemplate(analysis);
    console.log(`   Suggested template: ${template}`);
    console.log("");
  });

  console.log("📚 Available templates:");
  console.log("   - publicGet: Simple public GET route");
  console.log("   - publicGetWithParams: Public GET with URL parameters");
  console.log("   - authenticatedGet: Authenticated GET route");
  console.log("   - authenticatedPost: Authenticated POST route");
  console.log("   - authenticatedPut: Authenticated PUT route");
  console.log("   - authenticatedDelete: Authenticated DELETE route");
  console.log("");
  console.log("💡 To use a template:");
  console.log("   1. Copy the template code above");
  console.log("   2. Replace 'serviceName' with your actual service");
  console.log("   3. Update the service method calls");
  console.log("   4. Customize success messages");
  console.log("");
  console.log("🔍 Run 'node scripts/check-api-routes.js' to verify updates");
}

if (require.main === module) {
  main();
}

module.exports = { templates, analyzeRoute, suggestTemplate };
