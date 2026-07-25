"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/db";
import { ideas, ideaContextRevisions, hypotheses, assumptions } from "@/db/schema";
import { captureAgent } from "@/lib/agents";

/**
 * Create an idea from the landing/dashboard idea-capture box.
 * One field: the raw idea text. BRAINS structures the rest via the capture agent.
 */
export async function createIdeaFromLanding(formData: FormData) {
  const dbUser = await getOrCreateUser();
  if (!dbUser) throw new Error("Not authenticated");

  const ideaText = ((formData.get("idea") as string) ?? "").trim();
  if (!ideaText) throw new Error("Idea is required");

  // Title = first line / first ~90 chars of the raw idea.
  const firstLine = ideaText.split("\n")[0].trim();
  const title = firstLine.length > 90 ? firstLine.slice(0, 90) + "…" : firstLine;

  const [idea] = await db
    .insert(ideas)
    .values({
      userId: dbUser.id,
      title,
      currentStage: "idea",
      status: "captured",
    })
    .returning();

  await db.insert(ideaContextRevisions).values({
    ideaId: idea.id,
    revisionNumber: 1,
    description: ideaText,
    stage: "idea",
  });

  // Run the Capture Agent → structured hypothesis + ranked assumptions.
  // Resilient: if the agent can't run (e.g. no GROQ key in dev), the idea is
  // still saved. The founder can enrich context from the idea detail page.
  try {
    const captured = await captureAgent(ideaText);

    await db.insert(hypotheses).values({
      ideaId: idea.id,
      problem: captured.hypothesis.problem,
      buyer: captured.hypothesis.buyer,
      promisedChange: captured.hypothesis.promisedChange,
      whyNow: captured.hypothesis.whyNow,
    });

    for (const a of captured.assumptions) {
      await db.insert(assumptions).values({
        ideaId: idea.id,
        text: a.text,
        risk: a.risk,
        uncertainty: a.uncertainty,
        rank: a.rank,
      });
    }

    await db
      .update(ideas)
      .set({ status: "captured", updatedAt: new Date() })
      .where(eq(ideas.id, idea.id));
  } catch (err) {
    console.error("[createIdeaFromLanding] capture agent failed:", err);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ideas");
  redirect(`/dashboard/ideas/${idea.id}`);
}
