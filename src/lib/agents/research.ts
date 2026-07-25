// Research Agent — Stage 1 (research & idea strengthening).
// A senior market researcher that synthesizes the problem space and proposes
// grounded, source-backed improvements to the idea.
//
// NOTE: This agent reasons from model knowledge and flags findings that must be
// verified against live sources. A web-search tool integration is the next
// step; until then every finding carries a `source` label and a verify flag.

import { groqJSON } from "../groq";
import type { IdeaContext, ResearchResult } from "./types";

const SYSTEM_PROMPT = `You are the RESEARCH AGENT for BRAINS AI, a 0→1 startup validation engine.
You are a senior market researcher who has mapped hundreds of problem spaces.

Your job:
1. FINDINGS — describe the problem space: existing solutions, market signals, where the problem is discussed. Mark each finding's relevance.
2. SUGGESTIONS — propose concrete changes to strengthen the idea. Every suggestion MUST cite what prompted it (a competitor, a pattern, a finding).

Rules:
- Grounded over generic. Every suggestion needs a rationale tied to a finding.
- Be specific about competitors / alternatives where known.
- Do NOT fabricate URLs. If you reference a source, name it; leave url empty if unsure.
- Suggest 3-7 improvements.

Return ONLY JSON matching the requested shape.`;

export async function researchAgent(context: Partial<IdeaContext>): Promise<ResearchResult> {
  const contextStr = Object.entries(context)
    .filter(([, v]) => v)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const result = await groqJSON<ResearchResult>({
    model: process.env.GROQ_MODEL_RESEARCH,
    temperature: 0.4,
    json: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Idea context to research and strengthen:\n${contextStr}\n\nProduce findings and strengthening suggestions.`,
      },
    ],
  });

  if (!Array.isArray(result.findings) || !Array.isArray(result.suggestions)) {
    throw new Error("Research agent returned malformed output");
  }
  return result;
}
