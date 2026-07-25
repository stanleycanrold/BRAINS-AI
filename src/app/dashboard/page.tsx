export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { ideas, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { IdeaCapture } from "@/components/idea-capture";
import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";

export default async function DashboardOverview() {
  const clerkUser = await currentUser();
  let userIdeas: (typeof ideas.$inferSelect)[] = [];

  if (clerkUser) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (dbUser) {
      userIdeas = await db
        .select()
        .from(ideas)
        .where(eq(ideas.userId, dbUser.id))
        .orderBy(desc(ideas.updatedAt));
    }
  }

  return (
    <div className="space-y-10">
      {/* Same idea-capture surface as the landing page */}
      <div>
        <h1 className="text-2xl font-bold">
          Hey{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}.
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Drop a new idea, or pick up where you left off.
        </p>
        <div className="mt-6">
          <IdeaCapture compact />
        </div>
      </div>

      {/* Existing ideas */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Your ideas
        </h2>

        {userIdeas.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <Lightbulb className="mb-4 h-10 w-10 text-text-muted" />
            <p className="max-w-sm text-sm text-text-secondary">
              No ideas yet. Capture your first one above — BRAINS will structure
              it into a testable hypothesis.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {userIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/dashboard/ideas/${idea.id}`}
                className="card flex items-center justify-between transition-colors hover:border-cyan-muted"
              >
                <div>
                  <p className="font-medium text-text-primary">{idea.title}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {idea.status} · {idea.currentStage.replace("_", " ")}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
