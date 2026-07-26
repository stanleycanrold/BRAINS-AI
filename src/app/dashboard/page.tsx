export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { ideas, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Lightbulb, ArrowRight, Plus } from "lucide-react";

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
    <>
      <Header
        title="Ideas"
        subtitle="Drop a new idea, or pick up where you left off."
      />

      <div className="space-y-8">
        {/* Greeting and quick action */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Hey{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}.
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Here's what you're working on
            </p>
          </div>
          <Link href="/dashboard/ideas/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Idea
            </Button>
          </Link>
        </div>

        {/* Ideas Grid */}
        <div className="space-y-4">
          {userIdeas && userIdeas.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userIdeas.map((idea) => (
                <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
                  <Card elevated className="hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary line-clamp-2">
                            {idea.title || "Untitled Idea"}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="primary">
                              {idea.currentStage === "idea"
                                ? "💡 Idea"
                                : idea.currentStage === "prototype"
                                ? "🚀 MVP"
                                : "📈 Live"}
                            </Badge>
                            <Badge
                              variant={
                                idea.status === "validated"
                                  ? "success"
                                  : idea.status === "researching" ||
                                    idea.status === "validating"
                                  ? "warning"
                                  : "primary"
                              }
                            >
                              {idea.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-text-secondary">
                        {idea.currentStage === "idea"
                          ? "Idea stage"
                          : idea.currentStage === "prototype"
                          ? "Prototype stage"
                          : "Live product"}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">
                          Updated{" "}
                          {idea.updatedAt
                            ? new Date(idea.updatedAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card elevated className="border-2 border-dashed border-bg-border text-center py-12">
              <Lightbulb className="mx-auto h-12 w-12 text-text-muted mb-4" />
              <h3 className="font-semibold text-text-primary mb-2">
                No ideas yet
              </h3>
              <p className="text-text-secondary mb-6">
                Start by capturing your first idea. Raw is fine — we'll help you
                structure it.
              </p>
              <Link href="/dashboard/ideas/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Idea
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
