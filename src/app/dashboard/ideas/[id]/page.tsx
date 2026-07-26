export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { 
  MessageSquareText, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Copy 
} from "lucide-react";

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaDetailPage({ 
  params,
}: IdeaDetailPageProps) {
  const { id } = await params;

  // TODO: Fetch idea data from database
  // const idea = await getIdea(id);

  return (
    <>
      <Header
        title="NeuralScribe: Automated Medical Transcription"
        subtitle="Tracing the evolution of the venture from its original core hypothesis to the current validated pivot. Each node represents a distinct AI-driven validation cycle."
        status="VALIDATING"
      />

      <div className="space-y-8">
        {/* Timeline Section */}
        <div>
          <h3 className="font-semibold text-text-primary mb-6">Idea Timeline</h3>
          
          <div className="relative">
            {/* Timeline track */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-bg-border" />

            {/* Timeline items */}
            <div className="space-y-6">
              {/* Cycle 1 */}
              <div className="relative pl-20">
                <div className="absolute -left-1 top-2 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        v3 - Specialized ER Context Mapping
                      </h4>
                      <p className="text-sm text-text-muted">Validated on Sep 21, 2025</p>
                    </div>
                    <Badge variant="success">92/100</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    Niche focus on Emergency Room environment noise-filtering.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Core Issue</p>
                      <p className="text-sm font-medium text-text-primary">
                        CHART INPUT
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Primary Use</p>
                      <p className="text-sm font-medium text-text-primary">
                        Head of ER Operations
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Value Prop</p>
                      <p className="text-sm font-medium text-success">
                        Reduce burnout by 40%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      📄 Full Report
                    </button>
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      📊 Raw Data
                    </button>
                  </div>
                </Card>
              </div>

              {/* Cycle 2 */}
              <div className="relative pl-20">
                <div className="absolute -left-1 top-2 w-4 h-4 rounded-full bg-warning border-4 border-white" />
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        v2 - General Medical Scribe Interface
                      </h4>
                      <p className="text-sm text-text-muted">Initiated on Sep 17, 2025</p>
                    </div>
                    <Badge variant="warning">64/100</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    Critical Friction Point: General practitioners called interface fatigue and lack of specialized vocabulary for complex surgical notes.
                  </p>
                  <div className="flex gap-3">
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      👁️ View Analysis
                    </button>
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      🔄 Review Changes
                    </button>
                  </div>
                </Card>
              </div>

              {/* Cycle 3 */}
              <div className="relative pl-20">
                <div className="absolute -left-1 top-2 w-4 h-4 rounded-full bg-text-muted border-4 border-white" />
                <Card className="opacity-60">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        v1 - Direct-to-Patient Health Logger
                      </h4>
                      <p className="text-sm text-text-muted">Initiated on Aug 30, 2025</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    Original core idea focusing on consumers logging symptoms. Strategic decision to pivot to B2B due to low retention signals...
                  </p>
                  <div className="flex gap-3">
                    <button className="text-sm text-primary hover:underline">View Details</button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card elevated>
            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Next Steps Recommended
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">
                  Niche focus on Emergency Room is validated. Propose integration with Epic EHR system.
                </span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">
                  High willingness to pay for the MVP feature set.
                </span>
              </li>
              <li className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">
                  Competitive latency. Interview 2-3 procurement officers (tier-1 Urban Hospital).
                </span>
              </li>
            </ul>
          </Card>

          <Card elevated>
            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Run Another Cycle
            </h4>
            <p className="text-sm text-text-secondary mb-4">
              Based on recent learnings, refine your positioning and validate with another fast-track round or social listening cycle.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="text-sm">
                Normal Track
              </Button>
              <Button className="text-sm gap-2">
                <Zap className="h-4 w-4" />
                Fast Track
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
