import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schemas";

// @ts-ignore - postgres package types issue
const postgres = require("postgres");
const client = postgres(
  process.env.DATABASE_URL || "postgresql://localhost:5432/woragis"
);

export const db = drizzle(client, { schema });

// Re-export schemas and types
export * from "./schemas";
export * from "../../types";
