// Groq API client for BRAINS multi-agent system.
// Reads GROQ_API_KEY from env (set on Vercel / .env.local).

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODELS = {
  // Primary reasoning model — used for all specialist agents.
  primary: "llama-3.3-70b-versatile",
  // Fast/cheap model — used for lightweight scoring & evaluations.
  fast: "llama-3.1-8b-instant",
} as const;

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqChatOptions {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Request JSON object output (Groq supports response_format json_object). */
  json?: boolean;
}

/**
 * Call Groq chat completions. Returns the assistant message content.
 * Throws on missing key or non-2xx.
 */
export async function groqChat(opts: GroqChatOptions): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model ?? GROQ_MODELS.primary,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.4,
      ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Call Groq and parse a JSON object response. Retries once if parsing fails
 * (models occasionally wrap JSON in prose).
 */
export async function groqJSON<T = unknown>(opts: GroqChatOptions): Promise<T> {
  const raw = await groqChat({ ...opts, json: true });
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Try to extract the first {...} block.
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error(`Groq did not return valid JSON: ${raw.slice(0, 200)}`);
  }
}
