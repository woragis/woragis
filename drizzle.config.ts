import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables
config();

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:password@localhost:5432/portfolio",
  },
} satisfies Config;
