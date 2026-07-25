"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { createIdeaFromLanding } from "@/app/actions";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

const PENDING_KEY = "brains_pending_idea";

/**
 * The idea-capture box used on both the landing page and the dashboard.
 *
 * Flow:
 *  - Signed in  → submits the form → server action creates the idea + runs the
 *                 capture agent → redirects to the idea workspace.
 *  - Signed out → stores the idea, opens Clerk's sign-up modal (no hosted
 *                 redirect). After auth the pending idea auto-submits.
 */
export function IdeaCapture({ compact = false }: { compact?: boolean }) {
  const { isSignedIn } = useUser();
  const { openSignUp } = useClerk();
  const formRef = useRef<HTMLFormElement>(null);
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);

  // After auth completes, submit any idea the user typed before signing in.
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_KEY);
    if (isSignedIn && pending) {
      sessionStorage.removeItem(PENDING_KEY);
      setIdea(pending);
      // let the textarea state flush, then submit the form
      requestAnimationFrame(() => formRef.current?.requestSubmit());
    }
  }, [isSignedIn]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!idea.trim()) return;
    if (!isSignedIn) {
      e.preventDefault();
      sessionStorage.setItem(PENDING_KEY, idea.trim());
      setBusy(true);
      openSignUp({ afterAuthUrl: window.location.href });
      return;
    }
    setBusy(true);
  }

  return (
    <form
      ref={formRef}
      action={createIdeaFromLanding}
      onSubmit={onSubmit}
      className="w-full"
    >
      <div className="card space-y-4">
        <label htmlFor="idea" className="sr-only">
          Your idea
        </label>
        <textarea
          id="idea"
          name="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={compact ? 3 : 5}
          required
          placeholder="What's your idea? Describe it like you're telling a friend — BRAINS will structure it into a testable hypothesis."
          className="input-field resize-none text-base"
        />
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            {isSignedIn
              ? "We'll structure it, surface assumptions, and start validation."
              : "Free to try — sign up only when you're ready to save it."}
          </p>
          <button
            type="submit"
            disabled={busy || !idea.trim()}
            className="btn-primary gap-2"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Working…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Validate this idea
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
