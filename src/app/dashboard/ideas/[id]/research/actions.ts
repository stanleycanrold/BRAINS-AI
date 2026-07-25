"use server";

import { db } from "@/db";
import { ideas, ideaContextRevisions, researchRuns, researchSuggestions, hypotheses, assumptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Placeholder research — in production this would call web search + AI synthesis.
// For now we generate grounded suggestions from the idea's own context.
export async function runResearch(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;

  const [latestRevision] = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, ideaId))
    .orderBy(desc(ideaContextRevisions.revisionNumber))
    .limit(1);

  if (!latestRevision) throw new Error("No context to research");

  // Create research run
  const [run] = await db
    .insert(researchRuns)
    .values({
      ideaId,
      contextRevisionId: latestRevision.id,
      type: "web",
      status: "completed",
      findings: { source: "context_analysis", timestamp: new Date().toISOString() },
      completedAt: new Date(),
    })
    .returning();

  // Generate suggestions based on context gaps
  const suggestions: Array<{
    suggestion: string;
    rationale: string;
    field: string;
  }> = [];

  if (!latestRevision.targetUser && latestRevision.audience) {
    suggestions.push({
      suggestion: `Add a specific ICP. "${latestRevision.audience}" is broad — narrow it to a segment you can reach directly.`,
      rationale: "A broad audience makes validation hard. You need to find people you can actually interview.",
      field: "targetUser",
    });
  }

  if (!latestRevision.competitors) {
    suggestions.push({
      suggestion: "Research existing solutions in this space. Knowing competitors helps you differentiate and find gaps.",
      rationale: "Without competitive context, you can't tell if the problem is unsolved or just unsolved well.",
      field: "competitors",
    });
  }

  if (latestRevision.solution && !latestRevision.whyNow) {
    suggestions.push({
      suggestion: "Articulate why now. What changed — technology, behavior, regulation — that makes this solvable today?",
      rationale: "Without a 'why now', the problem may have always existed without enough urgency to pay for a solution.",
      field: "whyNow",
    });
  }

  if (latestRevision.problem && latestRevision.problem.length < 100) {
    suggestions.push({
      suggestion: "Expand the problem description with concrete examples. What does the pain look like in practice?",
      rationale: "Vague problems lead to vague validation. Specific examples make interview prompts sharper.",
      field: "problem",
    });
  }

  // Always suggest at least one structural improvement
  if (suggestions.length === 0) {
    suggestions.push({
      suggestion: "Your context is well-structured. Consider running a social scan to find where this problem is discussed online.",
      rationale: "Social evidence complements interviews and shows organic demand.",
      field: "problem",
    });
  }

  for (const s of suggestions) {
    await db.insert(researchSuggestions).values({
      researchRunId: run.id,
      suggestion: s.suggestion,
      rationale: s.rationale,
      status: "proposed",
    });
  }

  // Also create/update a hypothesis from the context
  const existingHypothesis = await db
    .select()
    .from(hypotheses)
    .where(eq(hypotheses.ideaId, ideaId));

  if (existingHypothesis.length === 0 && latestRevision.problem) {
    await db.insert(hypotheses).values({
      ideaId,
      problem: latestRevision.problem,
      buyer: latestRevision.targetUser || latestRevision.audience || "Unknown",
      promisedChange: latestRevision.solution || "To be defined",
      whyNow: latestRevision.whyNow,
    });
  }

  // Update idea status
  await db
    .update(ideas)
    .set({ status: "researching", updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  revalidatePath(`/dashboard/ideas/${ideaId}/research`);
  revalidatePath(`/dashboard/ideas/${ideaId}`);
}
