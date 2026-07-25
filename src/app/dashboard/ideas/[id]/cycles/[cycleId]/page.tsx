export const dynamic = "force-dynamic";

import { db } from "@/db";
import {
  ideas,
  validationCycles,
  socialEvidence,
  fastTrackOrders,
  interviews,
  verdicts,
  ideaContextRevisions,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Target, TrendingUp, Users, FileText, Sparkles, BarChart3 } from "lucide-react";
import { generateVerdict } from "./actions";

const verdictConfig: Record<string, { label: string; color: string; bg: string }> = {
  strong_yes: { label: "Strong Yes", color: "text-cyan", bg: "border-cyan/40 bg-cyan/10" },
  lean_yes: { label: "Lean Yes", color: "text-cyan", bg: "border-cyan/30 bg-cyan/5" },
  mixed: { label: "Mixed", color: "text-text-secondary", bg: "border-bg-border bg-bg-elevated" },
  lean_no: { label: "Lean No", color: "text-pink", bg: "border-pink/30 bg-pink/5" },
  strong_no: { label: "Strong No", color: "text-pink", bg: "border-pink/40 bg-pink/10" },
};

export default async function CycleDetailPage({
  params,
}: {
  params: Promise<{ id: string; cycleId: string }>;
}) {
  const { id, cycleId } = await params;

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  if (!idea) notFound();

  const [cycle] = await db
    .select()
    .from(validationCycles)
    .where(eq(validationCycles.id, cycleId))
    .limit(1);
  if (!cycle) notFound();

  const [evidence, order, verdict, latestRevision] = await Promise.all([
    db.select().from(socialEvidence).where(eq(socialEvidence.cycleId, cycleId)),
    db.select().from(fastTrackOrders).where(eq(fastTrackOrders.cycleId, cycleId)).limit(1),
    db.select().from(verdicts).where(eq(verdicts.cycleId, cycleId)).limit(1),
    db
      .select()
      .from(ideaContextRevisions)
      .where(eq(ideaContextRevisions.ideaId, id))
      .orderBy(desc(ideaContextRevisions.revisionNumber))
      .limit(1),
  ]);

  const interviewList = order[0]
    ? await db.select().from(interviews).where(eq(interviews.orderId, order[0].id))
    : [];

  // Calculate signal distribution
  const signalCounts = { weak: 0, medium: 0, strong: 0 };
  evidence.forEach((e) => {
    if (e.signalStrength) signalCounts[e.signalStrength]++;
  });
  interviewList.forEach((i) => {
    if (i.signalStrength) signalCounts[i.signalStrength]++;
  });
  const totalSignals = signalCounts.weak + signalCounts.medium + signalCounts.strong;

  const vc = verdict[0]?.verdict ? verdictConfig[verdict[0].verdict] : null;
  const nextSteps = verdict[0]?.nextSteps as string[] | null;

  return (
    <div>
      <Link
        href={`/dashboard/ideas/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to idea
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Target className="h-6 w-6 text-cyan" />
            Cycle {cycle.cycleNumber}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-text-muted capitalize">{cycle.track} track</span>
            <span className="rounded-full border border-bg-border px-3 py-0.5 text-xs text-text-muted">
              {cycle.status}
            </span>
          </div>
        </div>
      </div>

      {/* Verdict banner */}
      {vc && verdict[0] && (
        <div className={`mb-8 rounded-xl border p-6 ${vc.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Verdict</p>
              <p className={`mt-1 text-2xl font-bold ${vc.color}`}>{vc.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-text-muted">Confidence</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {verdict[0].confidence}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signal distribution */}
      <div className="card mb-8">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5 text-cyan" /> Signal distribution
        </h2>
        {totalSignals > 0 ? (
          <div className="space-y-3">
            {(["strong", "medium", "weak"] as const).map((level) => {
              const count = signalCounts[level];
              const pct = Math.round((count / totalSignals) * 100);
              const colors = {
                strong: "bg-cyan",
                medium: "bg-text-secondary",
                weak: "bg-text-muted",
              };
              return (
                <div key={level} className="flex items-center gap-4">
                  <span className="w-16 text-sm capitalize text-text-secondary">{level}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-bg-base">
                    <div
                      className={`h-6 rounded-full ${colors[level]} transition-all`}
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm text-text-primary">{count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No signals collected yet.</p>
        )}
      </div>

      {/* Evidence */}
      {evidence.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5 text-cyan" /> Social evidence
          </h2>
          <div className="space-y-3">
            {evidence.map((e) => (
              <div key={e.id} className="card-elevated">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {e.platform && (
                      <span className="text-xs text-cyan capitalize">{e.platform}</span>
                    )}
                    <p className="mt-1 text-sm text-text-primary">{e.excerpt}</p>
                    {e.clusterTag && (
                      <span className="mt-2 inline-block rounded-full bg-bg-base px-2 py-0.5 text-xs text-text-muted">
                        {e.clusterTag}
                      </span>
                    )}
                  </div>
                  <span className={`ml-4 rounded-full border px-2 py-0.5 text-xs ${
                    e.signalStrength === "strong"
                      ? "border-cyan/40 text-cyan"
                      : e.signalStrength === "medium"
                      ? "border-text-muted text-text-secondary"
                      : "border-bg-border text-text-muted"
                  }`}>
                    {e.signalStrength}
                  </span>
                </div>
                {e.url && (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-cyan hover:underline"
                  >
                    View source →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fast track order */}
      {order[0] && (
        <div className="card mb-8">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Users className="h-5 w-5 text-cyan" /> Fast track order
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-text-muted">Interviewees</p>
              <p className="font-medium text-text-primary">{order[0].intervieweeCount}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Experts</p>
              <p className="font-medium text-text-primary">{order[0].expertCount}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Total estimate</p>
              <p className="font-medium text-text-primary">
                {order[0].currency} {order[0].totalEstimate}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Status</p>
              <p className="font-medium text-text-primary">{order[0].status}</p>
            </div>
          </div>
          {order[0].eta && (
            <p className="mt-4 text-xs text-text-muted">
              ETA: {new Date(order[0].eta).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Interviews */}
      {interviewList.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Interviews</h2>
          <div className="space-y-3">
            {interviewList.map((interview) => (
              <div key={interview.id} className="card-elevated flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium capitalize">{interview.type}</span>
                  {interview.scheduledAt && (
                    <span className="ml-3 text-xs text-text-muted">
                      {new Date(interview.scheduledAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {interview.signalStrength && (
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${
                      interview.signalStrength === "strong"
                        ? "border-cyan/40 text-cyan"
                        : "border-bg-border text-text-muted"
                    }`}>
                      {interview.signalStrength}
                    </span>
                  )}
                  <span className="text-xs text-text-muted">{interview.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI next steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="card mb-8">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-cyan" /> AI-powered next steps
          </h2>
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan/10 text-xs font-bold text-cyan">
                  {i + 1}
                </span>
                <p className="text-sm text-text-primary">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate verdict (if cycle is running and has evidence) */}
      {cycle.status === "running" && totalSignals > 0 && !verdict[0] && (
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">Generate verdict</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Aggregate signal strengths into a decision-grade verdict with confidence and AI next steps.
              </p>
            </div>
            <form action={generateVerdict}>
              <input type="hidden" name="cycleId" value={cycleId} />
              <input type="hidden" name="ideaId" value={id} />
              <input type="hidden" name="track" value={cycle.track} />
              <input type="hidden" name="weak" value={signalCounts.weak} />
              <input type="hidden" name="medium" value={signalCounts.medium} />
              <input type="hidden" name="strong" value={signalCounts.strong} />
              <button type="submit" className="btn-primary gap-2">
                <TrendingUp className="h-4 w-4" /> Generate verdict
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Iterate */}
      {verdict[0] && (
        <div className="card flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Iterate</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Update your context and start a new validation cycle.
            </p>
          </div>
          <Link
            href={`/dashboard/ideas/${id}/validate`}
            className="btn-primary gap-2"
          >
            <Target className="h-4 w-4" /> New cycle
          </Link>
        </div>
      )}
    </div>
  );
}
