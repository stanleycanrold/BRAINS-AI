export const dynamic = "force-dynamic";

import { db } from "@/db";
import {
  ideas,
  ideaContextRevisions,
  researchRuns,
  researchSuggestions,
  validationCycles,
  verdicts,
  hypotheses,
  assumptions,
  interviewPrompts,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History, FlaskConical, Target, MessageSquare, TrendingUp, FileSearch } from "lucide-react";

const verdictColors: Record<string, string> = {
  strong_yes: "text-cyan border-cyan/40 bg-cyan/10",
  lean_yes: "text-cyan border-cyan/30 bg-cyan/5",
  mixed: "text-text-secondary border-bg-border bg-bg-elevated",
  lean_no: "text-pink border-pink/30 bg-pink/5",
  strong_no: "text-pink border-pink/40 bg-pink/10",
};

const verdictLabels: Record<string, string> = {
  strong_yes: "Strong Yes",
  lean_yes: "Lean Yes",
  mixed: "Mixed",
  lean_no: "Lean No",
  strong_no: "Strong No",
};

const stageLabels: Record<string, string> = {
  idea: "💡 Idea",
  prototype: "🔨 Prototype",
  live_product: "🚀 Live",
};

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  if (!idea) notFound();

  const [latestRevision, revisions, runs, cycles, hypothesisList, assumptionList, promptList] =
    await Promise.all([
      db
        .select()
        .from(ideaContextRevisions)
        .where(eq(ideaContextRevisions.ideaId, id))
        .orderBy(desc(ideaContextRevisions.revisionNumber))
        .limit(1),
      db
        .select()
        .from(ideaContextRevisions)
        .where(eq(ideaContextRevisions.ideaId, id))
        .orderBy(desc(ideaContextRevisions.revisionNumber)),
      db.select().from(researchRuns).where(eq(researchRuns.ideaId, id)),
      db
        .select()
        .from(validationCycles)
        .where(eq(validationCycles.ideaId, id))
        .orderBy(desc(validationCycles.cycleNumber)),
      db.select().from(hypotheses).where(eq(hypotheses.ideaId, id)),
      db.select().from(assumptions).where(eq(assumptions.ideaId, id)),
      db.select().from(interviewPrompts).where(eq(interviewPrompts.ideaId, id)),
    ]);

  const ctx = latestRevision[0];
  const latestCycle = cycles[0];

  return (
    <div>
      <Link
        href="/dashboard/ideas"
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to ideas
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{idea.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-text-muted">
              {stageLabels[idea.currentStage] ?? idea.currentStage}
            </span>
            <span className="rounded-full border border-bg-border px-3 py-0.5 text-xs text-text-muted">
              {idea.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto">
        {[
          { key: "capture", label: "Capture", icon: FileSearch, done: true },
          { key: "research", label: "Research", icon: FlaskConical, done: runs.length > 0 },
          { key: "validate", label: "Validate", icon: Target, done: cycles.length > 0 },
          { key: "verdict", label: "Verdict", icon: TrendingUp, done: !!latestCycle?.verdict },
        ].map((step, i) => (
          <div key={step.key} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                step.done
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-bg-border bg-bg-surface text-text-muted"
              }`}
            >
              <step.icon className="h-3.5 w-3.5" />
              {step.label}
            </div>
            {i < 3 && <div className="h-px w-6 bg-bg-border" />}
          </div>
        ))}
      </div>

      {/* Context */}
      {ctx && (
        <div className="grid gap-4 md:grid-cols-2">
          {ctx.description && (
            <div className="card md:col-span-2">
              <h3 className="mb-2 text-sm font-medium text-text-muted">The idea</h3>
              <p className="text-text-primary">{ctx.description}</p>
            </div>
          )}
          {ctx.problem && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Problem</h3>
              <p className="text-sm text-text-primary">{ctx.problem}</p>
            </div>
          )}
          {ctx.audience && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Audience</h3>
              <p className="text-sm text-text-primary">{ctx.audience}</p>
            </div>
          )}
          {ctx.targetUser && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Target user (ICP)</h3>
              <p className="text-sm text-text-primary">{ctx.targetUser}</p>
            </div>
          )}
          {ctx.solution && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Solution hypothesis</h3>
              <p className="text-sm text-text-primary">{ctx.solution}</p>
            </div>
          )}
          {ctx.whyNow && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Why now</h3>
              <p className="text-sm text-text-primary">{ctx.whyNow}</p>
            </div>
          )}
          {ctx.productDesc && (
            <div className="card md:col-span-2">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Product description</h3>
              <p className="text-sm text-text-primary">{ctx.productDesc}</p>
            </div>
          )}
          {ctx.traction && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Traction</h3>
              <p className="text-sm text-text-primary">{ctx.traction}</p>
            </div>
          )}
          {ctx.competitors && (
            <div className="card">
              <h3 className="mb-2 text-sm font-medium text-text-muted">Competitors</h3>
              <p className="text-sm text-text-primary">{ctx.competitors}</p>
            </div>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/ideas/${id}/research`}
          className="btn-secondary gap-2"
        >
          <FlaskConical className="h-4 w-4" /> Run research
        </Link>
        <Link
          href={`/dashboard/ideas/${id}/validate`}
          className="btn-primary gap-2"
        >
          <Target className="h-4 w-4" /> Start validation
        </Link>
      </div>

      {/* Hypothesis */}
      {hypothesisList.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Hypothesis</h2>
          {hypothesisList.map((h) => (
            <div key={h.id} className="card-elevated space-y-3">
              <div>
                <span className="text-xs text-text-muted">Problem</span>
                <p className="text-sm text-text-primary">{h.problem}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted">Buyer</span>
                <p className="text-sm text-text-primary">{h.buyer}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted">Promised change</span>
                <p className="text-sm text-text-primary">{h.promisedChange}</p>
              </div>
              {h.whyNow && (
                <div>
                  <span className="text-xs text-text-muted">Why now</span>
                  <p className="text-sm text-text-primary">{h.whyNow}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assumptions */}
      {assumptionList.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Ranked assumptions</h2>
          <div className="space-y-3">
            {assumptionList
              .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
              .map((a) => (
                <div key={a.id} className="card-elevated flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-base text-xs text-text-muted">
                      {a.rank ?? "?"}
                    </span>
                    <p className="text-sm text-text-primary">{a.text}</p>
                  </div>
                  <span className="ml-4 rounded-full border border-bg-border px-3 py-0.5 text-xs text-text-muted">
                    {a.risk} risk
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Interview prompts */}
      {promptList.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5 text-cyan" />
            Interview prompts
          </h2>
          <div className="space-y-3">
            {promptList
              .sort((a, b) => a.order - b.order)
              .map((p) => (
                <div key={p.id} className="card-elevated">
                  {p.category && (
                    <span className="mb-2 block text-xs text-cyan">{p.category}</span>
                  )}
                  <p className="text-sm text-text-primary">{p.prompt}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Research runs */}
      {runs.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FlaskConical className="h-5 w-5 text-cyan" />
            Research runs
          </h2>
          <div className="space-y-3">
            {runs.map((r) => (
              <div key={r.id} className="card-elevated flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-text-primary capitalize">{r.type}</span>
                  <span className="ml-3 text-xs text-text-muted">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`rounded-full border px-3 py-0.5 text-xs ${
                  r.status === "completed"
                    ? "border-cyan/40 text-cyan"
                    : "border-bg-border text-text-muted"
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation cycles */}
      {cycles.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Target className="h-5 w-5 text-cyan" />
            Validation cycles
          </h2>
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
                  <div>
                    <span className="text-sm font-medium text-text-primary capitalize">
                      {c.track} track
                    </span>
                    <span className="ml-3 text-xs text-text-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {c.verdict && (
                    <span className={`rounded-full border px-3 py-0.5 text-xs ${verdictColors[c.verdict]}`}>
                      {verdictLabels[c.verdict]}
                    </span>
                  )}
                  <span className="text-xs text-text-muted">{c.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Context history */}
      {revisions.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5 text-cyan" />
            Context history ({revisions.length})
          </h2>
          <div className="space-y-3">
            {revisions.map((rev) => (
              <div key={rev.id} className="card-elevated flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-cyan">v{rev.revisionNumber}</span>
                  <span className="ml-3 text-sm text-text-secondary">
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
