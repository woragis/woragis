import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schemas";
import { env } from "@/lib/env";

import postgres from "postgres";
const client = postgres(env.DATABASE_URL, {
  // Configure timestamp handling
  transform: {
    undefined: null,
  },
  // Ensure proper date handling
  types: {
    bigint: postgres.BigInt,
    date: {
      to: 1082,
      from: [1082],
      serialize: (x: any) => x,
      parse: (x: any) => x,
    },
    timestamp: {
      to: 1114,
      from: [1114],
      serialize: (x: any) => x,
      parse: (x: any) => x,
    },
  },
});

export const db = drizzle(client, { schema });
