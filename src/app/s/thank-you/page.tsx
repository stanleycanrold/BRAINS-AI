import { Brain, Check } from "lucide-react";

export default function SurveyThankYou() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="h-6 w-6 text-cyan" />
        <span className="font-bold tracking-tight">
          <span className="text-cyan">BRAINS</span>
          <span className="text-text-muted"> AI</span>
        </span>
      </div>
      <div className="card max-w-sm text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 mx-auto">
          <Check className="h-7 w-7 text-cyan" />
        </div>
        <h1 className="text-xl font-bold">Thank you</h1>
        <p className="text-sm text-text-secondary">
          Your responses have been recorded. They&apos;ll be analyzed alongside others to validate this idea.
        </p>
      </div>
    </div>
  );
}
