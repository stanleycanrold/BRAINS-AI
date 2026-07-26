export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Lightbulb, TrendingUp, Check, X } from "lucide-react";

interface ResearchingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResearchingPage({
  params,
}: ResearchingPageProps) {
  const { id } = await params;

  return (
    <>
      <Header
        title="Researching"
        status="ANALYZING DESIGN"
      />

      <div className="space-y-8">
        {/* Main Research Result */}
        <Card elevated className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Universal AI Interoperability
            </h2>
            <p className="text-text-secondary">
              Our system has identified a critical bottleneck in the current market: lack of
              cross-platform model communication. The problem strength is verified through 1.2M scraped developer queries.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wide">
                Verified Users
              </p>
              <p className="text-3xl font-bold text-text-primary">85,000+</p>
              <p className="text-xs text-text-muted">Across open source communities</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wide">
                Market Gap
              </p>
              <p className="text-3xl font-bold text-success">Critical</p>
              <p className="text-xs text-text-muted">Sentiment score: +8.4/10</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wide">
                Opportunity
              </p>
              <p className="text-3xl font-bold text-primary">$2.1B</p>
              <p className="text-xs text-text-muted">TAM (Greenfield)</p>
            </div>
          </div>
        </Card>

        {/* Competitor Landscape */}
        <div>
          <h3 className="font-semibold text-text-primary mb-4 text-lg">
            Competitor Landscape
          </h3>
          <p className="text-text-secondary mb-6 text-sm">
            VIEW FULL MAP
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "NexusFlow",
                desc: "Legacy infrastructure provider focusing on API aggregation...",
                strengths: "SCALABLE",
                weaknesses: "OUTDATED",
              },
              {
                name: "KernelIO",
                desc: "Model open-source toolkit with strong community, missing commercial layer...",
                strengths: "FREE, API",
                weaknesses: "INDIE API",
              },
              {
                name: "Azure AI",
                desc: "Market leader in Tier-1 out-of-box integrations",
                strengths: "DOMINANCE",
                weaknesses: "COMPLEXITY",
              },
            ].map((comp) => (
              <Card key={comp.name} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated" />
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm">
                      {comp.name}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">{comp.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="success" className="text-xs">
                    {comp.strengths}
                  </Badge>
                  <Badge variant="danger" className="text-xs">
                    {comp.weaknesses}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Proposed Strengthening Changes */}
        <div>
          <h3 className="font-semibold text-text-primary mb-4 text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            Proposed Strengthening Changes
          </h3>

          <div className="space-y-3">
            {[
              {
                change: "Pivot: Edge-First Computation Strategy",
                reasoning: "Founders across 9 startup hubs cite latency as deal-breaker.",
                impact: "↑ 45%",
              },
              {
                change:
                  "Monetization: Dynamic Token-Based Tier Structure",
                reasoning: "Usage-based APIs are outperforming seat-license models 3x",
                impact: "↑ 128 LTV",
              },
              {
                change: "Security: Zero-Knowledge Model Proofs",
                reasoning:
                  "24 B2B teams cited data governance as the #1 buying blocker.",
                impact: "↑ 76%",
              },
            ].map((item, i) => (
              <Card key={i} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">
                      {item.change}
                    </h4>
                    <p className="text-sm text-text-secondary">{item.reasoning}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-success">{item.impact}</p>
                    <p className="text-xs text-text-muted">Expected uplift</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-bg-border">
                  <Button variant="secondary" className="text-sm gap-2 flex-1">
                    <Check className="h-4 w-4" />
                    Accept Change
                  </Button>
                  <Button variant="secondary" className="text-sm gap-2 flex-1">
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <Card elevated className="border-2 border-primary space-y-6">
          <h3 className="font-semibold text-text-primary text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Ready to Validate
          </h3>
          <p className="text-sm text-text-secondary">
            Your idea has been strengthened based on market research. Now it's time to validate
            your updated hypothesis with real users or experts.
          </p>
          <div className="flex gap-3">
            <Button className="gap-2 flex-1">
              Start Validation
            </Button>
            <Button variant="secondary" className="flex-1">
              Review Research
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
