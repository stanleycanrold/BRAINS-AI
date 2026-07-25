"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { ideas, ideaContextRevisions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getOrCreateUser(clerkId: string, email?: string, name?: string) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [created] = await db
    .insert(users)
    .values({ clerkId, email, name })
    .returning();
  return created;
}

export async function createIdea(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const dbUser = await getOrCreateUser(
    user.id,
    user.emailAddresses[0]?.emailAddress,
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
  );

  const title = formData.get("title") as string;
  const problem = formData.get("problem") as string;
  const audience = formData.get("audience") as string;
  const solution = formData.get("solution") as string;
  const whyNow = formData.get("whyNow") as string;

  const [idea] = await db
    .insert(ideas)
    .values({
      userId: dbUser.id,
      title,
      problem,
      audience,
      solution,
      whyNow,
      status: "draft",
    })
    .returning();

  // Create the first context revision (revision #1)
  await db.insert(ideaContextRevisions).values({
    ideaId: idea.id,
    revisionNumber: 1,
    problem,
    audience,
    solution,
    whyNow,
    metadata: { source: "initial_capture" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ideas");
}
