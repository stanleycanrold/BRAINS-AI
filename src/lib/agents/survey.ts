// Survey Generator Agent — generates a ready-to-edit validation questionnaire
// from the hypothesis. The founder reviews and edits before publishing.
//
// Track differences:
//   fast  → fewer questions, expert-panel focused, paid respondents
//   slow  → fuller interview-style questionnaire, organic / free respondents

import { groqJSON } from "../groq";

export interface GeneratedSurvey {
  title: string;
  intro: string;          // shown to respondents before questions
  outreachMessage: string; // ready-to-send, with {{LINK}} placeholder
  questions: Array<{
    question: string;
    category: string;
    isGating: boolean;    // exactly one — the ≥50% gate question
    isRequired: boolean;
  }>;
  targetCount: number;    // recommended minimum responses
}

const SYSTEM_PROMPT = `You are the SURVEY GENERATOR AGENT for BRAINS AI, a 0→1 startup validation engine.
You design problem-first validation questionnaires that BRAINS sends to respondents.

Your job: produce a READY-TO-EDIT questionnaire draft from the hypothesis.

Rules (hard):
- Problem-first. NO leading questions. NO "would you use…" or "would you pay…".
- Ask about past behavior and real experience, not hypotheticals.
- Exactly ONE question must be the GATING question: "Do you experience [problem]?" (the ≥50% decision gate).
- The gating question determines whether the respondent actually has the problem.
- Cover: problem experience, frequency, current workaround, urgency, budget, alternatives.
- FAST track (paid experts): 5-7 questions, focused and high-signal.
- SLOW track (organic): 7-10 questions, fuller interview-style.
- Write an INTRO that explains the survey neutrally — no pitching the solution.
- Write an OUTREACH MESSAGE the founder can send to respondents. Neutral, problem-focused, includes {{LINK}} placeholder for the survey URL. No product pitch.
- Set targetCount: 5 for fast (paid experts), 10 for slow (organic).

Return ONLY JSON matching the requested shape.`;

export async function surveyGeneratorAgent(input: {
  hypothesis: { problem: string; buyer: string; promisedChange: string; whyNow?: string | null };
  track: "slow" | "fast";
  ideaTitle: string;
}): Promise<GeneratedSurvey> {
  const result = await groqJSON<GeneratedSurvey>({
    temperature: 0.4,
    json: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Idea: ${input.ideaTitle}\nHypothesis:\n- Problem: ${input.hypothesis.problem}\n- Buyer: ${input.hypothesis.buyer}\n- Promised change: ${input.hypothesis.promisedChange}\n- Why now: ${input.hypothesis.whyNow ?? "n/a"}\n\nTrack: ${input.track}\n\nGenerate the questionnaire draft.`,
      },
    ],
  });

  // Validate: exactly one gating question.
  const gatingCount = result.questions?.filter((q) => q.isGating).length ?? 0;
  if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
    throw new Error("Survey generator returned no questions");
  }
  if (gatingCount === 0) {
    // Auto-flag the first question as gating if the model forgot.
    result.questions[0].isGating = true;
  } else if (gatingCount > 1) {
    // Keep only the first gating question.
    let seen = false;
    result.questions = result.questions.map((q) => {
      if (q.isGating) {
        if (seen) q.isGating = false;
        seen = true;
      }
      return q;
    });
  }

  return result;
}
