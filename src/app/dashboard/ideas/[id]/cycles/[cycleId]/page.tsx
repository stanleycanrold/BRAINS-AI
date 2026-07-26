export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import { validationCycles, verdicts, ideas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { CheckCircle2, AlertCircle, TrendingUp, RefreshCcw } from "lucide-react";

interface DecisionGatePageProps {
  params: Promise<{ id: string; cycleId: string }>;
}

export default async function DecisionGatePage({ params }: DecisionGatePageProps) {
  const { id, cycleId } = await params;
  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  const [cycle] = await db.select().from(validationCycles).where(eq(validationCycles.id, cycleId)).limit(1);
  const [verdict] = await db.select().from(verdicts).where(eq(verdicts.cycleId, cycleId)).orderBy(verdicts.createdAt).limit(1);

  const verdictLabel = verdict?.verdict?.replace(/_/g, " ") ?? "Pending";
  const confidence = verdict?.confidence ? Number(verdict.confidence) : 0;
  const distribution = (verdict?.signalDistribution as { weak?: number; medium?: number; strong?: number } | null) ?? { weak: 0, medium: 0, strong: 0 };
  const evidence = (verdict?.evidenceSummary as { weak?: number; medium?: number; strong?: number; total?: number } | null) ?? { weak: 0, medium: 0, strong: 0, total: 0 };
  const nextSteps = (verdict?.nextSteps as string[] | null) ?? [];

  const verdictTone = verdict?.verdict === "strong_yes" || verdict?.verdict === "lean_yes"
    ? "success"
    : verdict?.verdict === "mixed"
      ? "warning"
      : "danger";

  return (
    <>
      <Header
        title="Decision report"
        subtitle={idea?.title ? `Validation report for ${idea.title}` : "Validation report"}
        status="VALIDATING"
        breadcrumb={["Ideas", idea?.title ?? "Idea", "Report"]}
      />

      <div className="mx-auto max-w-5xl space-y-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card elevated className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Validation verdict</p>
              <div className="mt-3 flex items-end gap-3">
                <div className="text-6xl font-semibold text-text-primary">{confidence}</div>
                <div className="pb-2 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">Confidence</div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-success-light px-3 py-1 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" />
                {verdict ? verdictLabel.toUpperCase() : "PENDING REVIEW"}
              </div>
            </div>
            <p className="text-sm leading-6 text-text-secondary">
              {verdict?.evidenceSummary ? `Evidence count: ${evidence.total ?? 0}` : "The final verdict will appear here once the validation cycle is complete."}
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Weak</p>
                <p className="mt-2 text-xl font-semibold text-text-primary">{distribution.weak ?? 0}</p>
              </div>
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Medium</p>
                <p className="mt-2 text-xl font-semibold text-text-primary">{distribution.medium ?? 0}</p>
              </div>
              <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Strong</p>
                <p className="mt-2 text-xl font-semibold text-text-primary">{distribution.strong ?? 0}</p>
              </div>
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-text-muted">
              <AlertCircle className="h-4 w-4 text-warning" />
              AI next steps
            </div>
            {nextSteps.length > 0 ? (
              <ul className="space-y-3 text-sm text-text-secondary">
                {nextSteps.map((step) => (
                  <li key={step} className="flex gap-2 rounded-lg border border-bg-border bg-bg-surface p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">The report will include prioritized recommendations once validation data is available.</p>
            )}
          </Card>
        </div>

        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Next action</h3>
              <p className="mt-1 text-sm text-text-secondary">Use the outcome to either proceed, rework, or archive the idea. The loop remains open for another iteration.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/dashboard/ideas/${id}`}>
                <Button variant="secondary" className="gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Rework idea
                </Button>
              </Link>
              <Link href={`/dashboard/ideas/${id}/validate`}>
                <Button className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Run another cycle
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
