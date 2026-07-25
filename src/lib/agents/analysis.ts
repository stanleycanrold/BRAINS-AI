// Response Analysis Agent — the analysis engine.
// Reads ALL survey responses, scores each respondent, runs the ≥50% gate,
// and produces the final analysis the founder sees.

import { groqJSON } from "../groq";

export interface RespondentScore {
  responseId: string;
  problemExperienced: "yes" | "no" | "unclear";
  signalStrength: "weak" | "medium" | "strong";
  keyInsights: string;
}

export interface SurveyAnalysisResult {
  respondentScores: RespondentScore[];
  gatePassed: boolean;            // ≥50% experienced the problem
  problemExperiencedPct: number;  // 0-100
  verdict: "strong_yes" | "lean_yes" | "mixed" | "lean_no" | "strong_no";
  summary: string;
  recommendation: string;         // proceed | diagnose-and-rerun | kill
  insights: string[];             // top themes across responses
  realProblem: string | null;     // if gate failed: what problem they actually have
  nextSteps: string[];
}

const SYSTEM_PROMPT = `You are the RESPONSE ANALYSIS AGENT for BRAINS AI, a 0→1 startup validation engine.
You are a senior user researcher who has analyzed thousands of interview and survey responses.

Your job: read ALL responses and produce the FINAL ANALYSIS the founder acts on.

Methodology (hard rules):
1. For EACH respondent, determine: do they actually experience the problem? (yes / no / unclear)
2. GATE: if ≥50% of respondents experience the problem → gate PASSED → recommend proceeding to development.
   If <50% → gate FAILED → diagnose what problem they actually have, recommend revising and re-running.
3. Score each respondent's signal: weak / medium / strong based on commitment language, budget mention, active workaround, frequency.
4. Verdict reflects the evidence: strong_yes / lean_yes / mixed / lean_no / strong_no.
5. If the gate failed, identify the REAL problem respondents described (may differ from the founder's hypothesis).
6. Next steps must be specific and actionable.

Rules:
- Be honest. If the problem isn't real, say so. AI never blesses — evidence decides.
- Base everything on what respondents actually said, not optimism.
- Quote specific patterns you saw across responses.

Return ONLY JSON matching the requested shape.`;

export async function responseAnalysisAgent(input: {
  hypothesis: { problem: string; buyer: string; promisedChange: string; whyNow?: string | null };
  track: "slow" | "fast";
  questions: Array<{ id: string; question: string; isGating: boolean }>;
  responses: Array<{
    id: string;
    respondentName: string | null;
    isExpert: boolean;
    answers: Array<{ questionId: string; question: string; answer: string }>;
  }>;
}): Promise<SurveyAnalysisResult> {
  // Build a readable transcript for the model.
  const transcript = input.responses
    .map((r) => {
      const lines = r.answers
        .map((a) => `  Q: ${a.question}\n  A: ${a.answer}`)
        .join("\n");
      return `--- Respondent: ${r.respondentName ?? "anonymous"}${r.isExpert ? " (paid expert)" : ""} [id: ${r.id}] ---\n${lines}`;
    })
    .join("\n\n");

  const questionList = input.questions
    .map((q) => `- [${q.id}]${q.isGating ? " (GATING)" : ""} ${q.question}`)
    .join("\n");

  const result = await groqJSON<SurveyAnalysisResult>({
    temperature: 0.3,
    json: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Hypothesis:\n- Problem: ${input.hypothesis.problem}\n- Buyer: ${input.hypothesis.buyer}\n- Promised change: ${input.hypothesis.promisedChange}\n- Why now: ${input.hypothesis.whyNow ?? "n/a"}\n\nTrack: ${input.track}\n\nQuestions:\n${questionList}\n\nResponses (${input.responses.length} total):\n${transcript}\n\nAnalyze all responses. Run the ≥50% gate. Produce the final analysis.`,
      },
    ],
  });

  if (!result.respondentScores || !Array.isArray(result.respondentScores)) {
    throw new Error("Analysis agent returned malformed output");
  }

  return result;
}
