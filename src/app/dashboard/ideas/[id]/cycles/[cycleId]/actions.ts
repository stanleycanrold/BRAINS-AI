"use server";

import { db } from "@/db";
import { validationCycles, verdicts, ideas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calculateVerdict, generateNextSteps } from "@/lib/ai";

export async function generateVerdict(formData: FormData) {
  const cycleId = formData.get("cycleId") as string;
  const ideaId = formData.get("ideaId") as string;
  const track = formData.get("track") as string;
  const weak = parseInt(formData.get("weak") as string, 10);
  const medium = parseInt(formData.get("medium") as string, 10);
  const strong = parseInt(formData.get("strong") as string, 10);

  const { verdict, confidence } = calculateVerdict({ weak, medium, strong });
  const nextSteps = generateNextSteps(verdict, {
    track,
    signalCounts: { weak, medium, strong },
  });

  await db.insert(verdicts).values({
    cycleId,
    verdict,
    confidence: confidence.toString(),
    evidenceSummary: { weak, medium, strong, total: weak + medium + strong },
    signalDistribution: { weak, medium, strong },
    nextSteps,
    releasedAt: new Date(),
  });

  await db
    .update(validationCycles)
    .set({
      status: "completed",
      verdict,
      confidence: confidence.toString(),
      completedAt: new Date(),
    })
    .where(eq(validationCycles.id, cycleId));

  await db
    .update(ideas)
    .set({ status: "validated", updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  revalidatePath(`/dashboard/ideas/${ideaId}/cycles/${cycleId}`);
  revalidatePath(`/dashboard/ideas/${ideaId}`);
}
