export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Sparkles, Settings, Share2, Copy } from "lucide-react";

interface QuestionnaireBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionnaireBuilderPage({
  params,
}: QuestionnaireBuilderPageProps) {
  const { id } = await params;

  return (
    <>
      <Header
        title="Questionnaire Builder"
        status="RESEARCHING"
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Builder */}
        <div className="space-y-6">
          {/* AI-Powered Assistant */}
          <Card elevated>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-text-primary">AI-Powered Assistant</h3>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-secondary">
                  Draft Script from Problem Statement
                </p>
                <p className="text-xs text-text-muted">
                  Describe the core problem your venture solves. Our AI will generate a
                  statistically valid user interview script.
                </p>

                <textarea
                  placeholder="e.g. Founders struggle to find reliable co-founders in the pre-seed stage, leading to 40% of startups failing due to team issues..."
                  className="input-field h-24 resize-none"
                />

                <Button className="w-full gap-2">
                  Generate AI-Drafted Script
                </Button>
              </div>
            </div>
          </Card>

          {/* Questionnaire Flow */}
          <Card>
            <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">
              Questionnaire Flow
            </h3>

            <div className="space-y-3">
              {[
                {
                  number: "Q1",
                  question: "What is the hardest part about your current wor",
                  type: "LONG TEXT",
                  required: true,
                },
                {
                  number: "Q2",
                  question: "How many hours per week do you lose to this p",
                  type: "MULTIPLE CHOICE",
                  required: false,
                  options: ["Under 5 hours", "5-10 hours", "10-20 hours"],
                },
              ].map((q) => (
                <div
                  key={q.number}
                  className="border border-bg-border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{q.number}</span>
                      <span className="text-sm font-medium text-text-primary">
                        {q.question}
                      </span>
                    </div>
                    <button className="text-text-muted hover:text-text-primary">
                      ⚙️
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="primary" className="text-xs">
                      {q.type}
                    </Badge>
                    {q.required && (
                      <Badge variant="danger" className="text-xs">
                        REQUIRED
                      </Badge>
                    )}
                  </div>

                  {q.options && (
                    <div className="mt-3 space-y-2">
                      {q.options.map((option) => (
                        <div
                          key={option}
                          className="flex items-center gap-2 text-xs text-text-secondary"
                        >
                          <input
                            type="radio"
                            disabled
                            className="w-3 h-3"
                          />
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button className="w-full border-2 border-dashed border-bg-border rounded-lg py-3 text-text-secondary hover:text-text-primary font-medium text-sm">
                + Add Question
              </button>
            </div>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          {/* Mobile Preview */}
          <Card className="flex justify-center py-8">
            <div className="w-64 bg-black rounded-3xl border-8 border-gray-800 overflow-hidden shadow-xl">
              <div className="bg-white p-6 h-96 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <button className="text-sm text-primary">← Back</button>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Question 01
                    </h3>
                    <p className="text-sm font-medium text-text-primary mb-4">
                      What is the hardest part about your current workflow?
                    </p>
                  </div>

                  <div>
                    <textarea
                      placeholder="Type your answer here..."
                      className="w-full border border-bg-border rounded-lg p-3 text-sm resize-none h-20 mb-4"
                    />
                    <button className="w-full bg-primary text-white rounded-lg py-2 font-medium text-sm">
                      OK ✓
                    </button>
                  </div>

                  <p className="text-xs text-text-muted text-center mt-3">
                    1 of 7
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Publish Section */}
          <Card elevated>
            <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">
              Publish & Share
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                  LIVE LINK
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="app.brains.ai/v/founder"
                    className="input-field text-sm flex-1"
                  />
                  <Button variant="secondary" className="gap-2 px-3">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-3">
                  SHARE INVITE
                </p>
                <Button className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Publish & Copy Link
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
