import Link from "next/link";
import { Brain } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6 text-cyan" />
        <span className="font-bold tracking-tight">
          <span className="text-cyan">BRAINS</span>
          <span className="text-text-muted"> AI</span>
        </span>
      </div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to BRAINS
      </Link>
    </div>
  );
}
