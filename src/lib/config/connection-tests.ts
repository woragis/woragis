import { db } from "@/server/db/client";
import { env } from "./env";

/**
 * Test database connection and return connection status
 */
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    // Test basic connection with a simple query
    const result = await db.execute("SELECT 1 as test");
    
    if (result && result.length > 0) {
      return {
        success: true,
        details: {
          message: "Database connection successful",
          testQuery: result[0],
          databaseUrl: env.DATABASE_URL.replace(/\/\/.*@/, "//***:***@"), // Hide credentials
        },
      };
    } else {
      return {
        success: false,
        error: "Database query returned no results",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
      details: {
        databaseUrl: env.DATABASE_URL.replace(/\/\/.*@/, "//***:***@"), // Hide credentials
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    };
  }
}

/**
 * Test Redis connection and return connection status
 */
export async function testRedisConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    // For now, we'll create a simple Redis client test
    // This will be enhanced when Redis is actually implemented
    const redis = await import("redis");
    const client = redis.createClient({
      url: env.REDIS_URL,
    });

    await client.connect();
    
    // Test ping
    const pong = await client.ping();
    
    if (pong === "PONG") {
      await client.disconnect();
      return {
        success: true,
        details: {
          message: "Redis connection successful",
          pingResponse: pong,
          redisUrl: env.REDIS_URL.replace(/\/\/.*@/, "//***:***@"), // Hide credentials
        },
      };
    } else {
      await client.disconnect();
      return {
        success: false,
        error: `Unexpected ping response: ${pong}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Redis error",
      details: {
        redisUrl: env.REDIS_URL.replace(/\/\/.*@/, "//***:***@"), // Hide credentials
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    };
  }
}

/**
 * Test all critical connections and return comprehensive status
 */
export async function testAllConnections(): Promise<{
  database: Awaited<ReturnType<typeof testDatabaseConnection>>;
  redis: Awaited<ReturnType<typeof testRedisConnection>>;
  overall: {
    success: boolean;
    errors: string[];
  };
}> {
  const [databaseResult, redisResult] = await Promise.allSettled([
    testDatabaseConnection(),
    testRedisConnection(),
  ]);

  const database = databaseResult.status === "fulfilled" 
    ? databaseResult.value 
    : { success: false, error: "Database test failed to execute" };

  const redis = redisResult.status === "fulfilled" 
    ? redisResult.value 
    : { success: false, error: "Redis test failed to execute" };

  const errors: string[] = [];
  if (!database.success) {
    errors.push(`Database: ${database.error}`);
  }
  if (!redis.success) {
    errors.push(`Redis: ${redis.error}`);
  }

  return {
    database,
    redis,
    overall: {
      success: database.success && redis.success,
      errors,
    },
  };
}

/**
 * Validate environment variables for connections
 */
export function validateConnectionEnv(): {
  success: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Database validation
  if (!env.DATABASE_URL) {
    errors.push("DATABASE_URL is required");
  } else {
    try {
      new URL(env.DATABASE_URL);
    } catch {
      errors.push("DATABASE_URL is not a valid URL");
    }
  }

  // Redis validation
  if (!env.REDIS_URL) {
    errors.push("REDIS_URL is required");
  } else {
    try {
      new URL(env.REDIS_URL);
    } catch {
      errors.push("REDIS_URL is not a valid URL");
    }
  }

  // Check for default values (warnings)
  if (env.DATABASE_URL.includes("localhost:5432") && env.NODE_ENV === "production") {
    warnings.push("Using localhost database in production environment");
  }

  if (env.REDIS_URL.includes("localhost:6379") && env.NODE_ENV === "production") {
    warnings.push("Using localhost Redis in production environment");
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}
