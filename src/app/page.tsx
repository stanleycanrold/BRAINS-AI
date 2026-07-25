import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-cyan">BRAINS</span>
            <span className="text-text-muted"> AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-primary">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center md:px-12">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Validate before you{" "}
            <span className="bg-gradient-to-r from-cyan to-pink bg-clip-text text-transparent">
              build
            </span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary md:text-xl">
            The 0→1 validation engine. Capture your idea, gather real evidence,
            and decide whether to kill, pivot, or build — before you waste a
            line of code.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/sign-up" className="btn-primary gap-2">
              Start validating <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="btn-secondary">
              I have an account
            </Link>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="mt-20 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "Capture",
              desc: "Turn a raw idea into a structured hypothesis with ranked assumptions.",
            },
            {
              title: "Validate",
              desc: "Run interviews and demand experiments. Score every signal.",
            },
            {
              title: "Decide",
              desc: "Get a kill / pivot / build recommendation backed by evidence.",
            },
          ].map((f) => (
            <div key={f.title} className="card text-left">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan" />
                <h3 className="font-semibold text-text-primary">{f.title}</h3>
              </div>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-text-muted md:px-12">
        BRAINS AI — Evidence over documents.
      </footer>
    </div>
  );
}
