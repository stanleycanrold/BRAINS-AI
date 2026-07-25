import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type DbUser = typeof users.$inferSelect;

/** Resolve the Clerk user to a BRAINS db user row, creating it if missing. */
export async function getOrCreateUser(): Promise<DbUser | null> {
  const user = await currentUser();
  if (!user) return null;

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(users)
    .values({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name:
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
    })
    .returning();
  return created;
}
