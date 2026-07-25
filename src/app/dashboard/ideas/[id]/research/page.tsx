export const dynamic = "force-dynamic";

import { db } from "@/db";
import { ideas, ideaContextRevisions, researchRuns, researchSuggestions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Sparkles } from "lucide-react";
import { runResearch } from "./actions";

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  if (!idea) notFound();

  const [latestRevision] = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, id))
    .orderBy(desc(ideaContextRevisions.revisionNumber))
    .limit(1);

  const runs = await db.select().from(researchRuns).where(eq(researchRuns.ideaId, id));

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
          <FlaskConical className="h-6 w-6 text-cyan" /> Research & Strengthening
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          BRAINS runs lightweight research to sharpen your idea before validation.
          Every suggestion cites what prompted it.
        </p>
      </div>

      {/* Run research */}
      <div className="card mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold">Run a research pass</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Web + social scan for the problem space, existing solutions, and market signals.
              AI will propose concrete changes to strengthen your idea.
            </p>
          </div>
          <form action={runResearch}>
            <input type="hidden" name="ideaId" value={id} />
            <button type="submit" className="btn-primary gap-2">
              <Sparkles className="h-4 w-4" /> Run research
            </button>
          </form>
        </div>
      </div>

      {/* Research runs */}
      {runs.length > 0 ? (
        <div className="space-y-6">
          {runs.map(async (run) => {
            const suggestions = await db
              .select()
              .from(researchSuggestions)
              .where(eq(researchSuggestions.researchRunId, run.id));

            return (
              <div key={run.id} className="card">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize">{run.type} research</span>
                    <span className="ml-3 text-xs text-text-muted">
                      {new Date(run.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`rounded-full border px-3 py-0.5 text-xs ${
                    run.status === "completed"
                      ? "border-cyan/40 text-cyan"
                      : "border-bg-border text-text-muted"
                  }`}>
                    {run.status}
                  </span>
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-text-muted">Suggestions</h3>
                    {suggestions.map((s) => (
                      <div key={s.id} className="card-elevated">
                        <p className="text-sm text-text-primary">{s.suggestion}</p>
                        {s.rationale && (
                          <p className="mt-2 text-xs text-text-secondary">
                            <span className="text-cyan">Why:</span> {s.rationale}
                          </p>
                        )}
                        {s.sourceUrl && (
                          <a
                            href={s.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-xs text-cyan hover:underline"
                          >
                            Source →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <FlaskConical className="mb-4 h-10 w-10 text-text-muted" />
          <p className="text-sm text-text-secondary">
            No research runs yet. Run your first pass above.
          </p>
        </div>
      )}
    </div>
  );
}
