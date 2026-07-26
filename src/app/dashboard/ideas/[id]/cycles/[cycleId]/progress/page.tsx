export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { BarChart3, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface FastTrackProgressPageProps {
  params: Promise<{ id: string; cycleId: string }>;
}

export default async function FastTrackProgressPage({
  params,
}: FastTrackProgressPageProps) {
  const { id, cycleId } = await params;

  return (
    <>
      <Header
        title="Fast Track Progress Tracker"
        status="VALIDATING"
      />

      <div className="space-y-8">
        {/* Progress Circle and Status */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card elevated className="md:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Fast Track Progress Tracker
                </h3>
                <p className="text-sm text-text-secondary">
                  We are currently executing high-density market validation for Project X. Our analysts are
                  conducting deep-dive interviews with verified SaaS experts to pressure-test your core
                  assumptions.
                </p>
              </div>
              <Badge variant="success">EST. COMPLETION: DEC 2x</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Preliminary Insights", icon: "📊" },
                { label: "Update Hypotheses", icon: "🎯" },
              ].map((item) => (
                <Button key={item.label} variant="secondary" className="flex-col gap-2 h-auto py-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Progress Circle */}
          <Card elevated className="flex flex-col items-center justify-center py-12 relative">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0052CC"
                  strokeWidth="8"
                  strokeDasharray="141 188"
                  strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-4xl font-bold text-primary">6</div>
                <div className="text-xs text-text-muted uppercase tracking-wide">of 12 Complete</div>
              </div>
            </div>
          </Card>
        </div>

        {/* What to Expect */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="space-y-4">
            <h4 className="font-semibold text-text-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              What to Expect
            </h4>
            <ul className="space-y-3">
              {[
                "Hypothesis Mapping: Core value assumptions identified and prioritized for testing.",
                "Expert Interrogation: 12 conducted with industry veterans and prospective users.",
                "Data Synthesis: Automated counterinferencing of interview transcripts and market signals.",
                "Final Verdict Report: Comprehensive 'Go/No-Go' analysis and risk integrated road map.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-4">
            <h4 className="font-semibold text-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Validation Roster
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: "Marcus Chen",
                  role: "SaaS Founder",
                  status: "COMPLETED",
                  date: "Sep 18, 14:00",
                },
                {
                  name: "Elena Rodriguez",
                  role: "Venture Analyst",
                  status: "UPCOMING",
                  date: "Tomorrow 08:30",
                },
                {
                  name: "David Vance",
                  role: "Project Lead",
                  status: "UPCOMING",
                  date: "Oct 02, 16:15",
                },
                {
                  name: "Sourcing Expert #7...",
                  role: "Marketing ops CFO",
                  status: "NOT YET",
                  date: "...",
                },
              ].map((expert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {expert.name}
                      </p>
                      <p className="text-xs text-text-muted">{expert.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        expert.status === "COMPLETED"
                          ? "success"
                          : expert.status === "UPCOMING"
                          ? "warning"
                          : "primary"
                      }
                    >
                      {expert.status}
                    </Badge>
                    <p className="text-xs text-text-muted mt-1">{expert.date}</p>
                  </div>
                </div>
              ))}
              <button className="text-sm text-primary hover:underline">
                View all 15 sessions →
              </button>
            </div>
          </Card>
        </div>

        {/* Interim Signal Analysis */}
        <Card className="border-2 border-primary space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text-primary text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Interim Signal Analysis
            </h3>
            <Badge variant="warning">Preliminary</Badge>
          </div>

          <p className="text-sm text-text-secondary">
            Complete 2 more deep interviews to unlock the initial Trend Synthesis. Our AI will
            correlate these qualitative signals with global market data.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "DIRECTION",
                value: "Lean Yes",
                icon: "→",
                color: "text-success",
              },
              {
                label: "CONFIDENCE",
                value: "67%",
                icon: "📊",
                color: "text-warning",
              },
              {
                label: "INTERVIEWS NEEDED",
                value: "5 more",
                icon: "👥",
                color: "text-primary",
              },
            ].map((metric) => (
              <div key={metric.label} className="bg-bg-elevated rounded-lg p-4">
                <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                  {metric.label}
                </p>
                <p className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
