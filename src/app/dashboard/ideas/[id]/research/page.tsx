export const dynamic = "force-dynamic";

import { db } from "@/db";
import { ideas, ideaContextRevisions, researchRuns, researchSuggestions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Lightbulb, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { runResearch } from "./actions";

interface ResearchingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResearchingPage({ params }: ResearchingPageProps) {
  const { id } = await params;
  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  const [latestRevision] = await db
    .select()
    .from(ideaContextRevisions)
    .where(eq(ideaContextRevisions.ideaId, id))
    .orderBy(desc(ideaContextRevisions.revisionNumber))
    .limit(1);
  const runs = await db
    .select()
    .from(researchRuns)
    .where(eq(researchRuns.ideaId, id))
    .orderBy(desc(researchRuns.createdAt));

  const latestRun = runs[0];
  const suggestions = latestRun
    ? await db.select().from(researchSuggestions).where(eq(researchSuggestions.researchRunId, latestRun.id)).orderBy(desc(researchSuggestions.createdAt))
    : [];

  return (
    <>
      <Header
        title="Research & strengthen"
        subtitle="Grounded research turns the raw idea into a sharper hypothesis before you spend validation effort."
        status="RESEARCHING"
        breadcrumb={["Ideas", idea?.title ?? "Idea"]}
        steps={[
          { label: "Entry", href: `/dashboard/ideas/${id}`, complete: Boolean(latestRevision) },
          { label: "Research", href: `/dashboard/ideas/${id}/research`, current: true, complete: Boolean(latestRun) },
          { label: "Validate", href: `/dashboard/ideas/${id}/validate` },
          { label: "Decide", href: `/dashboard/ideas/${id}/cycles/new` },
        ]}
        actions={
          <form action={runResearch}>
            <input type="hidden" name="ideaId" value={id} />
            <Button className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Run research
            </Button>
          </form>
        }
      />

      <div className="mx-auto max-w-5xl space-y-8 py-8">
        <Card elevated className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Stage 2 · Research</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">{idea?.title ?? "Your idea"}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                The research agent looks for signals in the current context, then proposes changes that make the idea sharper and easier to validate.
              </p>
            </div>
            {latestRun ? <Badge variant="success">Completed</Badge> : <Badge variant="warning">Ready</Badge>}
          </div>

          {latestRun && latestRun.findings ? (
            <div className="rounded-xl border border-bg-border bg-bg-surface p-4">
              <p className="text-sm font-semibold text-text-primary">Latest research summary</p>
              <p className="mt-2 text-sm text-text-secondary">{(latestRun.findings as { summary?: string }).summary || "Research completed."}</p>
            </div>
          ) : null}
        </Card>

        {suggestions.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">Suggested strengthening changes</h3>
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text-primary">{suggestion.suggestion}</p>
                    <p className="mt-1 text-sm text-text-secondary">{suggestion.rationale}</p>
                  </div>
                  <Badge variant="warning">Proposed</Badge>
                </div>
                {suggestion.sourceUrl ? <p className="text-sm text-primary">Source: {suggestion.sourceUrl}</p> : null}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-sm text-text-secondary">No suggestions yet. Run research to generate the strengthening pass.</Card>
        )}

        <Card elevated className="border border-primary/20 bg-primary-light">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Ready to validate?</h3>
              <p className="mt-1 text-sm text-text-secondary">Move into the validation stage once the research pass is complete.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`/dashboard/ideas/${id}/validate`} className="btn-primary inline-flex items-center gap-2">
                Start validation
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href={`/dashboard/ideas/${id}`} className="btn-secondary inline-flex items-center gap-2">Back to idea</a>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
