export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Lightbulb, CheckCircle2, Zap, Plus } from "lucide-react";

export default async function Home() {
  const clerkUser = await currentUser();
  
  // Redirect authenticated users to dashboard
  if (clerkUser) {
    redirect("/dashboard");
  }

  // Redirect unauthenticated users to sign-in
  if (!clerkUser) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-bg-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">BRAINS AI</h1>
            <p className="text-xs text-text-muted uppercase tracking-wide">Founder Workspace</p>
          </div>
          <Link href="/sign-up">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-bg-light">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Title and Badge */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-text-primary">Idea Entry Point</h2>
              <Badge variant="warning">RESEARCHHH</Badge>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <h3 className="text-5xl font-bold text-text-primary mb-4">Build the Future.</h3>
            <p className="text-lg text-text-secondary max-w-2xl">
              Our Intelligence Analyst AI is ready to parse your vision. Provide the core details below to begin the structural validation process.
            </p>
          </div>

          {/* Form Section */}
          <Card elevated className="space-y-8">
            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-text-primary uppercase tracking-wide mb-3">
                WHAT ARE YOU BUILDING?
              </label>
              <textarea
                placeholder="Describe the core problem, your solution, and the unique mechanism that makes it work..."
                className="input-field w-full h-32 resize-none"
              />
              <div className="mt-2 text-right">
                <button className="text-text-muted hover:text-text-secondary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-16 0h12v8H2V5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Venture Stage */}
            <div>
              <label className="block text-sm font-medium text-text-primary uppercase tracking-wide mb-4">
                VENTURE STAGE
              </label>
              <div className="grid grid-cols-3 gap-4">
                <label className="relative">
                  <input type="radio" name="stage" value="idea" defaultChecked className="sr-only" />
                  <div className="border-2 border-primary bg-blue-50 rounded-lg p-6 text-center cursor-pointer hover:border-primary/80 transition-all">
                    <Lightbulb className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-text-primary">Idea only</p>
                  </div>
                </label>
                <label className="relative">
                  <input type="radio" name="stage" value="prototype" className="sr-only" />
                  <div className="border-2 border-bg-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/20 transition-all">
                    <Zap className="h-6 w-6 text-text-muted mx-auto mb-2" />
                    <p className="font-medium text-text-primary">MVP built</p>
                  </div>
                </label>
                <label className="relative">
                  <input type="radio" name="stage" value="live" className="sr-only" />
                  <div className="border-2 border-bg-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/20 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-text-muted mx-auto mb-2" />
                    <p className="font-medium text-text-primary">Live with users</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-2 text-sm text-text-muted border-t border-bg-border pt-6">
              <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p>Your data is encrypted and private to BRAINS AI</p>
            </div>
          </Card>

          {/* CTA Button */}
          <div className="mt-8 flex justify-end">
            <Link href="/dashboard/ideas/new">
              <Button className="gap-2 px-6">
                Next Step: Structural Validation
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
