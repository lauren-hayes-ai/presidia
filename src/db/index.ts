/* eslint-disable @typescript-eslint/no-require-imports */

export const isPostgres = !!process.env.DATABASE_URL;

// Conditionally require the right driver so the unused native module
// (better-sqlite3 on Vercel, postgres locally) is never loaded.

let _db: any;
let _schema: any;

if (isPostgres) {
  const postgres = require("postgres");
  const { drizzle } = require("drizzle-orm/postgres-js");
  const pgSchema = require("./schema.pg");
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  _db = drizzle(client, { schema: pgSchema });
  _schema = pgSchema;
} else {
  const Database = require("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3");
  const sqliteSchema = require("./schema");
  const path = require("path");
  const dbPath = path.join(process.cwd(), "presidia.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  _db = drizzle(sqlite, { schema: sqliteSchema });
  _schema = sqliteSchema;
}

export const db: any = _db;
export const schema: any = _schema;
