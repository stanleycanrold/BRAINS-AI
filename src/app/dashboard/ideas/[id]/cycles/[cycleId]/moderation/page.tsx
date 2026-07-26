export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Search, Filter, Flag, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface ModerationQueuePageProps {
  params: Promise<{ id: string; cycleId: string }>;
}

export default async function ModerationQueuePage({
  params,
}: ModerationQueuePageProps) {
  const { id, cycleId } = await params;

  return (
    <>
      <Header
        title="Moderation Queue"
        status="RESEARCHING"
        searchPlaceholder="Search responses..."
      />

      <div className="space-y-6">
        {/* Tabs and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4 border-b border-bg-border">
            {[
              { label: "All", count: 128 },
              { label: "Pending Review", count: 42 },
              { label: "Approved", count: 0 },
              { label: "Flagged", count: 0 },
            ].map((tab) => (
              <button
                key={tab.label}
                className={`pb-3 px-2 border-b-2 font-medium text-sm ${
                  tab.label === "All"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label} <span className="text-text-muted ml-2">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary gap-2 text-sm">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="btn-primary text-sm">
              Bulk Approve
            </button>
          </div>
        </div>

        {/* Moderation Insight Card */}
        <Card>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Moderation Insight
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                    Critical Alert
                  </p>
                  <p className="text-sm text-text-secondary">
                    Repetitive language detected in 12% of recent submissions from Region A.
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                    AI Suggestion
                  </p>
                  <p className="text-sm text-text-secondary">
                    Consider updating the "Product Value" question; 15 respondents found it ambiguous.
                  </p>
                </div>

                <div className="pt-3 border-t border-bg-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-text-secondary">
                      High Confidence
                    </span>
                    <span className="text-sm font-bold text-text-primary">75%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-success" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                Auto-Moderation
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">
                  Let BRAINS AI handle high-confidence approvals based on your history.
                </p>
                <Button className="w-full">Configure AI Rules</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Response Items */}
        <div className="space-y-4">
          {/* Response 1 - Pending */}
          <Card>
            <div className="flex gap-4 justify-between mb-4">
              <div className="flex gap-4 flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated text-text-primary font-medium flex-shrink-0">
                  AN
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">Anonymous #8421</p>
                  <p className="text-xs text-text-muted">
                    SUBMITTED 2h AGO • SAN FRANCISCO, CA
                  </p>
                </div>
              </div>
              <Badge variant="danger">POTENTIAL AI/VAGUE</Badge>
            </div>

            <div className="mb-4 p-3 bg-bg-elevated rounded-lg">
              <p className="text-sm italic text-text-secondary">
                "The solution is very good and provides much value to the industry. I like how it works and would recommend it to many people. It is efficient and simple."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-text-muted">SIGNAL</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-success font-medium">Unsure</span>
                  <span className="text-text-muted">42%</span>
                </div>
              </div>
              <div>
                <span className="text-text-muted">CONFIDENCE</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-warning font-medium">Yes</span>
                  <span className="text-text-muted">98%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
                🗑️ Delete
              </button>
              <button className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
                🚩 Flag for Rework
              </button>
              <div className="ml-auto flex gap-3">
                <Button variant="secondary" className="text-sm">Approve</Button>
              </div>
            </div>
          </Card>

          {/* Response 2 - Approved */}
          <Card>
            <div className="flex gap-4 justify-between mb-4">
              <div className="flex gap-4 flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium flex-shrink-0">
                  MC
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">Marcus Chen</p>
                  <p className="text-xs text-text-muted">
                    SUBMITTED 2h AGO • LONDON, UK
                  </p>
                </div>
              </div>
              <Badge variant="success">HIGH CONFIDENCE</Badge>
            </div>

            <div className="mb-4 p-3 bg-bg-elevated rounded-lg">
              <p className="text-sm italic text-text-secondary">
                "Integrating this into our CI/CD pipeline saved the team roughly 12 hours a week. The major bottleneck was always the manual feedback loop, which BRAINS AI has successfully automated. Highly pass."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-text-muted">SIGNAL</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-success font-medium">Yes</span>
                  <span className="text-text-muted">99%</span>
                </div>
              </div>
              <div>
                <span className="text-text-muted">CONFIDENCE</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-success font-medium">Yes</span>
                  <span className="text-text-muted">99%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
                🗑️ Delete
              </button>
              <button className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
                📎 Flag for Rework
              </button>
              <div className="ml-auto">
                <Button disabled className="text-sm opacity-50">
                  ✓ Approved
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Showing 1-10 of 128 responses</span>
          <div className="flex gap-2">
            <button className="btn-secondary p-2 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="btn-primary px-3 py-2 rounded-lg">1</button>
            <button className="btn-secondary px-3 py-2 rounded-lg">2</button>
            <button className="btn-secondary px-3 py-2 rounded-lg">3</button>
            <button className="btn-secondary p-2 rounded-lg">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
