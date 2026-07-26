export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface DecisionGatePageProps {
  params: Promise<{ id: string; cycleId: string }>;
}

export default async function DecisionGatePage({
  params,
}: DecisionGatePageProps) {
  const { id, cycleId } = await params;

  return (
    <>
      <Header
        title="Decision Gate"
        status="VALIDATING"
      />

      <div className="space-y-8">
        {/* Verdict Header */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card elevated className="space-y-6">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                AI Validation Score
              </p>
              <div className="text-6xl font-bold text-success mb-2">84</div>
              <div className="text-sm font-medium text-success">/ 100</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-semibold text-text-primary text-lg">
                  SIGNAL: GO AHEAD
                </span>
              </div>
              <p className="text-sm text-text-secondary pl-7">
                Market resonance is significantly high in the target Nairobi logistics tech sector. 
                Quantitative sentiment indicates a 72% willingness to pay for the MVP feature set.
              </p>
            </div>
          </Card>

          <Card elevated className="space-y-6">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide mb-4">
                What people said
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Badge variant="success" className="flex-shrink-0">✓</Badge>
                  <span className="text-sm text-text-secondary">
                    "If this could automate our billing reconciliation by 50%, we would switch immediately."
                  </span>
                </div>
                <div className="flex gap-3">
                  <Badge variant="success" className="flex-shrink-0">✓</Badge>
                  <span className="text-sm text-text-secondary">
                    "Efficiency gains through 50% of ops team switching providers..."
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="text-sm text-primary hover:underline">
                SEE RESPONSES
              </button>
            </div>
          </Card>
        </div>

        {/* Risk Factors */}
        <Card>
          <div className="space-y-6">
            <h3 className="font-semibold text-text-primary text-lg">⚠️ Risk Factors</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs text-text-muted uppercase tracking-wide">
                  Regulatory Compliance
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-bg-border rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-warning" />
                  </div>
                  <span className="text-sm font-medium text-warning">Medium</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-text-muted uppercase tracking-wide">
                  Competitive Latency
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-bg-border rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-success" />
                  </div>
                  <span className="text-sm font-medium text-success">Low</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Market Capacity */}
        <Card elevated className="bg-primary text-white">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Market Capacity</h3>
            <div className="text-4xl font-bold">$42.8M</div>
            <p className="text-sm text-white/90">ADDRESSABLE TAM (LOCAL)</p>
            <a href="#" className="inline-block text-sm font-medium hover:underline mt-2">
              VIEW DATA SOURCES
            </a>
          </div>
        </Card>

        {/* Interim Signal Analysis */}
        <Card>
          <div className="space-y-4 text-center py-6">
            <AlertCircle className="h-12 w-12 text-primary mx-auto" />
            <h4 className="font-semibold text-text-primary">Interim Signal Analysis</h4>
            <p className="text-sm text-text-secondary">
              Complete 2 more deep interviews to unlock the initial Trend Synthesis. Our AI will
              correlate these qualitative signals with global market data.
            </p>
            <div className="flex gap-2 items-center justify-center mt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div className="w-8 h-8 rounded-full bg-gray-400" />
              </div>
              <span className="text-xs text-text-muted">+9 scheduled experts awaiting interpretation</span>
            </div>
          </div>
        </Card>

        {/* Final Action Hub */}
        <Card elevated className="border-2 border-primary">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text-primary text-lg mb-2">
                Final Action Hub
              </h3>
              <p className="text-sm text-text-secondary">
                The AI recommends proceeding based on the current risk-to-reward ratio. Select your path:
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Button className="flex-col gap-3 h-auto py-6">
                <TrendingUp className="h-6 w-6" />
                <span>Proceed to Build</span>
                <span className="text-xs font-normal opacity-90">GENERATE DEV ROADMAP</span>
              </Button>

              <Button variant="secondary" className="flex-col gap-3 h-auto py-6">
                <AlertCircle className="h-6 w-6" />
                <span>Rework Idea</span>
                <span className="text-xs font-normal opacity-90">INSERT PIVOT POINTS</span>
              </Button>

              <Button variant="danger" className="flex-col gap-3 h-auto py-6">
                <CheckCircle2 className="h-6 w-6" />
                <span>Kill This Idea</span>
                <span className="text-xs font-normal opacity-90">ARCHIVE & DOCUMENT</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
