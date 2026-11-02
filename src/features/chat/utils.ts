import type { Element } from "hast";
import type { MessageMetrics } from "./types";

interface WireMessage {
  role: "user" | "assistant";
  content: string;
}

/** Per-message overhead for the chat template's role markers. */
const MESSAGE_OVERHEAD_TOKENS = 4;

/**
 * ponytail: chars/3 heuristic, deliberately pessimistic for Persian. Swap in the
 * model's real tokenizer if trimming ever drops turns that would have fit.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3) + MESSAGE_OVERHEAD_TOKENS;
}

/**
 * Drops the oldest messages until the rest fit in `budget` tokens. The newest
 * message is always kept, and the result never starts with an assistant turn.
 */
export function trimHistory<T extends WireMessage>(
  messages: readonly T[],
  budget: number,
): { kept: T[]; dropped: number } {
  let used = 0;
  let start = messages.length;
  while (start > 0) {
    const cost = estimateTokens(messages[start - 1].content);
    if (start < messages.length && used + cost > budget) break;
    used += cost;
    start--;
  }
  while (start < messages.length - 1 && messages[start].role === "assistant") start++;
  return { kept: messages.slice(start), dropped: start };
}

/** Generation speed, measured from the first token so queueing time doesn't skew it. */
export function tokensPerSecond({ ttftMs, totalMs, completionTokens }: MessageMetrics): number | undefined {
  if (ttftMs === undefined || totalMs === undefined || !completionTokens) return undefined;
  const seconds = (totalMs - ttftMs) / 1000;
  return seconds > 0 ? completionTokens / seconds : undefined;
}

/** Reads `language-xxx` from the <code> inside a markdown <pre> node. */
export function codeLanguage(pre: Element | undefined): string | undefined {
  const code = pre?.children.find((child): child is Element => child.type === "element" && child.tagName === "code");
  const classes = code?.properties.className;
  if (!Array.isArray(classes)) return undefined;
  const match = classes.map(String).find((c) => c.startsWith("language-"));
  return match?.slice("language-".length);
}

/** Prose text of a markdown block, skipping inline code (identifiers shouldn't sway its direction). */
export function blockText(node: Element | undefined): string {
  if (!node) return "";
  let text = "";
  for (const child of node.children) {
    if (child.type === "text") text += child.value;
    else if (child.type === "element" && child.tagName !== "code") text += ` ${blockText(child)} `;
  }
  return text;
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
