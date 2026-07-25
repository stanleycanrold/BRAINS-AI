import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// neon() creates an HTTP-based SQL client — no websockets needed.
// Works in serverless (Vercel) and local dev.
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
export { schema };
