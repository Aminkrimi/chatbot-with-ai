import "server-only";
import OpenAI from "openai";

const DEFAULT_BASE_URL = "https://ai.fiotrix.com/v1";

export const CHAT_MODEL = process.env.FIOTRIX_MODEL ?? "qwen3.5-35b-a3b";

let client: OpenAI | undefined;

/** Lazily created so `next build` works without the key; fails loudly on first use instead. */
export function getLLMClient(): OpenAI {
  const apiKey = process.env.FIOTRIX_API_KEY;
  if (!apiKey) throw new Error("FIOTRIX_API_KEY is not set (see .env.example).");

  client ??= new OpenAI({
    apiKey,
    baseURL: process.env.FIOTRIX_BASE_URL ?? DEFAULT_BASE_URL,
    // The SDK retries 408/409/429/5xx and connection errors, honoring Retry-After.
    maxRetries: 2,
  });
  return client;
}
