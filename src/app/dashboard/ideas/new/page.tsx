export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Button } from "@/components/ui/index";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { createIdea } from "./actions";

export default async function IdeaEntryPage() {
  return (
    <>
      <Header title="Idea Entry Point" subtitle="Capture the full context now so every later stage reasons from the same versioned record." status="RESEARCHING" />

      <div className="mx-auto max-w-5xl space-y-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card elevated className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Stage 1 · Capture</p>
              <h2 className="mt-2 text-3xl font-semibold text-text-primary">Describe what you are building and why it matters.</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                This is the foundation for the entire engine. The app saves a versioned context record so research and validation can build on the same source of truth.
              </p>
            </div>

            <form action={createIdea} className="space-y-6">
              <div className="space-y-2">
                <label className="label" htmlFor="title">Idea title</label>
                <input id="title" name="title" className="input-field" placeholder="Name the idea or wedge" required />
              </div>
              <div className="space-y-2">
                <label className="label" htmlFor="description">What are you building?</label>
                <textarea id="description" name="description" className="input-field h-32 resize-none" placeholder="Describe the problem, your solution, and the core value proposition." required />
              </div>
              <div className="space-y-2">
                <label className="label">Venture stage</label>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { id: "idea", label: "Idea only", icon: "💡" },
                    { id: "prototype", label: "Prototype", icon: "🚀" },
                    { id: "live_product", label: "Live product", icon: "📈" },
                  ].map((stage) => (
                    <label key={stage.id} className="cursor-pointer">
                      <input type="radio" name="stage" value={stage.id} defaultChecked={stage.id === "idea"} className="peer sr-only" />
                      <div className="rounded-lg border border-bg-border bg-bg-surface p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary-light">
                        <div className="mb-2 text-2xl">{stage.icon}</div>
                        <div className="font-medium text-text-primary">{stage.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="label" htmlFor="targetUser">Target user</label>
                  <input id="targetUser" name="targetUser" className="input-field" placeholder="Who feels the pain most?" />
                </div>
                <div className="space-y-2">
                  <label className="label" htmlFor="problem">Pain / problem</label>
                  <input id="problem" name="problem" className="input-field" placeholder="What is the friction or unmet need?" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="label" htmlFor="solution">Proposed solution</label>
                  <input id="solution" name="solution" className="input-field" placeholder="What is the proposed answer?" />
                </div>
                <div className="space-y-2">
                  <label className="label" htmlFor="whyNow">Why now?</label>
                  <input id="whyNow" name="whyNow" className="input-field" placeholder="What changed to make this timely?" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="label" htmlFor="competitors">Competitors / alternatives</label>
                  <input id="competitors" name="competitors" className="input-field" placeholder="What exists already?" />
                </div>
                <div className="space-y-2">
                  <label className="label" htmlFor="websiteUrl">Website / links</label>
                  <input id="websiteUrl" name="websiteUrl" className="input-field" placeholder="https://" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  Continue to research
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-text-muted">
              <Sparkles className="h-4 w-4 text-primary" />
              What happens next
            </div>
            <div className="space-y-3">
              {[
                "The context is saved as a versioned record and reused in later stages.",
                "Research will sharpen the problem, ICP, and differentiator.",
                "You will choose slow or fast validation and receive a decision-grade verdict.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-bg-border bg-bg-surface p-3 text-sm text-text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
