import { IdeaCapture } from "@/components/idea-capture";
import { LandingNav } from "@/components/landing-nav";
import { Brain, Search, MessageSquareText, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Capture",
    desc: "Type your raw idea. BRAINS structures it into a testable hypothesis and surfaces the riskiest assumptions.",
  },
  {
    icon: Search,
    title: "Research",
    desc: "An AI agent scans the problem space and proposes grounded improvements — each with a reason.",
  },
  {
    icon: MessageSquareText,
    title: "Validate",
    desc: "Non-leading interview prompts and signal scoring. Evidence, not opinions.",
  },
  {
    icon: TrendingUp,
    title: "Decide",
    desc: "A decision-grade verdict with confidence and AI next steps: build, pivot, or kill.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNav />

      {/* Hero + idea capture */}
      <section className="mx-auto max-w-2xl px-6 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Validate before you build.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-text-secondary">
          BRAINS is the 0→1 validation engine. Bring a raw idea — AI agents
          structure, research, and validate it with evidence, not documents.
        </p>

        <div className="mt-10 text-left">
          <IdeaCapture />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="card space-y-2">
              <s.icon className="h-5 w-5 text-cyan" />
              <h3 className="text-sm font-semibold">{s.title}</h3>
              <p className="text-xs text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-text-muted">
        Capture. Validate. Decide.
      </footer>
    </div>
  );
}
