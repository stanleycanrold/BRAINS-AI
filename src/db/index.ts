import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// neon() creates an HTTP-based SQL client — no websockets needed.
// Works in serverless (Vercel) and local dev.
// Falls back to a dummy string during build when DATABASE_URL isn't set yet,
// so `next build` doesn't crash collecting page data.
const connectionString = process.env.DATABASE_URL || "postgres://build-placeholder@localhost/db";
const sql = neon(connectionString);
export const db = drizzle({ client: sql, schema });
export { schema };
