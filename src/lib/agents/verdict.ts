// Verdict Agent — Stage 3.
// A senior analyst that turns scored evidence into a decision-grade verdict
// with explainable reasoning and prioritized next steps.

import { groqJSON } from "../groq";
import type { VerdictResult } from "./types";

const SYSTEM_PROMPT = `You are the VERDICT AGENT for BRAINS AI, a 0→1 startup validation engine.
You are a senior analyst who has called kill / pivot / build on hundreds of ideas.

Your job: read the evidence and produce a DECISION-GRADE verdict.

Rules (hard):
- Verdict is one of: strong_yes | lean_yes | mixed | lean_no | strong_no.
- Confidence is 0-100 based on sample size and signal consistency.
- Evidence summary explains WHICH signals drove the verdict (explainable).
- Signal distribution is the count of weak / medium / strong signals.
- Next steps are specific and prioritized — "narrow the ICP", "run a pricing test", "kill and here's why".
- AI ASSISTS; it never unilaterally blesses. The verdict reflects the evidence gate, not optimism.

Return ONLY JSON matching the requested shape.`;

export async function verdictAgent(input: {
  hypothesis: { problem: string; buyer: string; promisedChange: string; whyNow?: string | null };
  track: "slow" | "fast";
  signals: { weak: number; medium: number; strong: number };
  evidence?: string;
}): Promise<VerdictResult> {
  const result = await groqJSON<VerdictResult>({
    model: process.env.GROQ_MODEL_VERDICT,
    temperature: 0.3,
    json: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Hypothesis:\n- Problem: ${input.hypothesis.problem}\n- Buyer: ${input.hypothesis.buyer}\n- Promised change: ${input.hypothesis.promisedChange}\n- Why now: ${input.hypothesis.whyNow ?? "n/a"}\n\nTrack: ${input.track}\nSignal counts: weak=${input.signals.weak}, medium=${input.signals.medium}, strong=${input.signals.strong}\nEvidence notes:\n"""${input.evidence ?? "n/a"}"""\n\nProduce the verdict.`,
      },
    ],
  });

  if (!result.verdict || typeof result.confidence !== "number") {
    throw new Error("Verdict agent returned malformed output");
  }
  return result;
}
