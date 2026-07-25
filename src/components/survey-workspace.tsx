"use client";

import { useState, useTransition } from "react";
import {
  updateSurvey,
  updateQuestion,
  addQuestion,
  publishSurvey,
  runAnalysis,
} from "@/app/dashboard/ideas/[id]/validate/actions";
import { Plus, Send, FlaskConical, Loader2, Check } from "lucide-react";

type Question = {
  id: string;
  question: string;
  category: string | null;
  order: number;
  isGating: boolean;
};

type Analysis = {
  id: string;
  gatePassed: boolean;
  problemExperiencedPct: string;
  verdict: string | null;
  summary: string;
  recommendation: string;
} | null;

export function SurveyWorkspace({
  survey,
  questions,
  responseCount,
  analysis,
  origin,
}: {
  survey: {
    id: string;
    title: string;
    intro: string | null;
    status: string;
    track: string;
    outreachMessage: string | null;
    targetCount: number;
  };
  questions: Question[];
  responseCount: number;
  analysis: Analysis;
  origin: string;
}) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(survey.title);
  const [intro, setIntro] = useState(survey.intro ?? "");
  const [outreach, setOutreach] = useState(survey.outreachMessage ?? "");
  const [targetCount, setTargetCount] = useState(String(survey.targetCount));
  const [newQ, setNewQ] = useState("");
  const [editingQ, setEditingQ] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState(false);

  const shareUrl = `${origin}/s/${survey.id}`;
  const isDraft = survey.status === "draft";
  const isPublished = survey.status === "published";
  const canAnalyze = responseCount > 0;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
  }

  function handleAnalyze(formData: FormData) {
    setAnalyzing(true);
    startTransition(() => {
      runAnalysis(formData).finally(() => setAnalyzing(false));
    });
  }

  return (
    <div className="space-y-8">
      {/* Survey header / edit */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Survey questionnaire</h2>
          <span className={`rounded-full border px-3 py-0.5 text-xs ${
            isPublished ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-bg-border text-text-muted"
          }`}>
            {survey.status} · {survey.track} track
          </span>
        </div>

        <form action={updateSurvey} className="space-y-4">
          <input type="hidden" name="surveyId" value={survey.id} />
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isDraft}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Intro (shown to respondents)</label>
            <textarea
              name="intro"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              disabled={!isDraft}
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="label">Outreach message (with survey link)</label>
            <textarea
              name="outreachMessage"
              value={outreach}
              onChange={(e) => setOutreach(e.target.value)}
              disabled={!isDraft}
              rows={4}
              className="input-field resize-none text-xs font-mono"
            />
            <p className="mt-1 text-xs text-text-muted">
              Use <code className="text-cyan">{"{{LINK}}"}</code> where the survey URL goes.
            </p>
          </div>
          <div>
            <label className="label">Target responses</label>
            <input
              name="targetCount"
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              disabled={!isDraft}
              className="input-field w-32"
            />
          </div>
          {isDraft && (
            <button type="submit" className="btn-secondary">
              Save changes
            </button>
          )}
        </form>
      </div>

      {/* Questions */}
      <div className="card space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          Questions ({questions.length})
        </h3>

        {questions.map((q, i) => (
          <div key={q.id} className="rounded-lg border border-bg-border bg-bg-base p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-elevated text-xs text-text-muted">
                {i + 1}
              </span>
              {q.isGating && (
                <span className="rounded-full border border-cyan/40 bg-cyan/10 px-2 py-0.5 text-xs text-cyan">
                  GATING (≥50% gate)
                </span>
              )}
            </div>
            <form action={updateQuestion} className="space-y-2">
              <input type="hidden" name="questionId" value={q.id} />
              <textarea
                name="question"
                defaultValue={q.question}
                disabled={!isDraft}
                rows={2}
                className="input-field resize-none text-sm"
              />
              <input
                name="category"
                defaultValue={q.category ?? ""}
                disabled={!isDraft}
                placeholder="category (e.g. problem, budget)"
                className="input-field text-xs"
              />
              {isDraft && (
                <button type="submit" className="text-xs text-cyan hover:underline">
                  Update question
                </button>
              )}
            </form>
          </div>
        ))}

        {/* Add question */}
        {isDraft && (
          <form action={addQuestion} className="flex gap-2">
            <input type="hidden" name="surveyId" value={survey.id} />
            <input
              name="question"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              placeholder="Add a question…"
              className="input-field flex-1 text-sm"
            />
            <button type="submit" className="btn-secondary gap-2">
              <Plus className="h-4 w-4" /> Add
            </button>
          </form>
        )}
      </div>

      {/* Publish + share */}
      {isDraft && (
        <form action={publishSurvey} className="card flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Ready to collect responses?</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Publishing makes the survey live. You&apos;ll get a shareable link to send to respondents.
            </p>
          </div>
          <button type="submit" className="btn-primary gap-2">
            <Send className="h-4 w-4" /> Publish & get link
          </button>
          <input type="hidden" name="surveyId" value={survey.id} />
        </form>
      )}

      {/* Share link + response count */}
      {isPublished && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Share your survey</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Send this link to respondents. {responseCount} response{responseCount !== 1 ? "s" : ""} so far
                {survey.targetCount ? ` (target: ${survey.targetCount})` : ""}.
              </p>
            </div>
            <button onClick={copyLink} className="btn-secondary gap-2">
              <Send className="h-4 w-4" /> Copy link
            </button>
          </div>
          <code className="block rounded-lg bg-bg-base px-4 py-3 text-xs text-cyan break-all">
            {shareUrl}
          </code>

          {/* Run analysis */}
          <form action={handleAnalyze} className="border-t border-bg-border pt-4">
            <input type="hidden" name="surveyId" value={survey.id} />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Run analysis engine</h4>
                <p className="mt-1 text-xs text-text-muted">
                  Analyzes all responses, runs the ≥50% gate, and produces your final verdict.
                </p>
              </div>
              <button
                type="submit"
                disabled={!canAnalyze || analyzing || pending}
                className="btn-primary gap-2"
              >
                {analyzing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
                ) : (
                  <><FlaskConical className="h-4 w-4" /> Run analysis</>
                )}
              </button>
            </div>
            {!canAnalyze && (
              <p className="mt-2 text-xs text-pink">No responses yet. Collect at least one before analyzing.</p>
            )}
          </form>
        </div>
      )}

      {/* Analysis results */}
      {analysis && (
        <div className={`card space-y-4 border-2 ${analysis.gatePassed ? "border-cyan/40" : "border-pink/40"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              analysis.gatePassed ? "bg-cyan/10" : "bg-pink/10"
            }`}>
              <Check className={`h-5 w-5 ${analysis.gatePassed ? "text-cyan" : "text-pink"}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {analysis.gatePassed ? "Gate passed — proceed to development" : "Gate failed — diagnose & re-run"}
              </h3>
              <p className="text-sm text-text-secondary">
                {parseFloat(analysis.problemExperiencedPct)}% of respondents experienced the problem
                {analysis.verdict && ` · verdict: ${analysis.verdict.replace(/_/g, " ")}`}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold">Summary</h4>
            <p className="text-sm text-text-secondary">{analysis.summary}</p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold">Recommendation</h4>
            <p className="text-sm text-text-primary">{analysis.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
