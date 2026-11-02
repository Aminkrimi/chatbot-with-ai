/** qwen3.5-35b-a3b context window: input + output share it. */
export const CONTEXT_WINDOW_TOKENS = 32_768;

/** Thinking tokens count as output, so the API rejects smaller budgets when thinking is on. */
export const MIN_THINKING_MAX_TOKENS = 2048;

export const DEFAULT_MAX_TOKENS = 4096;
export const MAX_MAX_TOKENS = 16_384;

export const DEFAULT_TEMPERATURE = 0.7;

export const MAX_SYSTEM_PROMPT_CHARS = 8000;
export const MAX_MESSAGE_CHARS = 60_000;
export const MAX_MESSAGES = 200;

/** The token budget the API actually receives for a request. */
export function effectiveMaxTokens(maxTokens: number, thinking: boolean): number {
  return thinking ? Math.max(maxTokens, MIN_THINKING_MAX_TOKENS) : maxTokens;
}
