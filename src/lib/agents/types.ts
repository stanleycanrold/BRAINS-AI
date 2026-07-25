// Shared types for the BRAINS multi-agent system.
// Each stage of the engine has a specialist agent. An evaluation agent
// reviews every other agent's output for a feedback/quality loop.

export interface IdeaContext {
  description?: string | null;
  productDesc?: string | null;
  stage?: string | null;
  targetUser?: string | null;
  problem?: string | null;
  audience?: string | null;
  solution?: string | null;
  whyNow?: string | null;
  traction?: string | null;
  competitors?: string | null;
  assets?: Record<string, unknown> | null;
}

// ─── Capture agent ───
export interface RankedAssumption {
  text: string;
  risk: "low" | "medium" | "high";
  uncertainty: "low" | "medium" | "high";
  rank: number;
  rationale: string;
}

export interface StructuredHypothesis {
  problem: string;
  buyer: string;
  promisedChange: string;
  whyNow: string;
}

export interface CaptureResult {
  hypothesis: StructuredHypothesis;
  assumptions: RankedAssumption[];
  summary: string;
  sharpenedContext: Partial<IdeaContext> & { notes?: string };
}

// ─── Research agent ───
export interface ResearchFinding {
  source: string;
  url?: string;
  excerpt: string;
  relevance: "high" | "medium" | "low";
}

export interface ResearchSuggestion {
  suggestion: string;
  rationale: string;
  sourceUrl?: string;
  field: "problem" | "audience" | "solution" | "whyNow" | "competitors" | "targetUser";
}

export interface ResearchResult {
  findings: ResearchFinding[];
  suggestions: ResearchSuggestion[];
  summary: string;
}

// ─── Validation agent ───
export interface InterviewPrompt {
  prompt: string;
  category: "problem" | "urgency" | "budget" | "workflow" | "alternatives" | "commitment";
}

export interface SignalScore {
  strength: "weak" | "medium" | "strong";
  reasoning: string;
}

export interface ValidationResult {
  prompts: InterviewPrompt[];
  signalScoring?: SignalScore;
  notes: string;
}

// ─── Verdict agent ───
export interface VerdictResult {
  verdict: "strong_yes" | "lean_yes" | "mixed" | "lean_no" | "strong_no";
  confidence: number;
  evidenceSummary: string;
  signalDistribution: { weak: number; medium: number; strong: number };
  nextSteps: string[];
}

// ─── Evaluation agent (feedback loop) ───
export interface AgentEvaluation {
  agent: string;
  strengths: string[];
  weaknesses: string[];
  score: number; // 0-100
  recommendation: "approve" | "revise" | "reject";
  suggestedFixes: string[];
}
