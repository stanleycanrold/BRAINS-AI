// AI utilities for BRAINS — idea strengthening, interview prompts, signal scoring.
// All AI ASSISTS; it never blesses. Human reviews fast-track analysis.

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

export interface InterviewPrompt {
  prompt: string;
  category: "problem" | "urgency" | "budget" | "workflow" | "alternatives" | "commitment";
}

/**
 * Generate non-leading interview prompts from a hypothesis.
 * Rules from PRD §7: problem-first, no "would you use...", no leading language.
 */
export function buildInterviewPrompts(hypothesis: {
  problem: string;
  buyer: string;
  promisedChange: string;
  whyNow?: string;
}): InterviewPrompt[] {
  return [
    {
      prompt: `Tell me about the last time you experienced ${hypothesis.problem.toLowerCase()}. Walk me through what happened.`,
      category: "problem",
    },
    {
      prompt: `How often does this come up? What triggers it?`,
      category: "problem",
    },
    {
      prompt: `What do you currently do when this happens? Talk me through your workaround.`,
      category: "workflow",
    },
    {
      prompt: `What's the hardest part about dealing with this?`,
      category: "problem",
    },
    {
      prompt: `How much time or money does this cost you? Can you put a number on it?`,
      category: "budget",
    },
    {
      prompt: `When did you last look for a solution to this? What did you try?`,
      category: "alternatives",
    },
    {
      prompt: `Why hasn't this been solved already? What's been stopping you?`,
      category: "urgency",
    },
    {
      prompt: `If this problem disappeared tomorrow, what would change for you?`,
      category: "commitment",
    },
    {
      prompt: `Who else do you know who deals with this? Would you be open to connecting us?`,
      category: "commitment",
    },
  ];
}

/**
 * Suggest a signal score from interview notes.
 * Human confirms on fast track (PRD §7).
 */
export function suggestSignalStrength(notes: {
  commitmentLanguage?: boolean;
  budgetMentioned?: boolean;
  activeWorkaround?: boolean;
  frequency?: "rare" | "occasional" | "frequent";
}): "weak" | "medium" | "strong" {
  let score = 0;
  if (notes.commitmentLanguage) score += 3;
  if (notes.budgetMentioned) score += 2;
  if (notes.activeWorkaround) score += 2;
  if (notes.frequency === "frequent") score += 2;
  if (notes.frequency === "occasional") score += 1;

  if (score >= 5) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}

/**
 * Map aggregate signal strengths to a verdict band with confidence.
 * Directional — to be refined (PRD §8).
 */
export function calculateVerdict(signals: {
  weak: number;
  medium: number;
  strong: number;
}) {
  const total = signals.weak + signals.medium + signals.strong;
  if (total === 0) {
    return { verdict: "mixed" as const, confidence: 0 };
  }

  const weightedScore =
    (signals.strong * 3 + signals.medium * 2 + signals.weak * 1) / total;
  // weightedScore ranges 1.0 (all weak) to 3.0 (all strong)
  const confidence = Math.min(
    100,
    Math.round((total / 10) * 100 * (weightedScore / 3)),
  );

  let verdict: "strong_yes" | "lean_yes" | "mixed" | "lean_no" | "strong_no";

  if (weightedScore >= 2.6) verdict = "strong_yes";
  else if (weightedScore >= 2.0) verdict = "lean_yes";
  else if (weightedScore >= 1.5) verdict = "mixed";
  else if (weightedScore >= 1.2) verdict = "lean_no";
  else verdict = "strong_no";

  return { verdict, confidence };
}

/**
 * Generate AI-powered next steps based on the verdict.
 */
export function generateNextSteps(verdict: string, context: {
  track: string;
  signalCounts: { weak: number; medium: number; strong: number };
}): string[] {
  const steps: string[] = [];

  switch (verdict) {
    case "strong_yes":
      steps.push("Proceed to the offer stage — turn your validated insight into a clear promise.");
      steps.push("Scope the one-job MVP from proven demand, not the dream roadmap.");
      steps.push(`Run ${context.track === "slow" ? "a fast-track" : "another"} round to deepen confidence before building.`);
      break;
    case "lean_yes":
      steps.push("Sharpen your ICP — which subset of interviewees showed the strongest signals?");
      steps.push("Run 3-5 more interviews targeting that specific subset.");
      steps.push("Draft a test offer and see if buyers can repeat it back.");
      break;
    case "mixed":
      steps.push("Split your signals by segment — which audience shows consistency vs. noise?");
      steps.push("Consider pivoting the wedge: which part of the problem had the strongest pull?");
      steps.push("Re-run validation with a tighter ICP before deciding.");
      break;
    case "lean_no":
      steps.push("Identify the one assumption that failed — is it the problem, the buyer, or the solution?");
      steps.push("Consider pivoting the buyer or problem before abandoning the space.");
      steps.push("If you iterate, revise the context and start a new validation cycle.");
      break;
    case "strong_no":
      steps.push("This idea as currently framed does not have enough demand signal.");
      steps.push("Before killing entirely: is there a different audience or wedge worth testing?");
      steps.push("If not, document what you learned and move to a new idea.");
      break;
  }

  return steps;
}
