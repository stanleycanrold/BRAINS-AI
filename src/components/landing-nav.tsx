"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";

/**
 * Top-right auth area for the landing page.
 * Signed out → Sign in / Sign up (Clerk modal, no hosted redirect).
 * Signed in  → Dashboard link + account menu.
 */
export function LandingNav() {
  const { isSignedIn } = useUser();

  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-cyan" />
        <span className="font-bold tracking-tight">
          <span className="text-cyan">BRAINS</span>
          <span className="text-text-muted"> AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <>
            <Link href="/dashboard" className="btn-secondary">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="btn-secondary">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary">Sign up</button>
            </SignUpButton>
          </>
        )}
      </div>
    </header>
  );
}
