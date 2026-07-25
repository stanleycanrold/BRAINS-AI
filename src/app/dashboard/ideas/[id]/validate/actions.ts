"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  ideas,
  validationCycles,
  interviewPrompts,
  socialEvidence,
  hypotheses,
  surveys,
  surveyQuestions,
  surveyResponses,
  surveyAnswers,
  surveyAnalyses,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validationAgent } from "@/lib/agents";
import { surveyGeneratorAgent } from "@/lib/agents/survey";
import { responseAnalysisAgent } from "@/lib/agents/analysis";
import { buildInterviewPrompts } from "@/lib/ai";

// ─── Start a validation cycle + generate the survey draft ───
export async function startValidationCycle(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;
  const track = formData.get("track") as "slow" | "fast";
  const cycleNumber = parseInt(formData.get("cycleNumber") as string, 10);

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, ideaId)).limit(1);
  if (!idea) throw new Error("Idea not found");

  const [hypothesis] = await db
    .select()
    .from(hypotheses)
    .where(eq(hypotheses.ideaId, ideaId))
    .limit(1);

  // Create the cycle.
  const [cycle] = await db
    .insert(validationCycles)
    .values({ ideaId, cycleNumber, track, status: "running" })
    .returning();

  // Generate the survey draft via the Survey Generator Agent.
  try {
    const generated = await surveyGeneratorAgent({
      hypothesis: hypothesis
        ? {
            problem: hypothesis.problem,
            buyer: hypothesis.buyer,
            promisedChange: hypothesis.promisedChange,
            whyNow: hypothesis.whyNow,
          }
        : { problem: idea.title, buyer: "Unknown", promisedChange: "To be defined" },
      track,
      ideaTitle: idea.title,
    });

    const [survey] = await db
      .insert(surveys)
      .values({
        cycleId: cycle.id,
        ideaId,
        title: generated.title,
        intro: generated.intro,
        status: "draft",
        track,
        outreachMessage: generated.outreachMessage,
        targetCount: generated.targetCount ?? (track === "fast" ? 5 : 10),
      })
      .returning();

    for (let i = 0; i < generated.questions.length; i++) {
      const q = generated.questions[i];
      await db.insert(surveyQuestions).values({
        surveyId: survey.id,
        question: q.question,
        category: q.category,
        order: i,
        isGating: q.isGating ?? false,
        isRequired: q.isRequired ?? true,
      });
    }
  } catch (err) {
    console.error("[startValidationCycle] survey generation failed:", err);
    // Fallback: create an empty survey draft the founder fills manually.
    await db.insert(surveys).values({
      cycleId: cycle.id,
      ideaId,
      title: `${idea.title} — Validation Survey`,
      intro: "We're researching a problem in this space. Your honest answers help us understand if it's real.",
      status: "draft",
      track,
      targetCount: track === "fast" ? 5 : 10,
    });
  }

  await db
    .update(ideas)
    .set({ status: "validating", updatedAt: new Date() })
    .where(eq(ideas.id, ideaId));

  revalidatePath(`/dashboard/ideas/${ideaId}`);
  revalidatePath(`/dashboard/ideas/${ideaId}/validate`);
}

// ─── Update survey (founder edits the draft) ───
export async function updateSurvey(formData: FormData) {
  const surveyId = formData.get("surveyId") as string;
  const title = formData.get("title") as string;
  const intro = formData.get("intro") as string;
  const outreachMessage = formData.get("outreachMessage") as string;
  const targetCount = parseInt(formData.get("targetCount") as string, 10) || 10;

  await db
    .update(surveys)
    .set({ title, intro, outreachMessage, targetCount, updatedAt: new Date() })
    .where(eq(surveys.id, surveyId));

  revalidatePath(`/dashboard/ideas/*/validate`);
}

// ─── Update a single question ───
export async function updateQuestion(formData: FormData) {
  const questionId = formData.get("questionId") as string;
  const question = formData.get("question") as string;
  const category = formData.get("category") as string;

  await db
    .update(surveyQuestions)
    .set({ question, category })
    .where(eq(surveyQuestions.id, questionId));

  revalidatePath(`/dashboard/ideas/*/validate`);
}

// ─── Add a question ───
export async function addQuestion(formData: FormData) {
  const surveyId = formData.get("surveyId") as string;
  const question = formData.get("question") as string;
  const category = (formData.get("category") as string) || "problem";

  const existing = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, surveyId));

  await db.insert(surveyQuestions).values({
    surveyId,
    question,
    category,
    order: existing.length,
    isGating: false,
    isRequired: true,
  });

  revalidatePath(`/dashboard/ideas/*/validate`);
}

// ─── Publish survey (makes it live for respondents) ───
export async function publishSurvey(formData: FormData) {
  const surveyId = formData.get("surveyId") as string;

  await db
    .update(surveys)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(surveys.id, surveyId));

  revalidatePath(`/dashboard/ideas/*/validate`);
  revalidatePath(`/s/${surveyId}`);
}

// ─── Public: submit a survey response ───
export async function submitSurveyResponse(formData: FormData) {
  const surveyId = formData.get("surveyId") as string;
  const respondentName = (formData.get("respondentName") as string) || null;
  const respondentEmail = (formData.get("respondentEmail") as string) || null;
  const isExpert = formData.get("isExpert") === "true";

  // Create the response row.
  const [response] = await db
    .insert(surveyResponses)
    .values({
      surveyId,
      respondentName,
      respondentEmail,
      isExpert,
      isPaid: isExpert, // experts are paid by default in fast track
    })
    .returning();

  // Collect all question answers from the form.
  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, surveyId));

  for (const q of questions) {
    const answer = (formData.get(`q_${q.id}`) as string)?.trim();
    if (answer) {
      await db.insert(surveyAnswers).values({
        responseId: response.id,
        questionId: q.id,
        answer,
      });
    }
  }

  revalidatePath(`/s/${surveyId}`);
  revalidatePath(`/dashboard/ideas/*/validate`);

  redirect("/s/thank-you");
}

// ─── Run the analysis engine on collected responses ───
export async function runAnalysis(formData: FormData) {
  const surveyId = formData.get("surveyId") as string;

  const [survey] = await db.select().from(surveys).where(eq(surveys.id, surveyId)).limit(1);
  if (!survey) throw new Error("Survey not found");

  const [hypothesis] = await db
    .select()
    .from(hypotheses)
    .where(eq(hypotheses.ideaId, survey.ideaId))
    .limit(1);

  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, surveyId));

  const responses = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.surveyId, surveyId));

  if (responses.length === 0) throw new Error("No responses to analyze");

  // Fetch answers for each response.
  const responsesWithAnswers = await Promise.all(
    responses.map(async (r) => {
      const answers = await db
        .select()
        .from(surveyAnswers)
        .where(eq(surveyAnswers.responseId, r.id));
      return {
        id: r.id,
        respondentName: r.respondentName,
        isExpert: r.isExpert,
        answers: answers.map((a) => {
          const q = questions.find((q) => q.id === a.questionId);
          return { questionId: a.questionId, question: q?.question ?? "", answer: a.answer };
        }),
      };
    }),
  );

  // Run the analysis agent.
  const result = await responseAnalysisAgent({
    hypothesis: hypothesis
      ? {
          problem: hypothesis.problem,
          buyer: hypothesis.buyer,
          promisedChange: hypothesis.promisedChange,
          whyNow: hypothesis.whyNow,
        }
      : { problem: survey.title, buyer: "Unknown", promisedChange: "To be defined" },
    track: survey.track,
    questions: questions.map((q) => ({
      id: q.id,
      question: q.question,
      isGating: q.isGating,
    })),
    responses: responsesWithAnswers,
  });

  // Store the analysis.
  await db.insert(surveyAnalyses).values({
    surveyId,
    analysis: result as unknown as Record<string, unknown>,
    gatePassed: result.gatePassed,
    problemExperiencedPct: result.problemExperiencedPct.toString(),
    verdict: result.verdict,
    summary: result.summary,
    recommendation: result.recommendation,
    respondentBreakdown: result.respondentScores as unknown as Record<string, unknown>,
  });

  // Update each response's problemExperienced flag.
  for (const score of result.respondentScores) {
    await db
      .update(surveyResponses)
      .set({ problemExperienced: score.problemExperienced })
      .where(eq(surveyResponses.id, score.responseId));
  }

  // Update the cycle with the verdict.
  await db
    .update(validationCycles)
    .set({
      verdict: result.verdict,
      confidence: result.problemExperiencedPct.toString(),
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(validationCycles.id, survey.cycleId));

  // Update idea status.
  const ideaStatus = result.gatePassed ? "validated" : "iterating";
  await db
    .update(ideas)
    .set({ status: ideaStatus, updatedAt: new Date() })
    .where(eq(ideas.id, survey.ideaId));

  revalidatePath(`/dashboard/ideas/${survey.ideaId}`);
  revalidatePath(`/dashboard/ideas/${survey.ideaId}/validate`);
}

// ─── Generate interview prompts (legacy — still available) ───
export async function generatePrompts(formData: FormData) {
  const ideaId = formData.get("ideaId") as string;
  const problem = formData.get("problem") as string;
  const buyer = formData.get("buyer") as string;
  const promisedChange = formData.get("promisedChange") as string;
  const whyNow = formData.get("whyNow") as string;

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
