import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  // driver: 'better-sqlite3',
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/dev.db'
  },
  verbose: true,
  strict: true
});
