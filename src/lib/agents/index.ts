// BRAINS multi-agent system — one specialist per engine stage.
//
//   captureAgent      → Stage 0: structure idea → hypothesis + assumptions
//   researchAgent     → Stage 1: research + strengthening suggestions
//   validationAgent   → Stage 2: non-leading interview prompts + signal scoring
//   verdictAgent      → Stage 3: decision-grade verdict + next steps
//   evaluateAgent     → feedback loop: reviews any agent's output
//
// All agents are powered by Groq (Llama models). Each reads its model from an
// optional env var (GROQ_MODEL_<STAGE>) so stages can be tuned independently.

export { captureAgent } from "./capture";
export { researchAgent } from "./research";
export { validationAgent, scoreSignal } from "./validation";
export { verdictAgent } from "./verdict";
export { evaluateAgent } from "./evaluation";
export type * from "./types";
