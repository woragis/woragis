import { config } from "dotenv";

// Load environment variables from .env file
config();

export const env = {
  // Database
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/portfolio",
  POSTGRES_DB: process.env.POSTGRES_DB || "portfolio",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "password",
  POSTGRES_PORT: process.env.POSTGRES_PORT || "5432",

  // Redis
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // Next.js
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // App Configuration
  PORT: process.env.PORT || "3000",
} as const;

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL"] as const;

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default env;
