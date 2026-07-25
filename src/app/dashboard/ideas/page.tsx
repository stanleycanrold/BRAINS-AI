export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import { ideas, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { Plus, FileText } from "lucide-react";

const stageLabels: Record<string, string> = {
  idea: "💡 Idea",
  prototype: "🔨 Prototype",
  live_product: "🚀 Live",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  captured: "Captured",
  researching: "Researching",
  validating: "Validating",
  validated: "Validated",
  iterating: "Iterating",
  archived: "Archived",
};

export default async function IdeasList() {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);

  const hasUser = dbUser.length > 0;

  const userIdeas = hasUser
    ? await db.select().from(ideas).where(eq(ideas.userId, dbUser[0].id))
    : [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ideas</h1>
        <Link href="/dashboard/ideas/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" /> New Idea
        </Link>
      </div>

      {userIdeas.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-text-muted" />
          <p className="text-sm text-text-secondary">No ideas captured yet.</p>
          <Link href="/dashboard/ideas/new" className="btn-primary mt-6 gap-2">
            <Plus className="h-4 w-4" /> Capture your first idea
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {userIdeas.map((idea) => (
            <Link
              key={idea.id}
              href={`/dashboard/ideas/${idea.id}`}
              className="card group transition-colors hover:border-cyan-muted"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary group-hover:text-cyan transition-colors">
                    {idea.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    {stageLabels[idea.currentStage] ?? idea.currentStage}
                  </p>
                </div>
                <span className="ml-4 rounded-full border border-bg-border px-3 py-1 text-xs text-text-muted">
                  {statusLabels[idea.status] ?? idea.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
