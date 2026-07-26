export const dynamic = "force-dynamic";

import { db } from "@/db";
import { ideas, hypotheses, validationCycles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Users, Zap, CheckCircle2 } from "lucide-react";
import { startValidationCycle } from "./actions";

interface ValidationStrategyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ValidationStrategyPage({ params }: ValidationStrategyPageProps) {
  const { id } = await params;
  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  const [hypothesis] = await db.select().from(hypotheses).where(eq(hypotheses.ideaId, id)).limit(1);
  const cycles = await db.select().from(validationCycles).where(eq(validationCycles.ideaId, id)).orderBy(desc(validationCycles.createdAt));
  const nextCycleNumber = cycles.length + 1;

  return (
    <>
      <Header
        title="Validation strategy"
        subtitle="Choose a slow track for social evidence or a fast track for managed human interviews."
        status="VALIDATING"
        breadcrumb={["Ideas", idea?.title ?? "Idea"]}
        steps={[
          { label: "Entry", href: `/dashboard/ideas/${id}`, complete: Boolean(idea) },
          { label: "Research", href: `/dashboard/ideas/${id}/research`, complete: Boolean(hypothesis) },
          { label: "Validate", href: `/dashboard/ideas/${id}/validate`, current: true },
          { label: "Decide", href: `/dashboard/ideas/${id}/cycles/${cycles[0]?.id ?? "new"}` },
        ]}
      />

      <div className="mx-auto max-w-5xl space-y-8 py-8">
        <Card elevated className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Stage 3 · Validation</p>
          <h2 className="text-2xl font-semibold text-text-primary">Choose how you want to prove the signal.</h2>
          <p className="text-sm leading-6 text-text-secondary">
            The slow track gathers social evidence and the fast track delivers managed interviews with a quote and ETA before approval.
          </p>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card elevated className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Slow track</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Social listening · self-serve</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />Find real discussions around the problem online.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />Score the signal strength and cluster patterns.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />Feed a decision-grade report without extra coordination.</li>
            </ul>
            <form action={startValidationCycle} className="space-y-3">
              <input type="hidden" name="ideaId" value={id} />
              <input type="hidden" name="track" value="slow" />
              <input type="hidden" name="cycleNumber" value={nextCycleNumber} />
              <Button type="submit" variant="secondary" className="w-full">Start slow validation</Button>
            </form>
          </Card>

          <Card elevated className="relative space-y-6 border-2 border-primary">
            <div className="absolute right-4 top-4 rounded-full bg-warning-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-warning">Recommended</div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Fast track</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Paid interviews · human reviewed</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />Quote is shown before approval and includes analysis.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />Interviewees and niche experts can be included in the same order.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />The final verdict is reviewed by a human analyst before release.</li>
            </ul>
            <form action={startValidationCycle} className="space-y-3">
              <input type="hidden" name="ideaId" value={id} />
              <input type="hidden" name="track" value="fast" />
              <input type="hidden" name="cycleNumber" value={nextCycleNumber} />
              <Button type="submit" className="w-full gap-2">
                <Zap className="h-4 w-4" />
                Start fast validation
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
