import { db } from "@/db";
import { ideas, ideaContextRevisions, assumptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [idea] = await db
    .select()
    .from(ideas)
    .where(eq(ideas.id, id))
    .limit(1);

  if (!idea) notFound();

  const revisions = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, id));

  const ideaAssumptions = await db
    .select()
    .from(assumptions)
    .where(eq(assumptions.ideaId, id));

  return (
    <div>
      <Link
        href="/dashboard/ideas"
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to ideas
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{idea.title}</h1>
          <span className="mt-2 inline-block rounded-full border border-bg-border px-3 py-1 text-xs text-text-muted">
            {idea.status}
          </span>
        </div>
      </div>

      {/* Context */}
      <div className="grid gap-6 md:grid-cols-2">
        {idea.problem && (
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-text-muted">
              Problem
            </h3>
            <p className="text-text-primary">{idea.problem}</p>
          </div>
        )}
        {idea.audience && (
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-text-muted">
              Audience
            </h3>
            <p className="text-text-primary">{idea.audience}</p>
          </div>
        )}
        {idea.solution && (
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-text-muted">
              Solution hypothesis
            </h3>
            <p className="text-text-primary">{idea.solution}</p>
          </div>
        )}
        {idea.whyNow && (
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-text-muted">
              Why now
            </h3>
            <p className="text-text-primary">{idea.whyNow}</p>
          </div>
        )}
      </div>

      {/* Context history */}
      {revisions.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5 text-cyan" />
            Context history ({revisions.length})
          </h2>
          <div className="space-y-3">
            {revisions
              .sort((a, b) => b.revisionNumber - a.revisionNumber)
              .map((rev) => (
                <div
                  key={rev.id}
                  className="card-elevated flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-medium text-cyan">
                      v{rev.revisionNumber}
                    </span>
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

      {/* Assumptions */}
      {ideaAssumptions.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Assumptions</h2>
          <div className="space-y-3">
            {ideaAssumptions.map((a) => (
              <div key={a.id} className="card-elevated">
                <div className="flex items-center justify-between">
                  <p className="text-text-primary">{a.text}</p>
                  <span className="ml-4 rounded-full border border-bg-border px-3 py-1 text-xs text-text-muted">
                    {a.risk} risk
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
