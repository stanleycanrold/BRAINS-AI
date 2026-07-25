import { db } from "@/db";
import { ideas, ideaContextRevisions, validationCycles, hypotheses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Target, Zap, Clock, TrendingUp } from "lucide-react";
import { startValidationCycle, generatePrompts } from "./actions";

export default async function ValidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <Target className="h-6 w-6 text-cyan" /> Start validation
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose a track. Run slow first and upgrade to fast later, or go straight to paid interviews.
        </p>
      </div>

      {/* Hypothesis summary */}
      {hypothesis && (
        <div className="card mb-8">
          <h2 className="mb-4 text-sm font-semibold text-text-muted uppercase tracking-wide">
            Your hypothesis
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-text-muted">Problem:</span>{" "}
              <span className="text-text-primary">{hypothesis.problem}</span>
            </div>
            <div>
              <span className="text-text-muted">Buyer:</span>{" "}
              <span className="text-text-primary">{hypothesis.buyer}</span>
            </div>
            <div>
              <span className="text-text-muted">Promised change:</span>{" "}
              <span className="text-text-primary">{hypothesis.promisedChange}</span>
            </div>
          </div>
        </div>
      )}

      {/* Track options */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Slow track */}
        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated">
              <Clock className="h-5 w-5 text-cyan" />
            </div>
            <div>
              <h2 className="font-semibold">Slow track</h2>
              <p className="text-xs text-text-muted">Social listening — free</p>
            </div>
          </div>
          <p className="mb-6 text-sm text-text-secondary">
            BRAINS scans social platforms and web for real discussions about your problem.
            Evidence is scored and clustered. Good for early signal.
          </p>
          <ul className="mb-6 space-y-2 text-xs text-text-secondary">
            <li>✓ Find where the problem is discussed organically</li>
            <li>✓ Score evidence by frequency, intensity, workaround mentions</li>
            <li>✓ Get a directional confidence indicator</li>
          </ul>
          <form action={startValidationCycle}>
            <input type="hidden" name="ideaId" value={id} />
            <input type="hidden" name="track" value="slow" />
            <input type="hidden" name="cycleNumber" value={nextCycleNumber} />
            <button type="submit" className="btn-secondary w-full">
              Start slow track
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
              <p className="text-xs text-text-muted">Paid human interviews — 1-2 weeks</p>
            </div>
          </div>
          <p className="mb-6 text-sm text-text-secondary">
            BRAINS contacts real people from your target audience and runs structured interviews.
            Human analysts review all AI analysis before it ships to you.
          </p>
          <ul className="mb-6 space-y-2 text-xs text-text-secondary">
            <li>✓ Real interviews with target users + niche experts</li>
            <li>✓ Structured notes and signal tagging per interview</li>
            <li>✓ Human-reviewed analysis delivered in 1-2 weeks</li>
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

      {/* Generate interview prompts */}
      {hypothesis && (
        <div className="mt-8 card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">Generate interview prompts</h2>
              <p className="mt-1 text-sm text-text-secondary">
                AI-generated, non-leading prompts based on your hypothesis. Use them for your own interviews or the fast track.
              </p>
            </div>
            <form action={generatePrompts}>
              <input type="hidden" name="ideaId" value={id} />
              <input type="hidden" name="problem" value={hypothesis.problem} />
              <input type="hidden" name="buyer" value={hypothesis.buyer} />
              <input type="hidden" name="promisedChange" value={hypothesis.promisedChange} />
              <input type="hidden" name="whyNow" value={hypothesis.whyNow ?? ""} />
              <button type="submit" className="btn-secondary gap-2">
                <TrendingUp className="h-4 w-4" /> Generate prompts
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Existing cycles */}
      {cycles.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Previous cycles</h2>
          <div className="space-y-3">
            {cycles.map((c) => (
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
    </div>
  );
}
