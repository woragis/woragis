import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schemas";
import { env } from "@/lib/env";

// @ts-ignore - postgres package types issue
const postgres = require("postgres");
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

// Re-export schemas and types
export * from "./schemas";
