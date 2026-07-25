// Evaluation Agent — the feedback / quality loop.
// Reviews another agent's output and returns a critique: strengths, weaknesses,
// a 0-100 score, and a recommendation (approve / revise / reject) with fixes.
// This is the "evaluations" layer — every stage's output can be reviewed before
// it ships to the founder.

import { groqJSON } from "../groq";
import type { AgentEvaluation } from "./types";

const SYSTEM_PROMPT = `You are the EVALUATION AGENT for BRAINS AI.
You are a rigorous senior reviewer. You critique another agent's output for quality, correctness, and usefulness.

Your job:
- STRENGTHS — what the output got right.
- WEAKNESSES — what's missing, vague, unsupported, or wrong.
- SCORE — 0-100 (calibrated: 90+ excellent, 70-89 good, 50-69 needs work, <50 poor).
- RECOMMENDATION — approve | revise | reject.
- SUGGESTED FIXES — concrete changes if revise/reject.

Rules:
- Be specific. "Too vague" is useless; "ICP not narrowed beyond 'founders'" is useful.
- Do not rubber-stamp. If the output is generic, score it down.
- Return ONLY JSON matching the requested shape.`;

export async function evaluateAgent(input: {
  agent: string;
  task: string;
  output: unknown;
}): Promise<AgentEvaluation> {
  const result = await groqJSON<AgentEvaluation>({
    model: process.env.GROQ_MODEL_EVALUATION,
    temperature: 0.3,
    json: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Agent under review: ${input.agent}\nTask: ${input.task}\nOutput (JSON):\n${JSON.stringify(input.output, null, 2)}\n\nEvaluate this output.`,
      },
    ],
  });

  if (!result.recommendation || typeof result.score !== "number") {
    throw new Error("Evaluation agent returned malformed output");
  }
  return result;
}
