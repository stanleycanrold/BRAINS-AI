import { db } from "@/db";
import { surveys, surveyQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Brain } from "lucide-react";
import { submitSurveyResponse } from "@/app/dashboard/ideas/[id]/validate/actions";

export const dynamic = "force-dynamic";

export default async function PublicSurveyPage({
  params,
}: {
  params: Promise<{ surveyId: string }>;
}) {
  const { surveyId } = await params;

  const [survey] = await db
    .select()
    .from(surveys)
    .where(eq(surveys.id, surveyId))
    .limit(1);

  if (!survey || survey.status === "draft") notFound();

  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, surveyId))
    .orderBy(surveyQuestions.order);

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Minimal header */}
      <header className="flex items-center gap-2 px-6 py-5">
        <Brain className="h-5 w-5 text-cyan" />
        <span className="font-bold tracking-tight">
          <span className="text-cyan">BRAINS</span>
          <span className="text-text-muted"> AI</span>
        </span>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-bold">{survey.title}</h1>
        {survey.intro && (
          <p className="mt-3 text-text-secondary">{survey.intro}</p>
        )}

        {survey.status === "closed" ? (
          <div className="mt-8 card text-center">
            <p className="text-text-secondary">This survey is now closed. Thank you to everyone who participated.</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="mt-8 card text-center">
            <p className="text-text-secondary">This survey has no questions yet.</p>
          </div>
        ) : (
          <form action={submitSurveyResponse} className="mt-8 space-y-8">
            <input type="hidden" name="surveyId" value={survey.id} />
            <input type="hidden" name="isExpert" value={survey.track === "fast" ? "true" : "false"} />

            {/* Optional name/email */}
            <div className="card space-y-4">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">About you (optional)</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name</label>
                  <input name="respondentName" className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input name="respondentEmail" type="email" className="input-field" placeholder="you@example.com" />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={q.id} className="card space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-elevated text-xs text-text-muted">
                      {i + 1}
                    </span>
                    {q.isGating && (
                      <span className="rounded-full border border-cyan/40 bg-cyan/10 px-2 py-0.5 text-xs text-cyan">
                        Key question
                      </span>
                    )}
                    {q.isRequired && <span className="text-xs text-pink">*</span>}
                  </div>
                  <label className="text-sm font-medium text-text-primary">{q.question}</label>
                  <textarea
                    name={`q_${q.id}`}
                    required={q.isRequired}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Your honest answer…"
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary w-full gap-2">
              Submit responses
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
