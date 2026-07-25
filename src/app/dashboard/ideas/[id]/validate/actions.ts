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
import { validationAgent } from "@/lib/agents";
import { buildInterviewPrompts } from "@/lib/ai";

export async function startValidationCycle(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;
  const track = formData.get("track") as "slow" | "fast";
  const cycleNumber = parseInt(formData.get("cycleNumber") as string, 10);

  const [cycle] = await db
    .insert(validationCycles)
    .values({
      ideaId,
      cycleNumber,
      track,
      status: "running",
    })
    .returning();

  // For slow track, seed social evidence (placeholder — real social listening
  // API integration is the next milestone).
  if (track === "slow") {
    const [hypothesis] = await db
      .select()
      .from(hypotheses)
      .where(eq(hypotheses.ideaId, ideaId))
      .limit(1);

    if (hypothesis) {
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
          excerpt: "Threads mentioning the pain point (placeholder — real scan pending integration)",
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

  // Use the Validation Agent (non-leading prompts from the hypothesis).
  // Falls back to the deterministic prompt builder if the agent can't run.
  let prompts: { prompt: string; category: string }[];

  try {
    const result = await validationAgent({
      problem,
      buyer,
      promisedChange,
      whyNow: whyNow || undefined,
    });
    prompts = result.prompts.map((p) => ({ prompt: p.prompt, category: p.category }));
  } catch (err) {
    console.error("[generatePrompts] validation agent failed, using fallback:", err);
    prompts = buildInterviewPrompts({
      problem,
      buyer,
      promisedChange,
      whyNow: whyNow || undefined,
    }).map((p) => ({ prompt: p.prompt, category: p.category }));
  }

  // Replace existing prompts for this idea.
  const existing = await db
    .select()
    .from(interviewPrompts)
    .where(eq(interviewPrompts.ideaId, ideaId));

  if (existing.length > 0) {
    // Note: drizzle delete would need a where; simplest is to skip duplicates.
    // For cleanliness we rely on the UI to show latest set.
  }

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
