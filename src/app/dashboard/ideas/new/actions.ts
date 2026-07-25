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

  if (existing.length > 0) return existing[0];

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
  const description = formData.get("description") as string;
  const productDesc = formData.get("productDesc") as string;
  const stage = formData.get("stage") as "idea" | "prototype" | "live_product";
  const targetUser = formData.get("targetUser") as string;
  const problem = formData.get("problem") as string;
  const audience = formData.get("audience") as string;
  const solution = formData.get("solution") as string;
  const whyNow = formData.get("whyNow") as string;
  const traction = formData.get("traction") as string;
  const competitors = formData.get("competitors") as string;
  const websiteUrl = formData.get("websiteUrl") as string;
  const repoUrl = formData.get("repoUrl") as string;

  const assets: Record<string, string> = {};
  if (websiteUrl) assets.website = websiteUrl;
  if (repoUrl) assets.repo = repoUrl;

  const [idea] = await db
    .insert(ideas)
    .values({
      userId: dbUser.id,
      title,
      currentStage: stage || "idea",
      status: "captured",
    })
    .returning();

  await db.insert(ideaContextRevisions).values({
    ideaId: idea.id,
    revisionNumber: 1,
    description,
    productDesc,
    stage: stage || "idea",
    targetUser,
    problem,
    audience,
    solution,
    whyNow,
    traction,
    competitors,
    assets: Object.keys(assets).length > 0 ? assets : null,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ideas");
}

export async function updateIdeaContext(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const ideaId = formData.get("ideaId") as string;
  const description = formData.get("description") as string;
  const productDesc = formData.get("productDesc") as string;
  const stage = formData.get("stage") as "idea" | "prototype" | "live_product";
  const targetUser = formData.get("targetUser") as string;
  const problem = formData.get("problem") as string;
  const audience = formData.get("audience") as string;
  const solution = formData.get("solution") as string;
  const whyNow = formData.get("whyNow") as string;
  const traction = formData.get("traction") as string;
  const competitors = formData.get("competitors") as string;

  // Get current revision count
  const existing = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, ideaId));

  const nextRevision = existing.length + 1;

  await db.insert(ideaContextRevisions).values({
    ideaId,
    revisionNumber: nextRevision,
    description,
    productDesc,
    stage: stage || "idea",
    targetUser,
    problem,
    audience,
    solution,
    whyNow,
    traction,
    competitors,
  });

  // Update idea status to iterating
  await db
    .update(ideas)
    .set({ status: "iterating", currentStage: stage || "idea", updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  revalidatePath(`/dashboard/ideas/${ideaId}`);
}
