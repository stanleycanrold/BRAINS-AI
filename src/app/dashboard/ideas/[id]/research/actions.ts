"use server";

import { db } from "@/db";
import {
  ideas,
  ideaContextRevisions,
  researchRuns,
  researchSuggestions,
  hypotheses,
  assumptions,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { researchAgent } from "@/lib/agents";

// Research & idea strengthening — now powered by the Research Agent.
// Falls back to context-gap heuristics if the agent can't run (no key / error).
export async function runResearch(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;

  const [latestRevision] = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, ideaId))
    .orderBy(desc(ideaContextRevisions.revisionNumber))
    .limit(1);

  if (!latestRevision) throw new Error("No context to research");

  const context = {
    description: latestRevision.description,
    productDesc: latestRevision.productDesc,
    stage: latestRevision.stage,
    targetUser: latestRevision.targetUser,
    problem: latestRevision.problem,
    audience: latestRevision.audience,
    solution: latestRevision.solution,
    whyNow: latestRevision.whyNow,
    traction: latestRevision.traction,
    competitors: latestRevision.competitors,
  };

  let findings: unknown = { source: "ai_research_agent", timestamp: new Date().toISOString() };
  let suggestions: Array<{
    suggestion: string;
    rationale: string;
    field: string;
    sourceUrl?: string;
  }> = [];

  try {
    const result = await researchAgent(context);
    findings = {
      source: "ai_research_agent",
      summary: result.summary,
      findings: result.findings,
      timestamp: new Date().toISOString(),
    };
    suggestions = result.suggestions.map((s) => ({
      suggestion: s.suggestion,
      rationale: s.rationale,
      field: s.field,
      sourceUrl: s.sourceUrl,
    }));
  } catch (err) {
    console.error("[runResearch] research agent failed, using fallback:", err);
    // Fallback: context-gap heuristics (the original logic).
    if (!latestRevision.targetUser && latestRevision.audience) {
      suggestions.push({
        suggestion: `Add a specific ICP. "${latestRevision.audience}" is broad — narrow it to a segment you can reach directly.`,
        rationale: "A broad audience makes validation hard. You need people you can actually interview.",
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
    if (suggestions.length === 0) {
      suggestions.push({
        suggestion: "Your context is well-structured. Consider running a social scan to find where this problem is discussed online.",
        rationale: "Social evidence complements interviews and shows organic demand.",
        field: "problem",
      });
    }
  }

  const [run] = await db
    .insert(researchRuns)
    .values({
      ideaId,
      contextRevisionId: latestRevision.id,
      type: "web",
      status: "completed",
      findings: findings as Record<string, unknown>,
      completedAt: new Date(),
    })
    .returning();

  for (const s of suggestions) {
    await db.insert(researchSuggestions).values({
      researchRunId: run.id,
      suggestion: s.suggestion,
      rationale: s.rationale,
      sourceUrl: s.sourceUrl,
      status: "proposed",
    });
  }

  // Create a hypothesis from the context if none exists yet.
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

  await db
    .update(ideas)
    .set({ status: "researching", updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  revalidatePath(`/dashboard/ideas/${ideaId}/research`);
  revalidatePath(`/dashboard/ideas/${ideaId}`);
}
