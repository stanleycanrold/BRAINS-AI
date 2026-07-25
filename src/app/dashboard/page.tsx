import Link from "next/link";
import { Plus, Lightbulb } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Your validation workspace
          </p>
        </div>
        <Link href="/dashboard/ideas/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" /> New Idea
        </Link>
      </div>

      {/* Empty state */}
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <Lightbulb className="mb-4 h-12 w-12 text-text-muted" />
        <h2 className="text-lg font-semibold text-text-primary">
          No ideas yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          Capture your first idea and start validating. BRAINS will help you
          structure it into a testable hypothesis.
        </p>
        <Link href="/dashboard/ideas/new" className="btn-primary mt-6 gap-2">
          <Plus className="h-4 w-4" /> Capture your first idea
        </Link>
      </div>
    </div>
  );
}
