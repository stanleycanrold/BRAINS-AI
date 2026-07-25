// Validation Agent — Stage 2.
// A senior user researcher that generates non-leading interview prompts from a
// hypothesis and scores signal strength from notes.

import { groqJSON } from "../groq";
import type { InterviewPrompt, SignalScore, ValidationResult } from "./types";

const PROMPTS_SYSTEM = `You are the VALIDATION AGENT for BRAINS AI, a 0→1 startup validation engine.
You are a senior user researcher who has run hundreds of discovery interviews.

Your job: generate NON-LEADING interview prompts from the hypothesis.

Rules (hard):
- Problem-first. Never ask "would you use…" or "would you pay…".
- Ask about past behavior, not hypotheticals. "Tell me about the last time…"
- Cover: problem, workflow, urgency, budget, alternatives, commitment.
- 6-9 prompts, ordered conversationally.

Return ONLY JSON: { "prompts": [{ "prompt": string, "category": string }], "notes": string }`;

const SCORING_SYSTEM = `You are the VALIDATION AGENT scoring interview signals for BRAINS AI.
Score the commitment signal as weak / medium / strong based on:
- commitment language (willingness to act, pay, refer)
- budget mentioned
- active workaround in use
- frequency of the problem
Explain the score briefly. Return ONLY JSON: { "strength": "weak"|"medium"|"strong", "reasoning": string }`;

export async function validationAgent(hypothesis: {
  problem: string;
  buyer: string;
  promisedChange: string;
  whyNow?: string | null;
}): Promise<ValidationResult> {
  const result = await groqJSON<ValidationResult>({
    model: process.env.GROQ_MODEL_VALIDATION,
    temperature: 0.4,
    json: true,
    messages: [
      { role: "system", content: PROMPTS_SYSTEM },
      {
        role: "user",
        content: `Hypothesis:\n- Problem: ${hypothesis.problem}\n- Buyer: ${hypothesis.buyer}\n- Promised change: ${hypothesis.promisedChange}\n- Why now: ${hypothesis.whyNow ?? "n/a"}\n\nGenerate the interview prompts.`,
      },
    ],
  });

  if (!Array.isArray(result.prompts)) {
    throw new Error("Validation agent returned malformed prompts");
  }
  return result;
}

export async function scoreSignal(notes: {
  raw?: string;
  commitmentLanguage?: boolean;
  budgetMentioned?: boolean;
  activeWorkaround?: boolean;
  frequency?: "rare" | "occasional" | "frequent";
}): Promise<SignalScore> {
  const result = await groqJSON<SignalScore>({
    model: process.env.GROQ_MODEL_FAST,
    temperature: 0.2,
    json: true,
    messages: [
      { role: "system", content: SCORING_SYSTEM },
      {
        role: "user",
        content: `Interview notes:\n"""${notes.raw ?? ""}"\"\nSignals:\n- commitment language: ${notes.commitmentLanguage}\n- budget mentioned: ${notes.budgetMentioned}\n- active workaround: ${notes.activeWorkaround}\n- frequency: ${notes.frequency ?? "unknown"}\n\nScore the signal.`,
      },
    ],
  });

  if (!["weak", "medium", "strong"].includes(result.strength)) {
    throw new Error("Validation agent returned malformed signal score");
  }
  return result;
}
