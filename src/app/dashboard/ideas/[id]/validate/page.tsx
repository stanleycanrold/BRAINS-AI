import { db } from "@/db";
import {
  ideas,
  validationCycles,
  hypotheses,
  surveys,
  surveyQuestions,
  surveyResponses,
  surveyAnalyses,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Target, Zap, Clock } from "lucide-react";
import { headers } from "next/headers";
import { SurveyWorkspace } from "@/components/survey-workspace";
import { startValidationCycle } from "./actions";

export default async function ValidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headerList = await headers();
  const origin = headerList.get("x-forwarded-host")
    ? `https://${headerList.get("x-forwarded-host")}`
    : headerList.get("host")
      ? `https://${headerList.get("host")}`
      : "http://localhost:3000";

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  if (!idea) notFound();

  const [hypothesis] = await db
    .select()
    .from(hypotheses)
    .where(eq(hypotheses.ideaId, id))
    .limit(1);

  const cycles = await db
    .select()
    .from(validationCycles)
    .where(eq(validationCycles.ideaId, id))
    .orderBy(desc(validationCycles.cycleNumber));

  const nextCycleNumber = (cycles[0]?.cycleNumber ?? 0) + 1;
  const latestCycle = cycles[0];

  // Load the latest cycle's survey (if any).
  let survey: typeof surveys.$inferSelect | null = null;
  let questions: (typeof surveyQuestions.$inferSelect)[] = [];
  let responseCount = 0;
  let analysis: (typeof surveyAnalyses.$inferSelect)[] = [];

  if (latestCycle) {
    const [s] = await db
      .select()
      .from(surveys)
      .where(eq(surveys.cycleId, latestCycle.id))
      .limit(1);

    if (s) {
      survey = s;
      questions = await db
        .select()
        .from(surveyQuestions)
        .where(eq(surveyQuestions.surveyId, s.id))
        .orderBy(surveyQuestions.order);

      const responses = await db
        .select()
        .from(surveyResponses)
        .where(eq(surveyResponses.surveyId, s.id));
      responseCount = responses.length;

      analysis = await db
        .select()
        .from(surveyAnalyses)
        .where(eq(surveyAnalyses.surveyId, s.id))
        .orderBy(desc(surveyAnalyses.createdAt));
    }
  }

  const latestAnalysis = analysis[0] ?? null;

  return (
    <div>
      <Link
        href={`/dashboard/ideas/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to idea
      </Link>

      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Target className="h-6 w-6 text-cyan" /> Validation
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          BRAINS generates the survey, you edit it, we collect responses and analyze them.
        </p>
      </div>

      {/* Hypothesis */}
      {hypothesis && (
        <div className="card mb-8">
          <h2 className="mb-3 text-sm font-semibold text-text-muted uppercase tracking-wide">
            Hypothesis being validated
          </h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-text-muted">Problem:</span> <span className="text-text-primary">{hypothesis.problem}</span></div>
            <div><span className="text-text-muted">Buyer:</span> <span className="text-text-primary">{hypothesis.buyer}</span></div>
            <div><span className="text-text-muted">Promised change:</span> <span className="text-text-primary">{hypothesis.promisedChange}</span></div>
          </div>
        </div>
      )}

      {/* If there's an active survey, show the workspace */}
      {survey ? (
        <SurveyWorkspace
          survey={survey}
          questions={questions}
          responseCount={responseCount}
          analysis={latestAnalysis}
          origin={origin}
        />
      ) : (
        /* No active cycle → track selection */
        <div className="grid gap-6 md:grid-cols-2">
          {/* Normal track */}
          <div className="card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated">
                <Clock className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <h2 className="font-semibold">Normal track</h2>
                <p className="text-xs text-text-muted">Free / organic — target ≥10 responses</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-text-secondary">
              BRAINS generates a problem-focused survey. You share the link, collect responses
              organically, and the analysis engine runs the ≥50% gate.
            </p>
            <ul className="mb-6 space-y-2 text-xs text-text-secondary">
              <li>✓ Auto-generated, editable questionnaire</li>
              <li>✓ Shareable link for respondents</li>
              <li>✓ Analysis engine + ≥50% decision gate</li>
              <li>✓ Re-run in a new cycle if the gate fails</li>
            </ul>
            <form action={startValidationCycle}>
              <input type="hidden" name="ideaId" value={id} />
              <input type="hidden" name="track" value="slow" />
              <input type="hidden" name="cycleNumber" value={nextCycleNumber} />
              <button type="submit" className="btn-secondary w-full">
                Start normal track
              </button>
            </form>
          </div>

          {/* Fast track */}
          <div className="card border-cyan/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/10">
                <Zap className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <h2 className="font-semibold">Fast track</h2>
                <p className="text-xs text-text-muted">Paid niche experts — ~5 responses</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-text-secondary">
              BRAINS generates a focused survey. You hire niche experts to fill it (paid, ~1hr),
              and the analysis engine runs the same ≥50% gate.
            </p>
            <ul className="mb-6 space-y-2 text-xs text-text-secondary">
              <li>✓ Focused, high-signal questionnaire</li>
              <li>✓ Expert responses flagged as paid</li>
              <li>✓ Analysis engine + ≥50% decision gate</li>
              <li>✓ Re-run in a new cycle if the gate fails</li>
            </ul>
            <form action={startValidationCycle}>
              <input type="hidden" name="ideaId" value={id} />
              <input type="hidden" name="track" value="fast" />
              <input type="hidden" name="cycleNumber" value={nextCycleNumber} />
              <button type="submit" className="btn-primary w-full">
                Start fast track
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Previous cycles */}
      {cycles.length > 1 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Previous cycles</h2>
          <div className="space-y-3">
            {cycles.slice(1).map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/ideas/${id}/cycles/${c.id}`}
                className="card-elevated flex items-center justify-between transition-colors hover:border-cyan-muted"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-base text-sm font-bold text-cyan">
                    {c.cycleNumber}
                  </span>
                  <span className="text-sm font-medium capitalize">{c.track} track</span>
                </div>
                <div className="flex items-center gap-3">
                  {c.verdict && (
                    <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-0.5 text-xs text-cyan">
                      {c.verdict.replace(/_/g, " ")}
                    </span>
                  )}
                  <span className="text-xs text-text-muted">{c.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Re-run option (if latest cycle is completed) */}
      {latestCycle?.status === "completed" && (
        <div className="mt-8 card flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Re-run validation</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Start a new cycle with a revised survey. The old cycle is preserved.
            </p>
          </div>
          <form action={startValidationCycle}>
            <input type="hidden" name="ideaId" value={id} />
            <input type="hidden" name="track" value={latestCycle.track} />
            <input type="hidden" name="cycleNumber" value={nextCycleNumber} />
            <button type="submit" className="btn-primary gap-2">
              <Target className="h-4 w-4" /> New cycle
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
