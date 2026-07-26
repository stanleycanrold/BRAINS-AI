export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Users, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface ValidationStrategyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ValidationStrategyPage({
  params,
}: ValidationStrategyPageProps) {
  const { id } = await params;

  return (
    <>
      <Header
        title="Validation Strategy"
        subtitle="Choose the track that fits your timeline and depth requirements."
        status="VALIDATING"
      />

      <div className="space-y-8">
        {/* Decision Point */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              How do you want to validate?
            </h2>
            <p className="text-text-secondary">
              Choose the track that fits your project's timeline and analytical depth. Both paths utilize
              our proprietary precision-engineering framework to ensure data traceability.
            </p>
          </div>
        </Card>

        {/* Two-Track Comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Normal Track */}
          <Card elevated>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated">
                  <Users className="h-5 w-5 text-text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Normal Track</h3>
                  <p className="text-xs text-text-muted uppercase tracking-wide">
                    FREE • SELF-PACED
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    Community-driven outreach and data gathering.
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    Access to standard validation templates.
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    Basic AI report generation upon completion.
                  </span>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    Typical timeline: 4-8 weeks depending on response.
                  </span>
                </div>
              </div>

              <Button variant="secondary" className="w-full">
                Select Self-Paced
              </Button>
            </div>
          </Card>

          {/* Fast Track */}
          <Card elevated className="relative border-primary border-2">
            <div className="absolute -top-3 right-4">
              <Badge variant="warning">⚡ RECOMMENDED</Badge>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Fast Track</h3>
                  <p className="text-xs text-text-muted uppercase tracking-wide">
                    PAID • EXPERT-LED • PRIORITY
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    Precision-engineered expert interviewing (1-2 weeks).
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    Guaranteed high-density analytical depth & source-link transparency.
                  </span>
                </div>
              </div>

              {/* Interview Target Selector */}
              <div>
                <label className="label uppercase tracking-wide text-xs text-text-muted">
                  Interviewee Target
                </label>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    defaultValue="8"
                    className="flex-1 h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-bold text-primary w-8">15</span>
                </div>
                <p className="text-xs text-text-muted mb-4">
                  Suggested: 8-15 interviews optimal for signal strength
                </p>
              </div>

              {/* Pricing Summary */}
              <div className="space-y-3 border-t border-bg-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Interview cost (15 × $150)</span>
                  <span className="font-medium text-text-primary">$2,250</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Analysis fee</span>
                  <span className="font-medium text-text-primary">$450</span>
                </div>
                <div className="flex justify-between border-t border-bg-border pt-3">
                  <span className="font-semibold text-text-primary">Estimated Total</span>
                  <span className="font-bold text-lg text-primary">$1,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Turnaround</span>
                  <span className="text-text-muted font-medium">12 Days</span>
                </div>
              </div>

              <Button className="w-full gap-2">
                <Zap className="h-4 w-4" />
                Start Fast Track
              </Button>
            </div>
          </Card>
        </div>

        {/* Case Study */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 rounded-lg object-cover bg-bg-elevated flex-shrink-0" />
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                  CASE STUDY
                </p>
                <h4 className="font-semibold text-text-primary">Previous Report: Nexus Solar</h4>
                <p className="text-sm text-text-secondary mt-1">
                  Fast Track validation revealed a 24% market gap in off-grid energy storage that the founders hadn't considered.
                </p>
              </div>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">
              VIEW CASE STUDY →
            </a>
          </Card>

          <Card className="bg-gray-900 text-white">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              GLOBAL ACCURACY
            </p>
            <p className="text-4xl font-bold mb-2">98.4%</p>
            <p className="text-sm text-gray-300">
              Traceable data points successfully validated across 52 active portfolios
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
