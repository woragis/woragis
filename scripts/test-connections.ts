#!/usr/bin/env tsx

/**
 * Connection Test Script
 * 
 * This script tests database and Redis connections and can be used for:
 * - Manual connection testing
 * - CI/CD pipeline validation
 * - Debugging connection issues
 * 
 * Usage:
 *   npm run test:connections
 *   tsx scripts/test-connections.ts
 *   tsx scripts/test-connections.ts --verbose
 */

import { testAllConnections, validateConnectionEnv } from "../src/lib/config/connection-tests";

async function main() {
  const verbose = process.argv.includes("--verbose");
  const exitOnFailure = !process.argv.includes("--no-exit");
  
  console.log("🔍 Testing application connections...\n");
  
  // Step 1: Validate environment variables
  console.log("1️⃣ Validating environment variables...");
  const envValidation = validateConnectionEnv();
  
  if (!envValidation.success) {
    console.error("❌ Environment validation failed:");
    envValidation.errors.forEach(error => console.error(`  - ${error}`));
    if (exitOnFailure) process.exit(1);
  } else {
    console.log("✅ Environment variables are valid");
  }
  
  if (envValidation.warnings.length > 0) {
    console.log("⚠️  Warnings:");
    envValidation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log();
  
  // Step 2: Test actual connections
  console.log("2️⃣ Testing actual connections...");
  const connectionResults = await testAllConnections();
  
  // Database results
  console.log("\n📊 Database Connection:");
  if (connectionResults.database.success) {
    console.log("✅ Database connection successful");
    if (verbose) {
      console.log(`   Details: ${JSON.stringify(connectionResults.database.details, null, 2)}`);
    }
  } else {
    console.error("❌ Database connection failed");
    console.error(`   Error: ${connectionResults.database.error}`);
    if (verbose && connectionResults.database.details) {
      console.error(`   Details: ${JSON.stringify(connectionResults.database.details, null, 2)}`);
    }
  }
  
  // Redis results
  console.log("\n📊 Redis Connection:");
  if (connectionResults.redis.success) {
    console.log("✅ Redis connection successful");
    if (verbose) {
      console.log(`   Details: ${JSON.stringify(connectionResults.redis.details, null, 2)}`);
    }
  } else {
    console.error("❌ Redis connection failed");
    console.error(`   Error: ${connectionResults.redis.error}`);
    if (verbose && connectionResults.redis.details) {
      console.error(`   Details: ${JSON.stringify(connectionResults.redis.details, null, 2)}`);
    }
  }
  
  // Overall results
  console.log("\n📊 Overall Results:");
  if (connectionResults.overall.success) {
    console.log("✅ All connections are working properly");
    console.log("\n🎉 Your application is ready to start!");
  } else {
    console.error("❌ Some connections failed:");
    connectionResults.overall.errors.forEach(error => console.error(`  - ${error}`));
    
    console.error("\n💡 Troubleshooting tips:");
    console.error("  - Make sure Docker services are running:");
    console.error("    docker-compose up db redis");
    console.error("  - Check if ports are available:");
    console.error("    - Database: port 5432");
    console.error("    - Redis: port 6379");
    console.error("  - Verify environment variables in .env file");
    console.error("  - Check Docker logs:");
    console.error("    docker-compose logs db");
    console.error("    docker-compose logs redis");
    
    if (exitOnFailure) {
      process.exit(1);
    }
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Promise Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
