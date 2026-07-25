"use server";

import { db } from "@/db";
import {
  ideas,
  validationCycles,
  interviewPrompts,
  socialEvidence,
  hypotheses,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { buildInterviewPrompts } from "@/lib/ai";

export async function startValidationCycle(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;
  const track = formData.get("track") as "slow" | "fast";
  const cycleNumber = parseInt(formData.get("cycleNumber") as string, 10);

  // Get latest context revision
  const [latestRevision] = await db
    .select()
    .from(ideas)
    .where(eq(ideas.id, ideaId))
    .limit(1);

  const [cycle] = await db
    .insert(validationCycles)
    .values({
      ideaId,
      cycleNumber,
      track,
      status: "running",
    })
    .returning();

  // For slow track, seed some placeholder social evidence
  // (in production this would call social listening APIs)
  if (track === "slow") {
    const [hypothesis] = await db
      .select()
      .from(hypotheses)
      .where(eq(hypotheses.ideaId, ideaId))
      .limit(1);

    if (hypothesis) {
      // Placeholder evidence — real implementation would scan platforms
      await db.insert(socialEvidence).values([
        {
          cycleId: cycle.id,
          platform: "reddit",
          url: "https://reddit.com/r/example",
          excerpt: "Users discussing the problem space (placeholder — real scan pending integration)",
          signalStrength: "medium",
          sentiment: "frustrated",
          clusterTag: "problem_awareness",
        },
        {
          cycleId: cycle.id,
          platform: "twitter",
          url: "https://twitter.com/example",
          excerpt: "Twitter threads mentioning the pain point (placeholder — real scan pending integration)",
          signalStrength: "weak",
          sentiment: "neutral",
          clusterTag: "casual_mentions",
        },
      ]);
    }
  }

  await db
    .update(ideas)
    .set({ status: "validating", updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  revalidatePath(`/dashboard/ideas/${ideaId}`);
  revalidatePath(`/dashboard/ideas/${ideaId}/validate`);
}

export async function generatePrompts(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;
  const problem = formData.get("problem") as string;
  const buyer = formData.get("buyer") as string;
  const promisedChange = formData.get("promisedChange") as string;
  const whyNow = formData.get("whyNow") as string;

  const prompts = buildInterviewPrompts({ problem, buyer, promisedChange, whyNow: whyNow || undefined });

  // Clear existing prompts for this idea
  const existing = await db
    .select()
    .from(interviewPrompts)
    .where(eq(interviewPrompts.ideaId, ideaId));

  // Insert new prompts
  for (let i = 0; i < prompts.length; i++) {
    await db.insert(interviewPrompts).values({
      ideaId,
      prompt: prompts[i].prompt,
      category: prompts[i].category,
      order: i,
    });
  }

  revalidatePath(`/dashboard/ideas/${ideaId}`);
  revalidatePath(`/dashboard/ideas/${ideaId}/validate`);
}
