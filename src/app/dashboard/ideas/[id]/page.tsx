export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import { ideas, ideaContextRevisions, validationCycles, verdicts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { ArrowRight, CheckCircle2, Sparkles, RefreshCcw } from "lucide-react";

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params;
  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  const revisions = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, id))
    .orderBy(desc(ideaContextRevisions.revisionNumber));
  const cycles = await db
    .select()
    .from(validationCycles)
    .where(eq(validationCycles.ideaId, id))
    .orderBy(desc(validationCycles.createdAt));

  if (!idea) {
    return null;
  }

  const latestRevision = revisions[0];
  const latestCycle = cycles[0];

  return (
    <>
      <Header
        title={idea.title}
        subtitle="Every cycle references the same evolving context so the loop stays auditable and comparable."
        status={idea.status === "validated" ? "VALIDATING" : idea.status === "researching" ? "RESEARCHING" : "BUILDING"}
        breadcrumb={["Ideas", idea.title]}
        steps={[
          { label: "Entry", href: `/dashboard/ideas/${id}`, current: true, complete: true },
          { label: "Research", href: `/dashboard/ideas/${id}/research`, complete: Boolean(revisions.length) },
          { label: "Validate", href: `/dashboard/ideas/${id}/validate`, complete: Boolean(cycles.length) },
          { label: "Decide", href: `/dashboard/ideas/${id}/cycles/${latestCycle?.id ?? "new"}`, complete: Boolean(latestCycle?.verdict) },
        ]}
        actions={
          <Link href={`/dashboard/ideas/${id}/research`}>
            <Button variant="secondary" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Strengthen idea
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-5xl space-y-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card elevated className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Current context</p>
                <h3 className="mt-2 text-2xl font-semibold text-text-primary">{latestRevision?.description || idea.title}</h3>
              </div>
              <Badge variant={idea.status === "validated" ? "success" : idea.status === "researching" ? "warning" : "primary"}>
                {idea.status}
              </Badge>
            </div>
            <dl className="grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-text-muted">Stage</dt>
                <dd className="mt-1 font-medium text-text-primary">{idea.currentStage}</dd>
              </div>
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-text-muted">Target user</dt>
                <dd className="mt-1 font-medium text-text-primary">{latestRevision?.targetUser || "To be defined"}</dd>
              </div>
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-text-muted">Problem</dt>
                <dd className="mt-1 font-medium text-text-primary">{latestRevision?.problem || "To be defined"}</dd>
              </div>
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-text-muted">Why now</dt>
                <dd className="mt-1 font-medium text-text-primary">{latestRevision?.whyNow || "To be defined"}</dd>
              </div>
            </dl>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-text-muted">
              <Sparkles className="h-4 w-4 text-primary" />
              Next step
            </div>
            <p className="text-sm leading-6 text-text-secondary">
              Research sharpens the idea before spending validation efforts. Once that pass is complete, you can move straight into slow or fast validation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/dashboard/ideas/${id}/research`}>
                <Button className="gap-2">
                  Run research
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/dashboard/ideas/${id}/validate`}>
                <Button variant="secondary">Validate</Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text-primary">Cycle history</h3>
            <Link href={`/dashboard/ideas/${id}/validate`} className="text-sm font-medium text-primary">Start a new validation cycle</Link>
          </div>
          {cycles.length === 0 ? (
            <Card className="text-sm text-text-secondary">No validation cycles yet. Start the slow or fast track when you are ready.</Card>
          ) : (
            <div className="space-y-4">
              {cycles.map((cycle) => (
                <Card key={cycle.id} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-text-primary">Cycle {cycle.cycleNumber}</p>
                      <Badge variant={cycle.status === "completed" ? "success" : "warning"}>{cycle.track}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{cycle.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {cycle.verdict ? <Badge variant="success">{cycle.verdict}</Badge> : <Badge variant="warning">Pending</Badge>}
                    <Link href={`/dashboard/ideas/${id}/cycles/${cycle.id}`}>
                      <Button variant="secondary" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        View report
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
