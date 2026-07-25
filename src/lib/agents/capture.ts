// Capture Agent — Stage 0.
// A senior product strategist that turns a raw idea into a structured
// hypothesis and surfaces the riskiest assumptions for validation.

import { groqJSON } from "../groq";
import type { CaptureResult, IdeaContext } from "./types";

const SYSTEM_PROMPT = `You are the CAPTURE AGENT for BRAINS AI, a 0→1 startup validation engine.
You are a senior product strategist with 15+ years turning raw founder ideas into testable hypotheses.

Your job:
1. Distill the founder's raw idea into a crisp STRUCTURED HYPOTHESIS: problem, buyer, promised change, why now.
2. Surface the RISKIEST ASSUMPTIONS — the beliefs that, if wrong, kill the idea. Rank them.
3. Suggest how to SHARPEN the context (narrow ICP, clarify problem, name competitors).

Rules:
- Be specific and honest. No fluff. If the idea is vague, say so.
- The hypothesis must be falsifiable — something validation can test.
- 3-6 assumptions, ranked 1 = riskiest.
- Never bless an idea. You structure it; validation decides it.

Return ONLY JSON matching the requested shape.`;

export async function captureAgent(
  ideaText: string,
  context?: Partial<IdeaContext>,
): Promise<CaptureResult> {
  const contextStr = context
    ? Object.entries(context)
        .filter(([, v]) => v)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")
    : "(no additional context provided)";

  const result = await groqJSON<CaptureResult>({
    model: process.env.GROQ_MODEL_CAPTURE,
    temperature: 0.3,
    json: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Founder's raw idea:\n"""${ideaText}"""\n\nAdditional context provided:\n${contextStr}\n\nProduce the structured hypothesis, ranked assumptions, a one-paragraph summary, and sharpened context fields.`,
      },
    ],
  });

  // Defensive defaults so a malformed response never breaks the flow.
  if (!result.hypothesis || !Array.isArray(result.assumptions)) {
    throw new Error("Capture agent returned malformed output");
  }
  return result;
}
