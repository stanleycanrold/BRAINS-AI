export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { Header } from "@/components/ui/header";
import { Card, Button } from "@/components/ui/index";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { createIdea } from "./actions";

export default async function IdeaEntryPage() {
  const user = await currentUser();

  return (
    <>
      <Header
        title="Idea Entry Point"
        status="RESEARCHING"
      />

      <div className="space-y-8">
        {/* Main form section */}
        <div className="max-w-4xl">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary">
              Build the Future.
            </h2>
            <p className="mt-2 text-text-secondary">
              Our Intelligence Analyst AI is ready to parse your vision. Provide
              the core details below to begin the structural validation process.
            </p>
          </div>

          {/* Form */}
          <form action={createIdea} className="space-y-6">
            <Card elevated>
              {/* What are you building */}
              <div className="space-y-6">
                <div>
                  <label className="label uppercase tracking-wide text-xs text-text-muted">
                    What are you building?
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the core problem, your solution, and the unique mechanism that makes it work..."
                    className="input-field h-32 resize-none"
                  />
                </div>

                {/* Venture Stage */}
                <div>
                  <label className="label uppercase tracking-wide text-xs text-text-muted">
                    Venture Stage
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "idea", label: "Idea only", icon: "💡" },
                      { id: "prototype", label: "MVP built", icon: "🚀" },
                      { id: "live_product", label: "Live with users", icon: "📈" },
                    ].map((stage) => (
                      <label key={stage.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="stage"
                          value={stage.id}
                          defaultChecked={stage.id === "idea"}
                          className="peer sr-only"
                        />
                        <div className="rounded-lg border-2 border-bg-border bg-bg-surface p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary-light">
                          <div className="text-2xl mb-2">{stage.icon}</div>
                          <div className="font-medium text-text-primary">
                            {stage.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Note about structural validation */}
                <div className="rounded-lg bg-bg-elevated p-4 text-sm text-text-secondary">
                  Your idea is encrypted and private in BRAINS AI
                </div>

                {/* Next Step Button */}
                <div className="flex justify-end pt-4">
                  <Button className="gap-2">
                    Next Step: Structural Validation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>

        {/* Benefits section */}
        <div className="max-w-4xl space-y-4 pt-8">
          <h3 className="font-semibold text-text-primary">
            What happens next
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Our AI will research your problem space and competitors",
              "We'll identify your riskiest assumptions",
              "You'll choose: validate via social listening or paid expert interviews",
              "Get a decision-grade verdict with AI-powered next steps",
            ].map((benefit, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
                <span className="text-text-secondary">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
