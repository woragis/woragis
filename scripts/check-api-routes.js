#!/usr/bin/env node

/**
 * Script to check which API routes still need to be standardized
 * Run with: node scripts/check-api-routes.js
 */

const fs = require("fs");
const path = require("path");

const API_ROUTES_DIR = path.join(__dirname, "../src/app/api");

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

function checkRouteFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(process.cwd(), filePath);

  const issues = [];

  // Check for old patterns
  if (
    content.includes("NextResponse.json(") &&
    !content.includes("response-helpers")
  ) {
    issues.push("Uses NextResponse.json directly instead of response helpers");
  }

  if (
    content.includes("export async function") &&
    !content.includes("withErrorHandling")
  ) {
    issues.push("Missing withErrorHandling wrapper");
  }

  if (content.includes("try {") && content.includes("catch (error) {")) {
    issues.push("Uses manual try-catch instead of withErrorHandling");
  }

  if (
    content.includes("{ success: false, error:") &&
    !content.includes("errorResponse")
  ) {
    issues.push("Manual error response construction");
  }

  if (
    content.includes("{ success: true, data:") &&
    !content.includes("handleServiceResult")
  ) {
    issues.push("Manual success response construction");
  }

  return {
    file: relativePath,
    issues,
    needsUpdate: issues.length > 0,
  };
}

function main() {
  console.log("🔍 Checking API routes for standardization...\n");

  const routeFiles = findRouteFiles(API_ROUTES_DIR);
  const results = routeFiles.map(checkRouteFile);

  const needsUpdate = results.filter((r) => r.needsUpdate);
  const updated = results.filter((r) => !r.needsUpdate);

  console.log(`📊 Summary:`);
  console.log(`   Total routes: ${routeFiles.length}`);
  console.log(`   ✅ Updated: ${updated.length}`);
  console.log(`   ⚠️  Need update: ${needsUpdate.length}\n`);

  if (needsUpdate.length > 0) {
    console.log("🔧 Routes that need updating:\n");

    needsUpdate.forEach(({ file, issues }) => {
      console.log(`📁 ${file}`);
      issues.forEach((issue) => console.log(`   - ${issue}`));
      console.log("");
    });
  }

  if (updated.length > 0) {
    console.log("✅ Routes already standardized:\n");
    updated.forEach(({ file }) => {
      console.log(`   ${file}`);
    });
  }

  console.log("\n📚 See src/lib/api/README.md for migration guidelines");
}

if (require.main === module) {
  main();
}

module.exports = { checkRouteFile, findRouteFiles };
