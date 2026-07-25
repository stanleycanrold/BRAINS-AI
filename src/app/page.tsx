import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-bg-border bg-bg-surface">
            <Brain className="h-7 w-7 text-cyan" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-cyan">BRAINS</span>
              <span className="text-text-muted"> AI</span>
            </h1>
            <p className="mt-1 text-xs text-text-muted">
              Validate before you build
            </p>
          </div>
        </div>

        {/* Auth actions */}
        <div className="space-y-3">
          <Link href="/sign-up" className="btn-primary w-full gap-2">
            Create an account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="btn-secondary w-full"
          >
            Sign in
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted">
          Capture. Validate. Decide.
        </p>
      </div>
    </div>
  );
}
